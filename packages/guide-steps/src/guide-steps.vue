<template>
  <div
    class="el-steps"
    :class="['is-' + direction, center ? 'is-center' : '', 'is-'+lineStyl]">
    <div :class="['is-' + direction, 'first-line']">
      <span class="sect-1"></span>
      <span class="sect-2"></span>
      <span class="sect-3"></span>
      <span class="sect-4"></span>
    </div>
    <slot v-if="islayout"></slot>
    <div :class="['is-' + direction, 'last-line']">
      <span class="sect-4"></span>
      <span class="sect-3"></span>
      <span class="sect-2"></span>
      <span class="sect-1"></span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GuideSteps',
  componentName: 'GuideSteps',
  props: {
    space: [Number, String],
    active: Number,
    currentStep: Function,  // 当前步骤回调
    lineStyl: {             // 线条类型   可选 default | dotline 渐变
      type: String,
      default: 'default'
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    alignCenter: Boolean,
    center: {
      type: Boolean,
      default: true
    },
    finishStatus: {
      type: String,
      default: 'finish'
    },
    processStatus: {
      type: String,
      default: 'process'
    }
  },

  data() {
    return {
      islayout: false,
      thandle: null,
      steps: [],
      stepOffset: 0
    };
  },

  watch: {
    active(newVal, oldVal) {
      this.$emit('change', newVal, oldVal);
    },
 
    steps(steps) {
      const lineStyl = this.lineStyl;
      steps.forEach((child, index) => {
        child.index = index;
        child.lineStyl = lineStyl;
      });
    }
  },

  methods: {
    refreshWidth(){
      if(this.$el && this.$el.getBoundingClientRect().width>0){
        this.islayout = true;
        clearTimeout(this.thandle);
      }else{
        this.setTimeout();
      }
    },
    setTimeout(){
      let that = this;
      that.thandle = setTimeout(( )=> {
        if(!that.islayout){
          that.refreshWidth();
        }else{
          clearTimeout(that.thandle);
        }
      }, 500);
    }
  },

  mounted(){
    this.setTimeout();
  }
};
</script>
