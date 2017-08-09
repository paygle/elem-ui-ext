<template>
  <div
    class="el-step"
    :style="[style, isLast ? '' : { marginRight: - ($parent.stepOffset + 10) + 'px' }]"
    :class="['is-' + $parent.direction, isLast ? 'is-last': '']">
    <div
      v-if="lineStyl==='default'"
      class="el-step__head"
      :class="['is-' + currentStatus, { 'is-text': !icon }]">
      <div
        class="el-step__line"
        :style="isLast ? '' : { marginRight: $parent.stepOffset + 'px' }"
        :class="['is-' + $parent.direction, { 'is-icon': icon }]">
        <i class="el-step__line-inner" :style="lineStyle"></i>
      </div>
      <span class="el-step__icon" @click="nodeClick">
        <slot
          v-if="currentStatus !== 'success' && currentStatus !== 'error'"
          name="icon">
          <div v-if="isCurrentStep && currentStatus == 'finish'"> {{ index + 1 }} </div>
          <i v-else-if="icon" :class="['el-icon-' + icon]"></i>
          <div v-else>{{ index + 1 }}</div>
        </slot>
        <div v-else-if="isCurrentStep"> {{ index + 1 }} </div>
        <i
          v-else
          :class="['el-icon-' + (currentStatus === 'success' ? 'check' : 'close')]">
        </i>
      </span>
    </div>
    <div
      v-if="lineStyl==='default'"
      class="el-step__main"
      :style="{ marginLeft: mainOffset }">
      <div
        class="el-step__title"
        ref="title"
        :class="['is-' + currentStatus]">
        <slot name="title">{{ title }}</slot>
      </div>
      <div
        class="el-step__description"
        :class="['is-' + currentStatus]">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
    <!-- dotline Style-->
    <div
      v-if="lineStyl==='dotline'"
      class="el-step__head"
      :class="['is-' + currentStatus, { 'is-text': !icon }, 'styl-'+lineStyl]">
      <div
        class="el-step__title"
        ref="title"
        @click="nodeClick"
        :style="titleLeft"
        :class="['is-' + currentStatus]">
        <slot name="title">{{ title }}</slot>
      </div>
      <div
        class="el-step__line"
        :style="{ marginRight: $parent.stepOffset + 'px' }"
        :class="['is-' + $parent.direction, { 'is-icon': icon }]">
        <i class="el-step__line-inner" :style="lineStyle"></i>
      </div>
    </div>
    <div
      v-if="lineStyl==='dotline'"
      class="el-step__main"
      :class="['styl-'+lineStyl]"
      :style="{ marginLeft: mainOffset }">
      <div
        class="el-step__description"
        :class="['is-' + currentStatus]">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>
<script>
import Emitter from 'element-ui/src/mixins/emitter';
import { ToPlainObject } from 'element-ui/src/utils/funcs';  //引入类型判断

export default {
  name: 'GuideStep',
  componentName: 'GuideStep',
  mixins:[Emitter],
  props: {
    title: String,
    icon: String,
    description: String,
    status: String
  },

  data() {
    return {
      index: -1,
      lineStyle: {},
      mainOffset: 0,
      internalStatus: '',
      lineStyl: 'default',
      titleLeft: {},
      isCurrentStep: false  // 当前步骤回调
    };
  },

  beforeCreate() {
    this.$parent.steps.push(this);
  },

  beforeDestroy() {
    const steps = this.$parent.steps;
    const index = steps.indexOf(this);
    if (index >= 0) {
      steps.splice(index, 1);
    }
  },

  computed: {
    currentStatus() {
      return this.status || this.internalStatus;
    },
    prevStatus() {
      const prevStep = this.$parent.steps[this.index - 1];
      return prevStep ? prevStep.currentStatus : 'wait';
    },
    isLast: function() {
      const parent = this.$parent;
      return parent.steps[parent.steps.length - 1] === this;
    },
    style: function() {
      const parent = this.$parent;
      const len = parent.steps.length;
      // const isCenter = parent.center;

      // if (isCenter && this.isLast) {
      //   return {};
      // }
      function getSpace(islast, len) {
        let perc = 100 / len;
        if(islast){
          return (perc - (perc * 0.1 * (len - 1))) + '%';
        }else{
          return (perc + perc * 0.1) + '%';
        }
      }

      const space = (typeof parent.space === 'number' ? parent.space + 'px'
        : parent.space ? parent.space : getSpace(this.isLast, len));
      if (parent.direction === 'horizontal') {
        return { width: space };
      } else if (!this.isLast) {
        return { height: space };
      }
      return {};
    },
    parentWidth(){
      if(this.$parent.$el){
        return this.$parent.$el.getBoundingClientRect().width - 236;
      }else{
        return document.querySelector('body').getBoundingClientRect().width - 236;
      }
    }
  },

  watch:{
    lineStyl:{
      immediate: true,
      handler(val){
        this.updateLeft(val);
      }
    }
  },

  methods: {
    resetCurretStep(){ // 重置 isCurrentStep
      this.isCurrentStep = false;
    },

    nodeClick(e){  // 节点点击事件 处理 currentStep
      if(this.titleLeft){
        this.titleLeft.backgroundColor= null;
        this.titleLeft.color= null;
      }
      
      this.$nextTick(function(){

          let active = this.$parent.active;
          let index = this.index;
          let nstyle = ToPlainObject(this.titleLeft);
          let styl = getComputedStyle(this.$refs.title);

          if(index <= active && typeof this.$parent.currentStep === 'function'){ // 允许被点击并改变样式的结点
            // 是否处理当前步骤回调
            this.isCurrentStep = true;
            
            this.$parent.steps.forEach((child, idx) => {
              if(idx !== index){ 
                  child.resetCurretStep();
                  child.titleLeft.backgroundColor= null;
                  child.titleLeft.color= null;
                }
            });
            // 添加 title 样式
            if(this.lineStyl === 'dotline'){
              nstyle.backgroundColor=styl.color;
              nstyle.color='#fff';
              this.titleLeft = nstyle;
            }
            this.$parent.currentStep.call(null, index);  // 当前步骤回调
          }
          this.dispatch('GuideSteps','node-click', index);
      });
    },

    updateStatus(val) {
      const prevChild = this.$parent.$children[this.index - 1];

      if (val > this.index) {
        this.internalStatus = this.$parent.finishStatus;
      } else if (val === this.index && this.prevStatus !== 'error') {
        this.internalStatus = this.$parent.processStatus;
      } else {
        this.internalStatus = 'wait';
      }

      if (prevChild) prevChild.calcProgress(this.internalStatus);
    },

    calcProgress(status) {
      let step = 100;
      const style = {};

      style.transitionDelay = 150 * this.index + 'ms';
      if (status === this.$parent.processStatus) {
        step = this.currentStatus !== 'error' ? 50 : 0;
      } else if (status === 'wait') {
        step = 0;
        style.transitionDelay = (-150 * this.index) + 'ms';
      }

      style.borderWidth = step ? '1px' : 0;
      this.$parent.direction === 'vertical'
        ? style.height = step + '%'
        : style.width = step + '%';

      this.lineStyle = style;
    },
 
    updateLeft(type){
      if(type === 'dotline' && this.$parent.direction === 'horizontal'){
        const r = this.$refs.title.getBoundingClientRect();
        this.titleLeft = {left: '-' + (r.width/2 -4) + 'px'};
      }
    },

    // 自定义初始化
    init(){
      const parent = this.$parent;
      const parentW = parent.$el ? parent.$el.getBoundingClientRect().width : 0;

      if(parentW <= 0) return;  // 如果没有展示出来则不初始化

      this.$nextTick(function(){
   
        if (parent.direction === 'horizontal') {
          if (parent.alignCenter) {
            this.mainOffset = -this.$refs.title.getBoundingClientRect().width / 2 + 16 + 'px';
          }
        }

        this.updateLeft(this.lineStyl);

        // 最后一个线条加效果
        if(this.isLast){
           this.calcProgress(this.$parentfinishStatus);
        }
      });
    }
  },

  mounted() {
    this.init();
    const unwatch = this.$watch('index', val => {
      this.$watch('$parent.active', this.updateStatus, { immediate: true });
      unwatch();
    });
  }
};
</script>
