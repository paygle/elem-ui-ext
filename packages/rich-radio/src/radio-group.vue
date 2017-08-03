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
      }
    }
  };
</script>

