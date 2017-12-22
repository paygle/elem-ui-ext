<template>
  <el-button ref="richbtn"
    @click="handleClick"
    :autofocus="autofocus"
    :type="type"
    :tabindex="tabindex"
    :native-type="nativeType"
    :size="size"
    :icon="icon"
    :plain="plain"
    :disabled="disabled"
    :loading="loading">
    <slot></slot>
  </el-button>
</template>
<script>
import ElButton from 'element-ui/packages/button';
import { setStyle } from 'element-ui/src/utils/dom';

export default {
  name: 'RichButton',
  components: {
    ElButton
  },
  props: {
    shape: String,           // 按钮形状
    type: {
      type: String,
      default: 'default'
    },
    tabindex: null,
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean
  },

  methods: {
    handleClick(evt) {
      this.$emit('click', evt);
    },
    setRadius() {
      if (this.$refs && this.$refs.richbtn) {
        let richbtn = this.$refs.richbtn;
        if (this.shape === 'capsule' && richbtn) { // 胶囊形状按钮
          setStyle(richbtn.$el, 'borderRadius', '30px');
        }
      }
    },
    updateStyl() {
      this.$nextTick(function () {
        // 胶囊形状按钮
        if (this.shape === 'capsule') { this.setRadius(); }
      });
    }
  },
  mounted() {
    this.updateStyl();
  }
};
</script>
