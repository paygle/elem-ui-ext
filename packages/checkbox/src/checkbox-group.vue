<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'ElCheckboxGroup',

    componentName: 'ElCheckboxGroup',

    mixins: [Emitter],

    props: {
      validItemName: {     // 使用 valid-item组件时的组件名称
        type: String,
        default: 'ValidItem'
      },
      value: {},
      min: Number,
      max: Number,
      size: String,
      fill: String,
      textColor: String
    },

    watch: {
      value(value) {
        this.$emit('change', value);
        this.dispatch('ElFormItem', 'el.form.change', [value]);
        this.dispatch('ElForm', 'compare-change', this);
        this.dispatch(this.validItemName, 'valid.item.change', [value]);
        this.dispatch(this.validItemName, 'compare-change', this);
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.dispatch('ElForm', 'compare-change', this);
        this.dispatch(this.validItemName, 'compare-change', this);
      });
    }
  };
</script>

<template>
  <div class="el-checkbox-group">
    <slot></slot>
  </div>
</template>
