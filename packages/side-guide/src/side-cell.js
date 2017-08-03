import Emitter from 'element-ui/src/mixins/emitter';

export default {
  name: 'SideCell',
  componentName: 'SideCell',
  mixins:[Emitter],
  props:{
    icon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    anchor: String,
    action: Function,
    store: Object
  },
  data(){
    return {
     targetOut: null,
     docLayout: null,
     scrollTop: 0
    };
  },
  methods:{

    setScrollTop(val){
      document.documentElement.scrollTop = val;
      document.body.scrollTop = val;
    },
    scrollTarget(targetId){
      let target = document.querySelector('#'+targetId);
      if(!target) return;
      this.setScrollTop(target.offsetTop);

      // let isWebkit = typeof webkitRequestAnimationFrame !== 'undefined';
      // this.docLayout = document.querySelector('body').getBoundingClientRect();
      // this.targetOut = target.getBoundingClientRect();
      // let len=0, end = 0, scrollTop=0, reqHander, step = 1;
      // let start = target.getBoundingClientRect().top;
      // let that = this, direction = end > start ?  -1  : 1;

      // const browserGo =  function(step, start) {
          
      //     if(isWebkit){
      //       scrollTop += step;
      //       that.setScrollTop(scrollTop);
      //       reqHander = requestAnimationFrame(runScroll);
      //     }else{
      //       that.setScrollTop(scrollTop + start);
      //     }
      // }

      // const runScroll = function () {

      //   start = target.getBoundingClientRect().top;
      //   scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      //   isNotBottom = that.docLayout.height > (scrollTop + innerHeight + 30);

      //   if (direction>0 && start > end && isNotBottom) {
      //     step = trail(start, end, direction);
      //     if(start - step < 0) step = start - end;
      //     browserGo(step, start);

      //   }else if(direction<0 && start < end && scrollTop > 0){
      //     step = trail(start, end, direction);
      //     if(start + step > 0) step = end - start;
      //     browserGo(step, start);

      //   }else{
      //     if(direction>0 && !isNotBottom){
      //       that. setScrollTop(that.docLayout.height);
      //     }else if(direction<0 && scrollTop <1){
      //       that. setScrollTop(scrollTop);
      //     } 
      //     cancelAnimationFrame(reqHander);
      //   }
      // }
      // reqHander = requestAnimationFrame(runScroll);
    },

    doAction (e) {

      if(this.anchor){
        this.scrollTarget(this.anchor);
      }

      if(typeof this.action === 'function') {
        this.action.call(null, this.store);
        this.dispatch('SideGuide', 'updateStyle');
      }
    }
  },

  render(h){
    let own = this;
    return <li class={ own.icon } on-click= { (e)=>this.doAction(e)}> {own.text} </li>;
  }
};
