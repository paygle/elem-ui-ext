import ElPopover from 'element-ui/packages/popover';
import emitter from 'element-ui/src/mixins/emitter';
import CaseTrackGroup from './case-track-group';
import { TypeOf } from 'element-ui/src/utils/funcs';

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
    lanePopDisabled: Boolean,        // 是否禁用弹出面板
    itemPopDisabled: Boolean,        // 是否禁用弹出面板
    statusIcons: Object,             // 状态图标
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
    lineColor: {
      type: String,
      default(){
        return '#ccc';
      }
    },
    nextNode: [Array, Object], 
    preNode: [Array, Object], 
    isLastEnd: Boolean,     // 是否为外层最后一个元素
    isGroupStart: Boolean,   // 是否为组开始前的第一个元素
    isGroupEnd: Boolean,     // 是否为组结束的第一个元素
    isLastNode: Boolean,     // 是否为最后一个元素
    index: [Number, String],
    node: null,
    nodes: null,
    store: null
  },
  data(){
    return{
      // 结点状态:  已处理 complete  处理中 processing  未接收 unreceived  已终止 terminated  未触发 untriggered
      status: '',
      dataLoading: false,  
      componentName: null,
      componentData: null,
      msgTimes: 0
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
    },
    hasPreOneLane() {
      if(this.preNode && this.preNode.lanes && this.preNode.lanes.length === 1) {
        return true;
      }
      return false;
    },
    ie9styl() { // 修复IE9样式
      if(navigator.appName == "Microsoft Internet Explorer" && 
        navigator.appVersion.split(";")[1].replace(/\s/g,'')=="MSIE9.0") {
        return {top: '-10px', right: '-10px'};
      }
      return {};
    }
  },
  methods:{

    setIcons(self, status) { // 获取状态图标
      let icon_class;
      self = self || this;
      if(self.statusIcons){
        icon_class = self.statusIcons[status];
      }
      return icon_class;
    },

    itemClick(node, e){
      this.dispatch('CaseTrack', "item-click", {node:node, event:e});
    },

    iconClick(node, e){
      e.stopPropagation();
      if(this.node.nextLevel == 1){ // 更多图标点击才有效
        this.dispatch('CaseTrack', "icon-click", {node:node, event:e});
      }
    },

    // 绘制箭头
    drawArrow(ctxdom, fromX, fromY, toX, toY, theta, headlen, width, color) {

      theta = typeof(theta) != 'undefined' ? theta : 30; 
      headlen = typeof(headlen) != 'undefined' ? headlen : 8; 
      width = typeof(width) != 'undefined' ? width : 2; 
      color = typeof(color) != 'undefined' ? color : this.lineColor; 

      let ctx = ctxdom ? ctxdom.getContext('2d') : null, arrowX, arrowY,
        angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI, 
        angle1 = (angle + theta) * Math.PI / 180, 
        angle2 = (angle - theta) * Math.PI / 180, 
        topX = headlen * Math.cos(angle1), 
        topY = headlen * Math.sin(angle1), 
        botX = headlen * Math.cos(angle2), 
        botY = headlen * Math.sin(angle2); 

      if(!ctx) return;
      ctx.save(); 
      ctx.beginPath(); 

      // arrowX = fromX - topX;
      // arrowY = fromY - topY; 
      // ctx.moveTo(arrowX, arrowY); 
      // ctx.lineTo(fromX, fromY); 
      arrowX = fromX - botX; 
      arrowY = fromY - botY; 
      ctx.lineTo(arrowX, arrowY); 
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY); // other side 
      ctx.strokeStyle = color; 
      ctx.lineWidth = width; 
      ctx.stroke();

      ctx.beginPath();
      arrowX = toX + topX; 
      arrowY = toY + topY; 
      ctx.moveTo(arrowX, arrowY); 
      ctx.lineTo(toX, toY); 
      arrowX = toX + botX; 
      arrowY = toY + botY; 
      ctx.lineTo(arrowX, arrowY); 
      ctx.closePath();
      ctx.strokeStyle = color; 
      ctx.lineWidth = width; 
      ctx.fillStyle= color;
      ctx.fill();
      ctx.stroke(); 
      ctx.restore(); 
    },

    arrowDraw(){

      this.$nextTick(function(){

        let canvasTop =  this.$refs.canvasTop;
        if(!this.isLastNode){
            let lanesLen = this.nextNode && this.nextNode.lanes ? this.nextNode.lanes.length : 0;
          if(this.isGroupStart && lanesLen>1){
            this.drawArrow(this.$refs.canvasArrow, 8, 0, 8, 15);
          }else if(this.isGroupEnd && canvasTop){
            this.drawArrow(canvasTop, 8, 1, 8, 18);
            this.drawArrow(this.$refs.canvasArrow, 8, 0, 8, 38);
          }else{
            this.drawArrow(this.$refs.canvasArrow, 8, 0, 8, 38);
          }
        }else if(this.isGroupEnd && canvasTop) {
          if(this.hasPreOneLane) {
            this.drawArrow(canvasTop, 8, 1, 8, 38);
          }else{
            this.drawArrow(canvasTop, 8, 1, 8, 18);
          }
        }
        
        if(this.isLastNode) {
            if(!this.isLastEnd) {
              this.drawArrow(this.$refs.canvasArrow, 8, 0, 8, 18);
            }
          if (this.msgTimes < 5) {
            ++this.msgTimes;
            this.dispatch('CaseTrack', 'load-node-data', true);
            this.dispatch('CaseTrackGroup', 'load-node-data', true);
          }
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
      if(this.isLastNode){
        this.$nextTick(function(){
          if (this.msgTimes < 5) {
            ++this.msgTimes;
            this.dispatch('CaseTrack', 'group-updated', true);
            this.dispatch('CaseTrackGroup', 'group-updated', true);
          }
        });
      }
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
    },

    renderGroup(h){
      if(!this.node.lanes || this.node.lanes.length < 1) return;
      return (
        <case-track-group
          next-node={ this.nodes[this.index + 1] }
          is-last-node={ (this.nodes.length-1) === this.index }
          has-more-icon={ this.hasMoreIcon }
          lane-pop-disabled={ this.lanePopDisabled }
          item-pop-disabled={ this.itemPopDisabled }
          get-componet-name={ this.getComponetName }
          get-componet-data={ this.getComponetData }
          status-icons={ this.statusIcons }
          components={ this.itemComponents }
          itemWidth={ this.width }
          line-color={ this.svgColor }
          placement={ this.placement }
          store={ this.store } 
          index={ this.index } 
          nodes={ this.node }>
        </case-track-group>
      );
    },
  
    renderItem(h){
      let self = this, directives = [ { name: 'popover', arg:'itemPopv' } ];
      
      function getStatusIcons(self, status) {
        let icons = 'icon ', 
            icon_cls = self.setIcons(self, status);
        if(self.node.nextLevel == 1){
          icons += self.hasMoreIcon;
        }else if(icon_cls) {  
          icons += 'status ' + icon_cls; 
        }
        return icons;
      }

      function getTopHeight() {
        if(self.hasPreOneLane) {
          return self.topSvgHeight * 2;
        }else {
          return self.topSvgHeight;
        }
      }

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
              this.isGroupEnd ? <canvas ref="canvasTop" 
                class="canvas-top" 
                style={ this.topSvgStyl } 
                width={ this.svgWidth } 
                height={ getTopHeight() }>
              </canvas> : ''
            }
            <canvas ref="canvasArrow" class="canvas-arrow" 
              style={ this.svgStyle } 
              width={ this.svgWidth } 
              height={ this.svgHeight }>
            </canvas>
            
            <div { ...{ directives } }
              class={ "title-box " + this.node.status }
              style={ this.node.shapeIcon ? { border:0, backgroundColor:'transparent'} : {}}
              on-click={ ($event)=> this.itemClick(this.node, $event) }>
              { 
                (typeof this.node.badge !== 'undefined' && this.node.badge > 0 && !this.node.shapeIcon)
                ? <i class="info-badge"></i> : ''
              }
              { !this.node.shapeIcon ? this.getFormatTitle(h, this.node.title) : '' }
              { this.node.shapeIcon ? <span class={ "shape " + this.node.shapeIcon }></span> : '' }
              {
                (this.node.nextLevel == 1 || this.node.status) && !this.node.shapeIcon 
                  ? <i 
                    class={ getStatusIcons(this, this.node.status) } 
                    on-click={ ($event)=> this.iconClick(this.node, $event) }>
                  </i> : ''
              }
              { 
                (typeof this.node.sendBack !== 'undefined' && this.node.sendBack > 0 && !this.node.shapeIcon)
                ? <span class="send-back el-icon-send-back" style={ this.ie9styl }>
                  { this.store.CaseTrack.getSendBackWords(this.node.sendBack) }
                </span> : ''
              }
            </div>
          </div>
        </div>
      );
    }
  },
  
  render(h){
    this.initComponentName(this.node.args);
    return (this.node.lanes && this.node.lanes.length) ? this.renderGroup(h): this.renderItem(h);
  },

  created(){
    if(TypeOf(this.itemComponents) === 'Object'){
      this.$options.components['CaseTrackGroup'] = CaseTrackGroup;
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
  }
};
