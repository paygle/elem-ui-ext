<template>
<div class="freeze-location" :style="locStyl">
  <div class="freeze-content animated" :class="freezeClas" :style="freezeStyl">
    <slot></slot>
  </div>
</div>
</template>
<script>
import debounce from 'throttle-debounce/debounce';
import merge from 'element-ui/src/utils/merge';
import { TypeOf } from 'element-ui/src/utils/funcs';
import { on,off } from 'element-ui/src/utils/dom';

// const getBodyPosAttr = function(name) {
//   if(typeof document.documentElement[name] !== 'undefined' 
//                         && document.documentElement[name] > 0) {
//     return document.documentElement[name];     
//   }else if(typeof document.body[name] !== 'undefined' 
//                         && document.body[name] > 0){
//     return document.body[name];
//   }
//   return undefined
// };

export default {
  name: 'Freeze',
  componentName: 'Freeze',
  props: {
    pos: {             // 冻结区位置  top/bottom/left/right 四个方向默认 top
      type: String,
      default: 'top'
    },
    mode: {            // 冻结相对位置展开模式  max/parent 默认 max
      type: String,
      default: 'max'
    },
    width: String,
    height: String,
    styl: Object       // 自定义样式
  },

  data() {
    return {
      selfPos: {},
      locPos: {},
      locStyl: {},
      freezeStyl: {},
      freezeClas: [],
      timeHander: null
    };
  },

  methods: {
    // 设置定位
    setLocation() {
      let locPos = this.locPos = this.$el.getBoundingClientRect();
      if (locPos.width < 1 || locPos.height < 1) {
        this.locStyl = {};
      } else {
        this.locStyl = {
          width: this.locPos.width + 'px',
          height: this.locPos.height + 'px'
        };
      }
    },

    // 设置动态定位
    setFreeze(pos, isFixed) {
      let that = this, clas = [], freezeStyl = {};

      function setTopBottom(pos, animCls) {
        if (isFixed) {
          let wdh = window.outerWidth > document.body.getBoundingClientRect().width
            ? window.outerWidth : document.body.getBoundingClientRect().width;
          clas = [pos, animCls];
          that.mode === 'parent'
            ? freezeStyl = { width: that.locStyl.width, left: that.locPos.left + 'px' }
            : freezeStyl = { width: wdh + 'px', left: 0 };
          freezeStyl.width = that.width || freezeStyl.width;
          freezeStyl.height = that.height || 'auto';
          if (that.mode === 'parent') {
            freezeStyl.padding = '10px';
          } else {
            freezeStyl.padding = '10px 30px 10px 20px';
          }
          freezeStyl = merge(freezeStyl, that.styl || {});
        } else {
          clas = [];
        }
      }

      function setLeftRight(pos, animCls) {
        if (isFixed) {
          clas = [pos, animCls];
          freezeStyl = { height: window.outerHeight + 'px', maxWidth: '20%' };
          freezeStyl.width = that.width || 'auto';
          freezeStyl.height = that.height || freezeStyl.height;
          freezeStyl = merge(freezeStyl, that.styl || {});
        } else {
          clas = [];
        }
      }

      switch (pos) {
        case 'top':
          setTopBottom('top', 'fadeInDown');
          break;

        case 'bottom':
          setTopBottom('bottom', 'fadeInUp');
          break;

        case 'left':
          setLeftRight('left', 'fadeInLeft');
          break;

        case 'right':
          setLeftRight('right', 'fadeInRight');
          break;

        default:
          setTopBottom('right', 'fadeInRight');
      }
      this.freezeStyl = freezeStyl;
      this.freezeClas = clas;
    },

    // 动态计算
    updatePosition() {
      let that = this, pos = TypeOf(this.pos) === 'String' ? this.pos : 'top';
      let selfPos = this.selfPos = this.$el.getBoundingClientRect();

      if ((selfPos.top < 0 || selfPos.top > innerHeight)) {
        this.setFreeze(pos, true);
      } else if (pos === 'left' || pos === 'right') {
        that.setFreeze(pos, false);
      } else {
        this.freezeStyl = {
          left: this.locPos.left + 'px',
          width: this.locStyl.width,
          transition: 'all .5s ease-out .1s'
        };
        clearTimeout(this.timeHander);
        this.timeHander = setTimeout(function () {
          that.setFreeze(pos, false);
        }, 20);
      }
    },

    addListen() {
      this.$nextTick(function () {
       /* 先注释掉，多tab页时freeze组件是否有问题？  
       let clkItems = document.querySelectorAll('.el-tabs .el-tabs__item');
        for (let i = 0; i < clkItems.length; i++) {
          on(clkItems[i], 'click', (e) => this.setLocation());
        }  */
        this.setLocation();
      });
    }
  },

  mounted() {
    let that = this;
    this.addListen();
    this.debounceUpdatePosition = debounce(10, function () { that.updatePosition(); });
    on(window, 'scroll', this.debounceUpdatePosition);
  },
  //销毁时释放事件
  beforeDestroy(){
    off(window, 'scroll', this.debounceUpdatePosition);
  }
};
</script>