import CaseTrackLane from './case-track-lane';
import emitter from 'element-ui/src/mixins/emitter';
import { setStyle } from 'element-ui/src/utils/dom';
import { TypeOf } from 'element-ui/src/utils/funcs';

const Snap = window.Snap || null;
const mina = window.mina || null;

export default {

  name: 'CaseTrackGroup',

  componentName: 'CaseTrackGroup',

  mixins: [emitter],

  components: {
    CaseTrackLane
  },

  props: {
    relativeDom: String, 
    lanePopDisabled: Boolean,
    itemPopDisabled: Boolean,
    getComponetName: Function,  // 获取弹出窗口的模板名称
    getComponetData: Function,   // 获取模板初始化数据
    components: Object,
    placement: String,
    itemWidth: Number,
    hasMoreIcon: String,
    lineColor: {
      type: String,
      default(){
        return '#ccc';
      }
    },
    nextNode: [Array, Object], 
    isLastNode: Boolean,     // 是否为最后一个元素
    index: Number,
    nodes: null,
    store: null
  },

  data(){
    return{
      groupRect: {},
      groupHeight: null,
      topShorts: null,
      bottomShorts: null,
      groupWidth: {}
    };
  },

  computed:{
    lanes(){
      if(this.nodes && this.nodes.lanes){
        return this.nodes.lanes;
      }
      return [];
    },
    mainWidth(){
      let mws = this.$el.getBoundingClientRect();
      return mws.width;
    }
  },

  watch:{

    groupHeight(n, o){
      if(n && n !== o) {
        this.drawFrLine();
      }
    }

  },

  methods:{
    // 初始化组件结构
    initGroupRect(){
      this.$nextTick(function(){
        this.groupRect = this.$el.getBoundingClientRect();
        this.groupHeight = { height: this.groupRect.height + 'px' };
        this.broadcast('CaseTrackLane', 'update-lane-height', this.groupHeight);
      });
    },
    // 清空画布
    clearDraw(){
      if(TypeOf(this.laneNodes) === 'Array'){
        let laneNodes = this.laneNodes;
        for(let i=0; i<laneNodes.length; i++){
          if(laneNodes[i].svg) laneNodes[i].svg.remove();
        }
        this.laneNodes = [];
      }
      if(TypeOf(this.bottomShorts) === 'Array'){
        let bottomShorts = this.bottomShorts;
        for(let j=0; j<bottomShorts.length; j++){
          if(bottomShorts[j].svg) bottomShorts[j].svg.remove();
        }
        this.bottomShorts = [];
      }
    },

    // 画线
    drawFrLine(){
      
      this.clearDraw();
      let m=20, b= 1, p=30, mW = 0;
      let elBody = document.querySelector(this.relativeDom);
      let bodyWidth = elBody.getBoundingClientRect().width;
 
      if(this.itemWidth && !isNaN(this.itemWidth) && this.lanes.length){
        // margin: 20, border: 1, padding: 30
        mW = ((this.itemWidth + (m + b + p)*2) * this.lanes.length);
        this.groupWidth = { width:  mW + 'px' };
        if(mW < this.mainWidth){
          this.groupWidth = {};
        }
      }

      if(bodyWidth < mW){
         setStyle(elBody,  'width',  mW + 'px');
      }
     
      const updateLine = function(){
        
        let topShorts = [],  bottomShorts = [], lane, clrt, leftpos, topXStart;
        let topDrLine, bottomDrLine, topLine_Y = 18 ;
        let lineSet = { stroke: this.lineColor, strokeWidth: 5	};
        let laneNum = this.lanes && this.lanes.length ? this.lanes.length : 0 ;
        let gpCrt = this.$refs.SvgGpMap ? this.$refs.SvgGpMap.getBoundingClientRect() : {height: 0};
        let groupBtY = gpCrt.height - 18;
        let groupBtShortY = gpCrt.height - 16;
        let s = Snap(this.$refs.SvgGpMap);

        for(let i=0; i<laneNum; i++){
          if(this.$refs['lane'+ i]){
            lane = this.$refs['lane'+i];
            clrt = lane.$el.getBoundingClientRect();
            leftpos = lane.$el.offsetLeft + clrt.width/2;

            if(laneNum > 1){
              if(i==0){
                topXStart = leftpos;
                topDrLine = s.line(topXStart, topLine_Y, topXStart, topLine_Y).attr(lineSet);

                if(this.nextNode){
                  bottomDrLine = s.line(topXStart, groupBtY, topXStart, groupBtY).attr(lineSet);
                }
              }

              topDrLine.animate({x1:topXStart, y1: topLine_Y, x2: leftpos, y2: topLine_Y}, 500, mina.linear);
              topShorts.push({lane: lane, pos: clrt, svg: s.line(leftpos, 15, leftpos, 40).attr(lineSet)});

              if(this.nextNode){
                bottomShorts.push({lane: lane, pos: clrt, svg: s.line(leftpos, (groupBtShortY - 25), leftpos, groupBtShortY).attr(lineSet)});
                bottomDrLine.animate({x1:topXStart, y1: groupBtY, x2: leftpos, y2: groupBtY}, 500, mina.linear);
              }
            }
            
            if(laneNum == 1 && this.nextNode){
              bottomShorts.push({lane: lane, pos: clrt, svg: s.line(leftpos, (groupBtShortY - 25), leftpos, groupBtShortY).attr(lineSet)});
            }
          }
        }
        
        this.laneNodes = topShorts;
        this.bottomShorts = bottomShorts;
        
        if(this.isLastNode){
          this.dispatch('CaseTrack', 'load-node-data', true);
        }
      };

      this.$nextTick(updateLine);
    }
  },

  mounted(){
    let that = this;
    this.initGroupRect();
    window.onresize = function(e){
      that.drawFrLine();
    };
  },

  render(h){
    return (
      <div className="cover-layer">
        <div ref="GroupMap" class="case-track-group" style={ this.groupWidth }>
          <svg ref="SvgGpMap" width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>
          {
            this._l(this.lanes, (lane, $index)=>[
              <case-track-lane ref={ 'lane'+ $index }
                has-more-icon={ this.hasMoreIcon }
                lane-pop-disabled={ this.lanePopDisabled }
                item-pop-disabled={ this.itemPopDisabled }
                get-componet-name={ this.getComponetName }
                get-componet-data={ this.getComponetData }
                lane-components={ this.components }
                placement={ this.placement }
                itemWidth={ this.itemWidth }
                line-color={ this.lineColor }
                store={ this.store } 
                index={ $index } 
                lane={ lane }>
              </case-track-lane>
            ])
          }
        </div>
      </div>
    );
  }
};
