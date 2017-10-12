import CaseTrackItem from './case-track-item';
import ElPopover from 'element-ui/packages/popover';
import emitter from 'element-ui/src/mixins/emitter';
import { TypeOf } from 'element-ui/src/utils/funcs';

export default {
  name: 'CaseTrackLane',
  componentName: 'CaseTrackLane',
  mixins: [emitter],
  components: {
    CaseTrackItem,
    ElPopover
  },
  props: {
    getComponetName: Function,       // 获取弹出窗口的模板名称
    getComponetData: Function,       // 获取模板初始化数据
    laneComponents: Object,          // 需要使用到的模板组件
    lanePopDisabled: Boolean,        // 是否禁用弹出面板
    itemPopDisabled: Boolean,
    statusIcons: Object,    // 状态图标
    placement: String,
    hasMoreIcon: String,
    lineColor: String,
    itemWidth: Number,
    index: [Number, String],
    lane: null,
    store: null
  },
  data(){
    return{
      // 结点状态:  已处理 complete  处理中 processing  未接收 unreceived  已终止 terminated  未触发 untriggered
      status: '',
      dataLoading: false,
      componentName: null,
      componentData: null,
      laneHeight: null
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
        return { bottom: '-' + (this.svgHeight) + 'px' };
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
    ie9styl() { // 修复IE9样式
      if(navigator.appName == "Microsoft Internet Explorer" && 
        navigator.appVersion.split(";")[1].replace(/\s/g,'')=="MSIE9.0") {
        return {top: '-10px', right: '-10px'};
      } if (document.documentMode) {
        return {top: '-35px', right: 0};
      } else {
        return {};
      }
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

    laneItemClick(lane, e){
      this.dispatch('CaseTrack', 'item-click', {node:lane, event:e});
    },

    laneIconClick(node, e){
      e.stopPropagation();
      if(this.lane.nextLevel == 1){ // 更多图标点击才有效
        this.dispatch('CaseTrack', 'icon-click', {node:node, event:e});
      }
    },

    initComponentName(args){
      if(TypeOf(this.getComponetName) === 'Function'){
        let name =  this.getComponetName( args);
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
      if(TypeOf(this.$options.components[name]) === 'Object'){
          return true;
        }
      return false;
    },

    upDateLaneHeight(hgt){
      this.laneHeight = hgt;
    },

    startLoading(v){
      this.dataLoading = v;
    },

    hasLanes(data, index){
      if(data && data[index]){
        return typeof data[index].lanes === 'object';
      }
      return false;
    }
  },

  created(){
    if(TypeOf(this.laneComponents) === 'Object'){
      for(let i in this.laneComponents){
        if(TypeOf(this.laneComponents[i]) === 'Object'){
          this.$options.components[i] = this.laneComponents[i];
        }
      }
    }
  },

  mounted(){
    this.$on('start-loading', this.startLoading);
    this.$on('update-lane-height', (hgt)=>{ this.laneHeight = hgt; });
    this.$nextTick(function(){ this.initComponentName(this.lane.args); });
  },

  render(h){
    let directives = [ { name: 'popover', arg:'lanePopv' } ];

    function getStatusIcons(self, status) {
      let icons = 'icon ', 
          icon_cls = self.setIcons(self, status);
      if(self.lane.nextLevel == 1){
        icons += self.hasMoreIcon;
      }else if(icon_cls) {  
        icons += 'status ' + icon_cls; 
      }
      return icons;
    }
 
    return (
       <div class="lane" style={ this.laneHeight ? this.laneHeight : {} }>
        <el-popover 
          disabled={ !this.hasComponent(this.componentName) || this.lanePopDisabled }
          placement={ this.lane.placement || this.placement }
          trigger="hover"
          ref="lanePopv"> 
          { 
            (this.dataLoading && this.hasComponent(this.componentName))
            ? this.$createElement(this.componentName, {
                props:{
                  tmplData: !this.lanePopDisabled ? this.initComponetData(this.lane.args) : null
                }
              })
            : <span class="el-icon-loading"></span>
          } 
        </el-popover>
        {
          this.lane.title ? <div { ...{ directives } }
            class={ "lane-title " + this.lane.status }
            on-click={ ($event)=> this.laneItemClick(this.lane, $event) }>
            { 
              (typeof this.lane.badge !== 'undefined' && this.lane.badge > 0 )
              ? <i class="info-badge"></i> : ''
            }
            { this.lane.title }
            { 
              (this.lane.nextLevel == 1 || this.lane.status)
              ? <i 
                class={ getStatusIcons(this, this.lane.status) }
                on-click={ ($event)=> this.laneIconClick(this.node, $event) }>
              </i> : ''
            }
            { 
              (typeof this.lane.sendBack !== 'undefined' && this.lane.sendBack > 0)
              ? <span class="send-back el-icon-send-back" style={ this.ie9styl }>
                { this.store.CaseTrack.getSendBackWords(this.lane.sendBack) }
              </span> : ''
            }
          </div>: ''
        }
        <div class="lane-label">{ this.lane.label }</div>
        {
          this._l(this.lane.nodes, (node, $index)=>[
            <case-track-item
              has-more-icon={ this.hasMoreIcon }
              lane-pop-disabled={ this.lanePopDisabled }
              item-pop-disabled={ this.itemPopDisabled }
              get-componet-name={ this.getComponetName }
              get-componet-data={ this.getComponetData }
              item-components={ this.laneComponents }
              pre-node={ this.lane.nodes[$index - 1] }
              next-node={ this.lane.nodes[$index + 1] }
              is-group-start={ this.hasLanes(this.lane.nodes, $index + 1) }
              is-group-end={ this.hasLanes(this.lane.nodes, $index - 1) }
              is-last-node={ (this.lane.nodes.length-1) === $index }
              status-icons={ this.statusIcons }
              placement={ this.placement }
              line-color={ this.lineColor }
              width={ this.itemWidth }
              store={ this.store } 
              index={ $index } 
              nodes={ this.lane.nodes }  
              node={ node } >
            </case-track-item>
          ])
        }
      </div>
    );
  }
};
