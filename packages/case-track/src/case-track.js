// 案件跟踪组件
import CaseTrackStore from './case-track-store';
import CaseTrackGroup from './case-track-group';
import CaseTrackItem from './case-track-item';
import emitter from 'element-ui/src/mixins/emitter';
import { hasClass, setStyle } from 'element-ui/src/utils/dom';

export default {
  name: 'CaseTrack',
  componentName: 'CaseTrack',
  mixins: [emitter],
  components: {
    CaseTrackGroup,
    CaseTrackItem
  },
  props: {
    relativeDom: {          // 窗口宽度自动调整关联节点
      type: String,
      default(){
        return 'body';
      }
    },
    mapData: Array,         // 图形数据
    statusIcons: Object,    // 状态图标
    sendBackWords: {        // 退回图标文字
      type:Array, 
      default() {
        return ['',
          '理',
          '正',
          '重'
        ];
      }
    },  
    itemWidth: Number,
    rightPanelWidth:{       // 右侧固定面板宽度
      type: Number,
      default(){
        return 80;
      }
    },
    lineColor: {            // 线条颜色
      type: String,
      default(){
        return '#ccc';
      }
    },
    hasMoreIcon: {          // 拥有二级页面时的提示图标
      type: String,
      default(){
        return 'el-icon-menu';
      }
    },
    placement: {            // 弹框位置
      type: String,
      default(){
        return 'left';
      }
    },
    lanePopDisabled: {               // 是否禁用弹出面板
      type: Boolean,
      default(){
        return false;
      }
    },
    itemPopDisabled: {               // 是否禁用弹出面板
      type: Boolean,
      default(){
        return false;
      }
    },
    components:{},              // 需要使用到的模板组件
    getComponetName: Function,  // 获取弹出窗口的模板名称
    getComponetData: Function   // 获取模板初始化数据
  },
  data(){
    const store = new CaseTrackStore(this, {
      itemWidth: 128
    });

    return{
      rightPanelTop: {},
      mapIsShow: false,
      rightPanelStatus: '',    // 右侧面板状态类名
      store
    };
  },
  watch: {
    mapData:{
      immediate: true,
      handler(val){
        this.mapIsShow = false;
        this.store.commit('setMapData', val);
        this.$nextTick(function(){
          this.mapIsShow = true;
        });
      }
    },
    components:{
      immediate: true,
      handler(val){
        this.store.states.components = this.components;
      }
    }
  },
  computed:{
    caseMapData(){
      return this.store.states.mapData;
    },
    innerItemWidth(){
      return this.store.states.itemWidth;
    }
    
  },
  methods:{
    getSendBackWords(val) {
      if(this.sendBackWords[val]) {
        return this.sendBackWords[val];
      }
      return '';
    },
    hasLanes(data, index){
      if(data && data[index]){
        return typeof data[index].lanes === 'object';
      }
      return false;
    },
    updateRightPaneTop(){
      this.$nextTick(function(){
        const autoTopPos = this.$refs.autoTopPos;
        if(autoTopPos){
          let panHgt = autoTopPos.getBoundingClientRect().height;
          this.rightPanelTop = {marginTop: ((innerHeight - panHgt)/2 -20) + 'px'};
        }
      });
    },
    rightFixPaneToggle(e){
      const rightFixedPanel = this.$refs.rightFixedPanel;
      if(rightFixedPanel && hasClass(rightFixedPanel, 'closure')){
        this.rightPanelStatus = '';
      }else{
        this.rightPanelStatus = 'closure';
      }
    },
    loadNodeData(v){
      this.initLayout();
      this.broadcast('CaseTrackLane', 'start-loading', v);
      this.broadcast('CaseTrackItem', 'start-loading', v);
    },
    initLayout(){
      this.updateRightPaneTop();
      setStyle(this.$el,'height', 'auto');
      this.$nextTick(function(){
        setStyle( 
          this.$el, 
          'height', 
          (this.$refs.trackMap.getBoundingClientRect().height + 50 ) + 'px'
        );
      });
    },
    groupUpdated(flag) {
      this.broadcast('CaseTrackGroup', 'update-gpdraw', flag);
    }
  },
  mounted(){
    if(this.itemWidth) this.store.states.itemWidth = this.itemWidth;
    this.$on('load-node-data', this.loadNodeData);
    this.$on('group-updated', this.groupUpdated);
    this.initLayout();
  },
  beforeDestroy(){
    setStyle(document.querySelector(this.relativeDom),  'width', 'auto');
  },
  render(h){
 
    return (
      <div class="case-track">
        <div ref="trackMap" class="case-track-map">
          {
            this.mapIsShow
            ? (
              this._l(this.caseMapData, (node, $index)=>[
                node.lanes && node.lanes.length>0
                ? <case-track-group
                  relative-dom={ this.relativeDom }
                  next-node={ this.caseMapData[$index + 1] }
                  is-last-node={ (this.caseMapData.length-1) === $index }
                  has-more-icon={ this.hasMoreIcon }
                  lane-pop-disabled={ this.lanePopDisabled }
                  item-pop-disabled={ this.itemPopDisabled }
                  get-componet-name={ this.getComponetName }
                  get-componet-data={ this.getComponetData }
                  status-icons={ this.statusIcons }
                  components={ this.components }
                  itemWidth={ this.innerItemWidth }
                  line-color={ this.lineColor }
                  placement={ this.placement }
                  store={ this.store } 
                  index={ $index } 
                  nodes={ node }>
                </case-track-group>
                : <case-track-item
                  has-more-icon={ this.hasMoreIcon }
                  item-pop-disabled={ this.itemPopDisabled }
                  get-componet-name={ this.getComponetName }
                  get-componet-data={ this.getComponetData }
                  item-components={ this.components }
                  pre-node={ this.caseMapData[$index - 1] }
                  next-node={ this.caseMapData[$index + 1] }
                  is-group-start={ this.hasLanes(this.caseMapData, $index + 1) }
                  is-group-end={ this.hasLanes(this.caseMapData, $index - 1) }
                  is-last-node={ (this.caseMapData.length-1) === $index }
                  is-last-end={ (this.caseMapData.length-1) === $index }
                  status-icons={ this.statusIcons }
                  placement={ this.placement }
                  line-color={ this.lineColor }
                  width={ this.innerItemWidth }
                  store={ this.store } 
                  index={ $index } 
                  node={ node } >
                </case-track-item>
              ])
            ): ''
          }
        </div>
        <div class="case-track-left">{ this.$slots.caseLeft }</div>
        <div class="case-track-right">{ this.$slots.caseRight }</div>
        {
          this.$slots.rightFixedPanel ? (
            <div  
              ref="rightFixedPanel" 
              class={ "right-fixed-panel animated " + this.rightPanelStatus } 
              style={{width:this.rightPanelWidth+'px'}}>
              <div class="auto-top-pos" ref="autoTopPos" style={ this.rightPanelTop }>
                { this.$slots.rightFixedPanel }
                <div onClick={ (e)=>this.rightFixPaneToggle(e) } class="pack-up el-icon-db-arrow"></div>
              </div>
            </div>
          ) : ''
        }
      </div>
    );
  }
};
