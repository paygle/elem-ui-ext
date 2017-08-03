<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <div
      v-show="showPopper"
      class="el-autocomplete-suggestion list-suggestion"
      :class="{ 'is-loading': parent.loading }"
      :style="{ width: dropdownWidth }">
      <el-scrollbar
        wrap-class="el-autocomplete-suggestion__wrap"
        view-class="el-autocomplete-suggestion__list">
        <div v-if="parent.loading" style="text-align: center;"><i class="el-icon-loading"></i></div>
        <div class="suggestion-content" v-else>
          <slot></slot>
        </div>
      </el-scrollbar>
    </div>
  </transition>
</template>
<script>
  import ElScrollbar from 'element-ui/packages/scrollbar';
  import Popper from 'element-ui/src/utils/vue-popper';
  import Emitter from 'element-ui/src/mixins/emitter';
  export default {
    mixins: [Popper, Emitter],

    componentName: 'ListCompleteSuggestions',

    components:{
      ElScrollbar
    },

    data() {
      return {
        parent: this.$parent,
        dropdownWidth: '125px'
      };
    },

    props: {
      width: String,
      options: {
        default() {
          return {
            forceAbsolute: true,
            gpuAcceleration: false
          };
        }
      }
    },

    updated() {
      this.$nextTick(_ => { this.updatePopper(); });
    },

    mounted() {
      this.popperElm = this.$el;
      this.referenceElm = this.$parent.$refs.input.$refs.input;
    },

    created() {
      this.$on('visible', (val, inputWidth) => {
        this.dropdownWidth = this.width || this.dropdownWidth;
        this.showPopper = val;
      });
    }
  };
</script>
