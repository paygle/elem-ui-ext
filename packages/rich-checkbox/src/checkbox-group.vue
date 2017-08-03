<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'RichCheckboxGroup',

    componentName: 'RichCheckboxGroup',

    mixins: [Emitter],

    props: {
      value: {},
      min: Number,
      max: Number
    },

    watch: {
      value(value) {
        this.$emit('change', value);
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      }
    }
  };
</script>

<template>
  <div class="el-checkbox-group">
    <slot></slot>
  </div>
</template>
