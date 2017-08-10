<template>
  <label class="rich-radio">
    <span class="rich-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label,
        'is-focus': focus
      }"
    >
    <span v-if="layout==='tick'" class="rich-radio__inner">
      <i :class="'el-icon-' + icon" v-if="icon"></i
      ><span 
      class="rich-radio__label"
      ><slot></slot
      ><template v-if="!$slots.default">{{label}}</template>
      </span>
    </span>
    <input
      class="rich-radio__original"
      :value="label"
      type="radio"
      v-model="model"
      @focus="focus = true"
      @blur="focus = false"
      :name="name"
      :disabled="isDisabled">
    </span>
  </label>
</template>
<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'RichRadio',

    mixins: [Emitter],

    componentName: 'RichRadio',

    props: {
      value: {},
      label: {},
      icon: String,
      layout:{          // 自定义布局类型
        type: String,
        default: function(){
          return 'tick';
        }
      },
      canceled: {      // 是否允许取消
        type: Boolean,
        default(){
          return false;
        }
      },
      disabled: Boolean,
      name: String
    },

    data() {
      return {
        focus: false
      };
    },

    computed: {
      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'RichRadioGroup') {
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
          let nwVal;
          if(this.canceled && this.model=== val){  // 可以取消的 Radio
            nwVal = '';
          }else{
            nwVal = val;
          }
          if (this.isGroup) {
            this.dispatch('RichRadioGroup', 'input', [nwVal]);
          } else {
            this.$emit('input', nwVal);
          }
        }
      },

      isDisabled() {
        return this.isGroup
          ? this._radioGroup.disabled || this.disabled
          : this.disabled;
      }
    }
  };
</script>
