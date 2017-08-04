<template>
    <div :class="{'back-top':true , 'back-top-show': backTop}"
         :style="styles"
         @click="back">
        <slot>
            <div class="back-top-inner">
                <i class="el-icon-arrow-up"></i>
            </div>
        </slot>
    </div>
</template>
<script>
import { on, off } from 'element-ui/src/utils/dom';
const scrollTop = function (el, from = 0, to, duration = 500) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil(difference / duration * 50);

  function scroll(start, end, step) {
    if (start === end) return;

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  }
  if (typeof webkitRequestAnimationFrame !== 'undefined') {
    scroll(from, to, step);
  } else {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

};

export default {
  name: 'BackTop',
  props: {
    height: {
      type: Number,
      default: 100
    },
    bottom: {
      type: Number,
      default: 30
    },
    right: {
      type: Number,
      default: 30
    },
    duration: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      backTop: false
    };
  },
  mounted() {
    on(window, 'scroll', this.handleScroll);
    on(window, 'resize', this.handleScroll);
  },
  beforeDestroy() {
    off(window, 'scroll', this.handleScroll);
    off(window, 'resize', this.handleScroll);
  },
  computed: {
    styles() {
      return {
        bottom: this.bottom + 'px',
        right: this.right + 'px'
      };
    }
  },
  methods: {
    handleScroll() {
      this.backTop = window.pageYOffset >= this.height;
    },
    back() {
      scrollTop(window, document.body.scrollTop, 0, this.duration);
      this.$emit('click');
    }
  }
};
</script>