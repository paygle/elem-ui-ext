<template>
  <label class="el-radio">
    <span class="el-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label,
        'is-focus': focus
      }"
    >
      <span class="el-radio__inner" :class="ie9styl"></span>
      <input
        class="el-radio__original"
        :value="label"
        type="radio"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        :name="name"
        :tabindex="tabindex"
        :disabled="isDisabled">
    </span>
    <span class="el-radio__label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'ElRadio',

    mixins: [Emitter],

    componentName: 'ElRadio',

    props: {
      validItemName: {     // 使用 valid-item组件时的组件名称
        type: String,
        default: 'ValidItem'
      },
      tabindex: null,
      value: {},
      label: {},
      disabled: Boolean,
      name: String
    },

    data() {
      return {
        focus: false
      };
    },

    computed: {

      ie9styl() { // 修复IE9样式
        if(navigator.appName == "Microsoft Internet Explorer" &&
          navigator.appVersion .split(";")[1].replace(/\s/g,'')=="MSIE9.0") {
          return 'fix-ie9';
        }
        return '';
      },

      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'ElRadioGroup') {
            parent = parent.$parent;
          } else {
            this._radioGroup = parent;
            return true;
          }
        }
        return false;
      },

      model: {
        get() {
          return this.isGroup ? this._radioGroup.value : this.value;
        },

        set(val) {
          if (this.isGroup) {
            this.dispatch('ElRadioGroup', 'input', [val]);
          } else {
            this.$emit('input', val);
            this.dispatch('ElForm', 'compare-change', this);
            this.dispatch(this.validItemName, 'compare-change', this);
          }
        }
      },

      isDisabled() {
        return this.isGroup
          ? this._radioGroup.disabled || this.disabled
          : this.disabled;
      }
    },
    mounted() {
      this.$nextTick(() =>{
        if (!this.isGroup) {
          this.dispatch('ElForm', 'compare-change', this);
          this.dispatch(this.validItemName, 'compare-change', this);
        }
      });
    }
  };
</script>
