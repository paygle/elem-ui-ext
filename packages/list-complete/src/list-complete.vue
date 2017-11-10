<template>
  <div class="el-autocomplete list-complete" v-clickoutside="handleClose">
    <el-input
      ref="input"
      :value="value"
      :disabled="disabled"
      :placeholder="placeholder"
      :name="name"
      :size="size"
      :icon="icon"
      :on-icon-click="onIconClick"
      :get-fill-styl="getFillStyl"
      @change="handleChange"
      @focus="handleFocus">
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
  import Clickoutside from 'element-ui/src/utils/clickoutside';

  export default {
    name: 'ListComplete',

    mixins: [Emitter],

    componentName: 'ListComplete',

    directives: { Clickoutside },

    components: {
      ElInput,
      ListCompleteSuggestions
    },

    props: {
      getFillStyl: Function,     // 获取自定义组件配色
      validateEvent: {
        type: Boolean,
        default: true
      },
      validItemName: {     // 使用 valid-item组件时的组件名称
        type: String,
        default: 'ValidItem'
      },
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
      handleClose() {
        this.isFocus = false;  
      },
      handleChange(value) {
        if(this.value !== value){
          this.$emit('input', value);
          if (!this.triggerOnFocus && !value) {
            this.suggestions = [];
            return;
          }
          this.getData(value);
          this.$nextTick(()=>{
            this.dispatch('ElForm', 'compare-change', this);
            this.dispatch(this.validItemName, 'compare-change', this);
          });
        }
      },
      handleFocus() {
        this.isFocus = true;
        if (this.triggerOnFocus && !this.$refs.suggestions.showPopper) {
          this.getData(this.value);
        }
      },

      select(item) {
        let value = this.propName ? item[this.propName] : item.value;
        this.$emit('input', value);
        this.$emit('select', item);
        this.$nextTick(_ => {
          this.suggestions = [];
          if (this.validateEvent) {
            // 验证 valid-item 组件
            this.dispatch('ElFormItem', 'el.form.blur', value);
            this.dispatch('ElForm', 'compare-change', this);
            this.dispatch(this.validItemName, 'valid.item.blur', value);
          }
        });
      }
    },
    mounted() {
      this.$on('item-click', item => {
        this.select(item);
      });
      this.$nextTick(() =>{ 
        this.dispatch('ElForm', 'compare-change', this); 
        this.dispatch(this.validItemName, 'compare-change', this);
      });
    },
    beforeDestroy() {
       this.$refs.suggestions.$destroy();
    }
  };
</script>
