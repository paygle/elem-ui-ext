import CaseTrackLane from './case-track-lane';
import emitter from 'element-ui/src/mixins/emitter';
import { setStyle } from 'element-ui/src/utils/dom';

export default {

  name: 'CaseTrackGroup',

  componentName: 'CaseTrackGroup',

  mixins: [emitter],

  components: {
    CaseTrackLane
  },

  props: {
    relativeDom: null, 
    lanePopDisabled: Boolean,
    itemPopDisabled: Boolean,
    getComponetName: Function,  // 获取弹出窗口的模板名称
    getComponetData: Function,   // 获取模板初始化数据
    statusIcons: Object,    // 状态图标
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
      groupHeight: null,
      groupWidth: {},
      gpcanvas: null,
      canvasWidth: 0,
      canvasHeight: 0
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
        this.draw();
      }
    }

  },

  methods:{
    // 初始化组件结构
    initGroupRect(){
      this.$nextTick(function(){
        this.groupHeight = { height: this.$el.getBoundingClientRect().height + 'px' };
        this.broadcast('CaseTrackLane', 'update-lane-height', this.groupHeight);
      });
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

      // arrowX = fromX - topX, 
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

   // 画线
   drawLine(ctxdom, startX, startY, endX, endY, color, width) {

      let ctx = ctxdom ? ctxdom.getContext('2d') : null;
        startX = typeof(startX) != 'undefined' ? startX : 0;
        startY = typeof(startY) != 'undefined' ? startY : 0;
        endX = typeof(endX) != 'undefined' ? endX : 0;
        endY = typeof(endY) != 'undefined' ? endY : 0;
        color = typeof(color) != 'undefined' ? color : this.lineColor;
        width = typeof(width) != 'undefined' ? width : 2;

      if(!ctx) return;
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
   },

   drawUpdate(){
    
      let canvas = this.$refs.cvsgpmap,
        lane, clrt, leftpos, topXStart, topLine_Y = 18,
        laneNum = this.lanes && this.lanes.length ? this.lanes.length : 0,
        gpCrt = this.$refs.cvsgpmap ? this.$refs.cvsgpmap.getBoundingClientRect() : {height: 0},
        groupBtY = gpCrt.height - 18,
        groupBtShortY = gpCrt.height - 40;

      if(!canvas) return;

      for(let i=0; i<laneNum; i++){
        if(this.$refs['lane'+ i]){
          lane = this.$refs['lane'+i];
          clrt = lane.$el.getBoundingClientRect();
          leftpos = lane.$el.offsetLeft + clrt.width/2;

          if(laneNum > 1){
            if(i==0){
              topXStart = leftpos;
            } 
 
            this.drawLine(canvas, topXStart, topLine_Y, leftpos, topLine_Y);
            this.drawArrow(canvas, leftpos, topLine_Y - 1, leftpos, 37);
            if(this.nextNode){
              this.drawLine(canvas, topXStart, groupBtY, leftpos, groupBtY);
              this.drawLine(canvas, leftpos, groupBtY + 1, leftpos, groupBtShortY);
            }
          }
        }
      }
       
      if(this.isLastNode){
        this.dispatch('CaseTrack', 'load-node-data', true);
      }
    },

    // canvas draw
    draw(flag) {
      
      function getRelative(self, dom) {
        if(typeof dom === 'undefined' || dom === 'body'){
          return self.$el;
        }else if(typeof dom === 'object'){
          return dom;
        }
      }

      this.$nextTick(function(){

        let m=20, b= 1, p=30, mW = 0,
          elBody = getRelative(this, this.relativeDom),
          bodyWH = elBody.getBoundingClientRect(),
          bodyWidth = bodyWH.width;
          this.canvasWidth = bodyWH.width;
          this.canvasHeight = bodyWH.height + 40;

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
        setTimeout(()=>{ this.drawUpdate(); }, 300); 
      });
    }
  },

  beforeDestroy(){
    window.onresize = null;
  },

  mounted(){
    let that = this;
    this.$on('update-gpdraw', function(f) { this.draw(f); });
    window.onresize = function(e){ that.draw(); };
    this.initGroupRect();
  },

  render(h){
    return (
      <div className="cover-layer">
        <div ref="GroupMap" class="case-track-group" style={ this.groupWidth }>
          <canvas 
            ref="cvsgpmap" 
            class="canvas-gp-map" 
            width={ this.canvasWidth } 
            height={ this.canvasHeight }>
          </canvas>
          {
            this._l(this.lanes, (lane, $index)=>[
              <case-track-lane ref={ 'lane'+ $index }
                has-more-icon={ this.hasMoreIcon }
                lane-pop-disabled={ this.lanePopDisabled }
                item-pop-disabled={ this.itemPopDisabled }
                get-componet-name={ this.getComponetName }
                get-componet-data={ this.getComponetData }
                lane-components={ this.components }
                status-icons={ this.statusIcons }
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
