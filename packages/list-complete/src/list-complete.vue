<template>
  <div class="el-autocomplete">
    <el-input
      ref="input"
      :value="value"
      :disabled="disabled"
      :placeholder="placeholder"
      :name="name"
      :size="size"
      :icon="icon"
      :on-icon-click="onIconClick"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur">
      <template slot="prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </template>
      <template slot="append" v-if="$slots.append">
        <slot name="append"></slot>
      </template>
    </el-input>
    <list-complete-suggestions
      :class="[popperClass ? popperClass : '']"
      :width="popWidth"
      ref="suggestions">
      <slot :data="suggestions"></slot>
    </list-complete-suggestions>
  </div>
</template>
<script>
  import ElInput from 'element-ui/packages/input';
  import ListCompleteSuggestions from './list-complete-suggestions.vue';
  import Emitter from 'element-ui/src/mixins/emitter';
  import debounce from 'throttle-debounce/debounce';

  export default {
    name: 'ListComplete',

    mixins: [Emitter],

    componentName: 'ListComplete',

    components: {
      ElInput,
      ListCompleteSuggestions
    },

    props: {
      propName: String,     // 默认筛选属性名
      popWidth: String,     // 弹出框宽度
      popperClass: String,
      placeholder: String,
      disabled: Boolean,
      name: String,
      size: String,
      value: String,
      autofocus: Boolean,
      fetchSuggestions: Function,
      triggerOnFocus: {
        type: Boolean,
        default: true
      },
      customItem: String,
      icon: String,
      onIconClick: Function
    },
    data() {
      return {
        isFocus: false,
        suggestions: [],
        loading: false
      };
    },
    computed: {
      suggestionVisible() {
        const suggestions = this.suggestions;
        let isValidData = Array.isArray(suggestions) && suggestions.length > 0;
        return (isValidData || this.loading) && this.isFocus;
      }
    },
    watch: {
      suggestionVisible(val) {
        this.broadcast('ListCompleteSuggestions', 'visible', 
        [val, this.$refs.input.$refs.input.offsetWidth]);
      }
    },
    methods: {
      getData(queryString) { 
        this.loading = true;
        this.fetchSuggestions(queryString, (suggestions) => {
          this.loading = false;
          if (Array.isArray(suggestions)) {
            this.suggestions = suggestions;
          } else {
            console && console.error('list complete suggestions must be an array');
          }
        });
      },
      handleChange(value) {
        if(this.value !== value){
          this.$emit('input', value);
          if (!this.triggerOnFocus && !value) {
            this.suggestions = [];
            return;
          }
          this.getData(value);
        }
      },
      handleFocus() {
        this.isFocus = true;
        if (this.triggerOnFocus && !this.$refs.suggestions.showPopper) {
          this.getData(this.value);
        }
      },
      handleBlur() {
        // 因为 blur 事件处理优先于 select 事件执行
        debounce(300, ()=>{
          this.isFocus = false;
        });
      },

      select(item) {
        let value = this.propName ? item[this.propName] : item.value;
        this.$emit('input', value);
        this.$emit('select', item);
        this.$nextTick(_ => {
          this.suggestions = [];
        });
      }
    },
    mounted() {
      this.$on('item-click', item => {
        this.select(item);
      });
    },
    beforeDestroy() {
       this.$refs.suggestions.$destroy();
    }
  };
</script>
