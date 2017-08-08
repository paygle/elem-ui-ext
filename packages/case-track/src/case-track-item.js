import ElPopover from 'element-ui/packages/popover';
import emitter from 'element-ui/src/mixins/emitter';
import { TypeOf } from 'element-ui/src/utils/funcs';

const Snap = window.Snap || null;
const mina = window.mina || null;

const arrowPoints = {
  start: [
    '11.292,1.5 5.36,1.5 5.36,0 11.292,0',
    '0,0 8.397,14.294 16.652,0 0,0'
  ],
  shortEnd: [
    '11.292,2.5 5.36,2.5 5.36,0.325 11.292,0.325',
    '0,2 8.397,16.294 16.652,2 0,2'
  ],
  end: [
    '11.292,26.002 5.36,26.002 5.36,0 11.292,0',
    '0,26.002 8.397,40.296 16.652,26.002 0,26.002'
  ],
  longEnd: [
    '11.292,72.005 5.36,72.005 5.36,0 11.292,0',
    '0,72.005 8.397,86.299 16.652,72.005 0,72.005'
  ]
};
const pointAng = '0,9 8.397,23.294 16.652,9';
  
export default {
  name: 'CaseTrackItem',
  componentName: 'CaseTrackItem',
  mixins: [emitter],
  components: {
    ElPopover
  },
  props: {
    getComponetName: Function,       // 获取弹出窗口的模板名称
    getComponetData: Function,       // 获取模板初始化数据
    itemComponents: Object,          // 需要使用到的模板组件
    itemPopDisabled: Boolean,        // 是否禁用弹出面板
    hasMoreIcon: String,
    placement: String,
    width: Number,
    svgWidth: {
      type: Number,
      default(){
        return 17;
      }
    },
    svgHeight: {
      type: Number,
      default(){
        return 40;
      }
    },
    svgColor: {
      type: String,
      default(){
        return '#ccc';
      }
    },
    nextNode: [Array, Object], 
    isGroupStart: Boolean,   // 是否为组开始前的第一个元素
    isGroupEnd: Boolean,     // 是否为组结束的第一个元素
    isLastNode: Boolean,     // 是否为最后一个元素
    index: [Number, String],
    node: null,
    store: null
  },
  data(){
    return{
      // 结点状态:  已处理 complete  处理中 processing  未接收 unreceived  已终止 terminated  未触发 untriggered
      status: '',
      dataLoading: false,  
      componentName: null,
      componentData: null
    };
  },
  computed:{
    ItemStyle(){
      if(this.width && !isNaN(this.width)){
        return {width: this.width + 'px'};
      }
      return {};
    },
    svgStyle(){
      if(this.svgHeight){
        return { bottom: "-" + (this.svgHeight) + 'px' };
      }
      return {};
    },
    topSvgStyl(){
      if(this.svgHeight){
        return { bottom: + (this.svgHeight - 10) + 'px' };
      }
      return {};
    },
    topSvgHeight(){
      if(this.isGroupEnd){
        return this.svgHeight / 2;
      }
      return this.svgHeight;
    }
  },
  methods:{

    itemClick(node, e){
      this.dispatch('CaseTrack', "item-click", {node:node, event:e});
    },

    iconClick(node, e){
      e.stopPropagation();
      this.dispatch('CaseTrack', "icon-click", {node:node, event:e});
    },

    arrowDraw(){

      this.$nextTick(function(){

        let topsvg = this.$refs.SvgMapTop;
        let svgSty = {fill:this.svgColor};
        let lineSet = { stroke: this.svgColor, strokeWidth: 5	};

        if(!this.isLastNode){
          let s = Snap(this.$refs.SvgMap);
          let rect = s.polygon(arrowPoints.start[0]).attr(svgSty);
          let angle = s.polygon(arrowPoints.start[1]).attr(svgSty);
          let lanesLen = this.nextNode && this.nextNode.lanes ? this.nextNode.lanes.length : 0;
          if(this.isGroupStart && lanesLen>1){
            rect.animate({points:arrowPoints.shortEnd[0]}, 1000, mina.easein);
            angle.animate({points:arrowPoints.shortEnd[1]}, 1000, mina.easein);
          }else if(this.isGroupEnd && topsvg){
            Snap(topsvg).line(8, 0, 8, this.topSvgHeight).attr(lineSet);
            Snap(topsvg).polygon(pointAng).attr(svgSty);
            rect.animate({points:arrowPoints.end[0]}, 1000, mina.easein);
            angle.animate({points:arrowPoints.end[1]}, 1000, mina.easein);
          }else{
            rect.animate({points:arrowPoints.end[0]}, 1000, mina.easein);
            angle.animate({points:arrowPoints.end[1]}, 1000, mina.easein);
          }
        }
        
        if(this.isLastNode) {
          if(this.isGroupEnd && topsvg){
            Snap(topsvg).line(8, 0, 8, this.topSvgHeight).attr(lineSet);
            Snap(topsvg).polygon(pointAng).attr(svgSty);
          }
          this.dispatch('CaseTrack', 'load-node-data', true);
        }
      });
    },

    initComponentName(args){
      if(TypeOf(this.getComponetName) === 'Function'){
        let name =  this.getComponetName(args);
        this.componentName = name;
        return name;
      }
      return false;
    },

    initComponetData(args) {
      if(TypeOf(this.getComponetData) === 'Function'){
        let data =  this.getComponetData(args);
        this.componentData = data;
        return data;
      }
      return null;
    },

    hasComponent(name){
      if(name && this.$options.components[name]){
          return true;
        }
      return false;
    },

    startLoading(v){
      this.dataLoading = v;
    },

    getFormatTitle(h, t){
      if(t){
        let tp=[];
        let rgx = /(<br>|<br\/>)/ig;
        let arr = String(t).split(rgx);
        for(let i=0; i< arr.length; i++){
          if(!rgx.test(arr[i])){
            tp.push(arr[i]);
          }
        }
        return this._l(tp, (val, $index)=>[ <p>{val}</p> ]);
      }
      return '';
    }
  },

  created(){
    if(TypeOf(this.itemComponents) === 'Object'){
      for(let i in this.itemComponents){
        if(this.itemComponents.hasOwnProperty(i)){
          this.$options.components[i] = this.itemComponents[i];
        }
      }
    }
  },

  mounted(){
    this.arrowDraw();
    this.$on('start-loading', this.startLoading);
    this.$nextTick(function(){ this.initComponentName(this.node.args); });
  },

  render(h){
    let directives = [ { name: 'popover', arg:'itemPopv' } ];
    return (
      <div class="case-track-item">
        <el-popover 
          disabled={ !this.hasComponent(this.componentName) || this.itemPopDisabled }
          placement={ this.node.placement || this.placement }
          trigger="hover"
          ref="itemPopv"> 
          {
            (this.dataLoading && this.hasComponent(this.componentName))
              ? this.$createElement(this.componentName, {
                props:{
                  tmplData: !this.itemPopDisabled ? this.initComponetData(this.node.args) : null
                }
              })
              : <span class="el-icon-loading"></span>
          }
        </el-popover>
        <div class="tilte" 
          style={ this.ItemStyle }>
          {
              this.isGroupEnd ? <svg ref="SvgMapTop" 
              style={ this.topSvgStyl } 
              width={ this.svgWidth + 'px' } 
              height={ this.topSvgHeight + 'px' } 
              version="1.1" 
              xmlns="http://www.w3.org/2000/svg"></svg> : ''
          }
            <svg ref="SvgMap" style={ this.svgStyle } 
            width={ this.svgWidth + 'px' } 
            height={ this.svgHeight + 'px' } 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg"></svg>
            
            <div { ...{ directives } }
              class={ "title-box " + this.node.status }
              style={ this.node.shapeIcon ? { border:0, backgroundColor:'transparent'} : {}}
              on-click={ ($event)=> this.itemClick(this.node, $event) }>
              { !this.node.shapeIcon ? this.getFormatTitle(h, this.node.title) : '' }
              { this.node.shapeIcon ? <span class={ "shape " + this.node.shapeIcon }></span> : '' }
              {
                (this.node.nextLevel == 1) && !this.node.shapeIcon 
                  ? <i 
                    class={ "icon " + this.hasMoreIcon } 
                    on-click={ ($event)=> this.iconClick(this.node, $event) }>
                  </i> : ''
              }
            </div>
          </div>
          
      </div>
    );
  }
};
