<template>
  <div class="rich-radio-group">
    <slot></slot>
  </div>
</template>
<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'RichRadioGroup',

    componentName: 'RichRadioGroup',

    mixins: [Emitter],

    props: {
      validItemName: {     // 使用 valid-item组件时的组件名称
        type: String,
        default: 'ValidItem'
      },
      value: [String, Number],
      size: String,
      fill: String,
      textColor: String,
      disabled: Boolean
    },
    watch: {
      value(value) {
        this.$emit('change', value);
        this.dispatch('ElFormItem', 'el.form.change', [this.value]);
        this.dispatch('ElForm', 'compare-change', this);
        this.dispatch(this.validItemName, 'valid.item.change', [this.value]);
        this.dispatch(this.validItemName, 'compare-change', this);
      }
    },
    mounted() {
      this.$nextTick(() =>{ 
        this.dispatch('ElForm', 'compare-change', this);
        this.dispatch(this.validItemName, 'compare-change', this);
      });
    }
  };
</script>

