<template>
  <span
    class="el-cascader"
    :class="[
      {
        'is-opened': menuVisible,
        'is-disabled': disabled
      },
      size ? 'el-cascader--' + size : ''
    ]"
    @click="handleClick"
    @mouseenter="inputHover = true"
    @mouseleave="inputHover = false"
    ref="reference"
    v-clickoutside="handleClickoutside"
  >
    <el-input
      ref="input"
      :tabindex="tabindex"
      :readonly="readonly || !filterable"
      :placeholder="currentLabels.length ? undefined : placeholder"
      v-model="inputValue"
      @focus="focushandle"
      @change="debouncedInputChange"
      :validate-event="false"
      :size="size"
      :disabled="disabled"
    >
      <template slot="icon">
        <i
          key="1"
          v-if="clearable && inputHover && currentLabels.length"
          class="el-input__icon el-icon-circle-close el-cascader__clearIcon"
          @click="clearValue"
        ></i>
        <i
          key="2"
          v-else
          class="el-input__icon el-icon-caret-bottom"
          :class="{ 'is-reverse': menuVisible }"
        ></i>
      </template>
    </el-input>
    <span
      ref="textbox"
      class="el-cascader__label"
      @mouseover="tipMSEnter"
      @mouseout="tipMSOut"
      v-show="inputValue === ''">
      <template v-if="showAllLevels">
        <template v-for="(label, index) in currentLabels">
          {{ label }}
          <span v-if="index < currentLabels.length - 1" :key="index"> {{split}} </span>
        </template>
      </template>
      <template v-else>
        {{ currentLabels[currentLabels.length - 1] }}
      </template>
    </span>
  </span>
</template>

<script>
import Vue from 'vue';
import ElCascaderMenu from './menu';
import ElInput from 'element-ui/packages/input';
import Popper from 'element-ui/src/utils/vue-popper';
import Clickoutside from 'element-ui/src/utils/clickoutside';
import emitter from 'element-ui/src/mixins/emitter';
import Locale from 'element-ui/src/mixins/locale';
import { t } from 'element-ui/src/locale';
import debounce from 'throttle-debounce/debounce';
import { createDomElement } from 'element-ui/src/utils/funcs';

const popperMixin = {
  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },
    appendToBody: Popper.props.appendToBody,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeDestroy: Popper.beforeDestroy
};

export default {
  name: 'ElCascader',

  directives: { Clickoutside },

  mixins: [popperMixin, emitter, Locale],

  components: {
    ElInput
  },

  props: {
    tabindex: null,
    initLabel: String, // 初始化翻译内容
    options: {
      type: Array,
      default: ()=>[]
    },
    props: {
      type: Object,
      default() {
        return {
          children: 'children',
          label: 'label',
          value: 'value',
          disabled: 'disabled'
        };
      }
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    placeholder: {
      type: String,
      default() {
        return t('el.cascader.placeholder');
      }
    },
    readonly: Boolean,
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: false
    },
    changeOnSelect: Boolean,
    popperClass: String,
    expandTrigger: {
      type: String,
      default: 'click'
    },
    filterable: Boolean,
    size: String,
    showAllLevels: {
      type: Boolean,
      default: true
    },
    debounce: {
      type: Number,
      default: 300
    },
    beforeFilter: {
      type: Function,
      default: () => (() => {})
    },
    split: {                 //  分隔符号
      type: String,
      default: ' / '
    },
    tipDisabled: {             // 默认不禁用显示tooltip
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      currentValue: this.value || [],
      menu: null,
      debouncedInputChange() {},
      menuVisible: false,
      inputHover: false,
      inputValue: '',
      flatOptions: null,
      parentTipText: '',         // 父类组件提示内容
      tipContent: '',            // tooltip内容
      notifyStyl: {},
      notifyWidth: 0,
      isNoticeShow: false,
      tipTimeHander: null,
      noticeDom: null,
      innerTipShow: false   // 默认禁用 tooltip功能
    };
  },

  computed: {
    labelKey() {
      return this.props.label || 'label';
    },
    valueKey() {
      return this.props.value || 'value';
    },
    childrenKey() {
      return this.props.children || 'children';
    },
    currentLabels() {
      let options = this.options;
      let labels = [];
      this.currentValue.forEach(value => {
        const targetOption = options && options.filter(option => option[this.valueKey] === value)[0];
        if (targetOption) {
          labels.push(targetOption[this.labelKey]);
          options = targetOption[this.childrenKey];
        }
      });
      return labels;
    }
  },

  watch: {
    menuVisible(value) {
      value ? this.showMenu() : this.hideMenu();
    },
    value(value) {
      this.currentValue = value;
    },
    currentValue(value) {
      this.dispatch('ElFormItem', 'el.form.change', [value]);
    },
    options: {
      deep: true,
      handler(value) {
        if (!this.menu) {
          this.initMenu();
        }
        this.flatOptions = this.flattenOptions(this.options);
        this.menu.options = value;
        // 动态改变Label值
        this.$nextTick(_=>{
          if (this.currentLabels.length) this.inputValue = this.currentLabels.join(this.split);
        });
      }
    },
    currentLabels(val){   //自动设置是否显示hover提示
      this.setTipContent(val);
    },
    parentTipText(val) {  //　父类组件提示内容更新
      if(typeof val === 'string' && val !== ''){
        if(this.noticeDom) {
          this.noticeDom.innerHTML = val;
        }
        this.tipContent = val;
      }
    }
  },

  methods: {
    focushandle() {
      if (!this.readonly) this.menuVisible=true;
    },
    tipMSEnter(e) {
      let pos, gapw, style, color = "", that = this;
      let textbox = this.$refs.textbox;
      let boxWidth = this.getPlaceWidth(textbox);
      let isParentText = typeof that.parentTipText === 'string' &&  that.parentTipText !== '';
      that.notifyWidth = this.getTipContentWidth(textbox, this.tipContent);

      if(that.innerTipShow || isParentText){
        that.tipTimeHander = setTimeout(()=>{
          pos = textbox.getBoundingClientRect();
          gapw = that.notifyWidth > 0 ? (that.notifyWidth - boxWidth)/2 : 0;

          if(isParentText) color = 'red';
          style = `color:${color}; left:${pos.left - gapw}px; top: ${pos.top - 38}px; z-index: 99; position: fixed`;

          if(/[\w\W]{3,}/ig.test(that.tipContent)){
            that.noticeDom = createDomElement('div', {class:"itxt-notify-popw", style: style});
            that.noticeDom.innerHTML = that.tipContent;
            document.body.appendChild(that.noticeDom);
          }
        }, 300);
      }
    },
    tipMSOut(e){
      clearTimeout(this.tipTimeHander);
      let delDoms = document.querySelectorAll('.itxt-notify-popw');
      if(delDoms.length && this.noticeDom) {
        for(let i=0; i<delDoms.length; i++){
          document.body.removeChild(delDoms[i]);
        }
        this.noticeDom = null;
      }
    },
    setTipContent(value){
      this.$nextTick(function(){
        if(!this.tipDisabled){
          this.tipContent = Array.isArray(value) ? value.join('/') : String(value);
          this.innerTipShow = this.getTipStatus(this.$refs.textbox);
        }
      });
    },
    getPlaceWidth(el){  // 计算组件除padding的宽度
      let elStyl, paddingLeft, paddingRight;
      if(el) {
        elStyl = getComputedStyle(el);
        paddingLeft =  parseInt(elStyl.paddingLeft.replace('px',''), 10);
        paddingRight =  parseInt(elStyl.paddingRight.replace('px',''), 10);
        return el.getBoundingClientRect().width - paddingLeft - paddingRight;
      }else{
        return 0;
      }
    },
    getTipContentWidth(el, text){ // 计算文本宽度
      let elStyl, fontSize,  zhword, zhWidth;
      text = text || '';
      elStyl = getComputedStyle(el);
      fontSize = parseInt(elStyl.fontSize.replace('px',''), 10);
      zhword = String(text).replace(/[0-9A-Za-z\-\:]/ig, '');
      zhWidth = zhword.length * fontSize;
      return (String(text).length - zhword.length) * fontSize * 0.5 + zhWidth;
    },
    getTipStatus(el){  // 获取tip动态配置
      let width, contentWidth;
      if(el){
        width = this.getPlaceWidth(el);
        contentWidth = this.getTipContentWidth(el, this.tipContent);
        if(contentWidth > width){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    },
    initMenu() {
      this.menu = new Vue(ElCascaderMenu).$mount();
      this.menu.options = this.options;
      this.menu.props = this.props;
      this.menu.expandTrigger = this.expandTrigger;
      this.menu.changeOnSelect = this.changeOnSelect;
      this.menu.popperClass = this.popperClass;
      this.popperElm = this.menu.$el;
      this.menu.$on('pick', this.handlePick);
      this.menu.$on('activeItemChange', this.handleActiveItemChange);
      this.menu.$on('menuLeave', this.doDestroy);
    },
    showMenu() {
      if (!this.menu) {
        this.initMenu();
      }

      this.menu.value = this.currentValue.slice(0);
      this.menu.visible = true;
      this.menu.options = this.options;
      this.$nextTick(_ => {
        this.updatePopper();
        this.menu.inputWidth = this.$refs.input.$el.offsetWidth - 2;
      });
    },
    hideMenu() {
      this.inputValue = '';
      this.menu.visible = false;
    },
    handleActiveItemChange(value) {
      this.$nextTick(_ => {
        this.updatePopper();
      });
      this.$emit('active-item-change', value);
    },
    handlePick(value, close = true) {
      this.currentValue = value;
      this.$emit('input', value);
      this.$emit('change', value);
      this.$emit('update:initLabel', this.currentLabels.join(this.split)); //同步初始化标签

      if (close) {
        this.menuVisible = false;
      } else {
        this.$nextTick(this.updatePopper);
      }
      // 验证 valid-item 组件
      this.$nextTick(_=>{
        this.dispatch('ElFormItem', 'el.form.blur', value);
        this.dispatch(this.validItemName, 'valid.item.blur', value);
        // this.dispatch('ElForm', 'compare-change', this);
        // this.dispatch(this.validItemName, 'compare-change', this);
      });
    },
    handleInputChange(value) {
      if (!this.menuVisible) return;
      const flatOptions = this.flatOptions;

      if (!value) {
        this.menu.options = this.options;
        this.$nextTick(this.updatePopper);
        return;
      }

      let filteredFlatOptions = flatOptions.filter(optionsStack => {
        return optionsStack.some(option => new RegExp(value, 'i').test(option[this.labelKey]));
      });

      if (filteredFlatOptions.length > 0) {
        filteredFlatOptions = filteredFlatOptions.map(optionStack => {
          return {
            __IS__FLAT__OPTIONS: true,
            value: optionStack.map(item => item[this.valueKey]),
            label: this.renderFilteredOptionLabel(value, optionStack)
          };
        });
      } else {
        filteredFlatOptions = [{
          __IS__FLAT__OPTIONS: true,
          label: this.t('el.cascader.noMatch'),
          value: '',
          disabled: true
        }];
      }
      this.menu.options = filteredFlatOptions;
      this.$nextTick(this.updatePopper);
    },
    renderFilteredOptionLabel(inputValue, optionsStack) {
      return optionsStack.map((option, index) => {
        const label = option[this.labelKey];
        const keywordIndex = label.toLowerCase().indexOf(inputValue.toLowerCase());
        const labelPart = label.slice(keywordIndex, inputValue.length + keywordIndex);
        const node = keywordIndex > -1 ? this.highlightKeyword(label, labelPart) : label;
        return index === 0 ? node : [' / ', node];
      });
    },
    highlightKeyword(label, keyword) {
      const h = this._c;
      return label.split(keyword)
        .map((node, index) => index === 0 ? node : [
          h('span', { class: { 'el-cascader-menu__item__keyword': true }}, [this._v(keyword)]),
          node
        ]);
    },
    flattenOptions(options, ancestor = []) {
      let flatOptions = [];
      options.forEach((option) => {
        const optionsStack = ancestor.concat(option);
        if (!option[this.childrenKey]) {
          flatOptions.push(optionsStack);
        } else {
          if (this.changeOnSelect) {
            flatOptions.push(optionsStack);
          }
          flatOptions = flatOptions.concat(this.flattenOptions(option[this.childrenKey], optionsStack));
        }
      });
      return flatOptions;
    },
    clearValue(ev) {
      ev.stopPropagation();
      this.handlePick([], true);
    },
    handleClickoutside() {
      this.menuVisible = false;
    },
    handleClick() {
      if (this.disabled || this.readonly) return;
      if (this.filterable) {
        this.menuVisible = true;
        this.$refs.input.$refs.input.focus();
        return;
      }
      this.menuVisible = !this.menuVisible;
    }
  },

  created() {
    this.debouncedInputChange = debounce(this.debounce, value => {
      const before = this.beforeFilter(value);

      if (before && before.then) {
        this.menu.options = [{
          __IS__FLAT__OPTIONS: true,
          label: this.t('el.cascader.loading'),
          value: '',
          disabled: true
        }];
        before
          .then(() => {
            this.$nextTick(() => {
              this.handleInputChange(value);
            });
          });
      } else if (before !== false) {
        this.$nextTick(() => {
          this.handleInputChange(value);
        });
      }
    });
  },

  mounted() {
    this.$nextTick(() => {
      this.flatOptions = this.flattenOptions(this.options);
      this.inputValue = this.currentLabels.join(this.split);
      if (this.initLabel && this.inputValue === '') {
        this.inputValue = this.initLabel;  //初始化标签
      } else {
        this.$emit('active-item-change', this.value);
      }
    }); //初始化赋值
  }
};
</script>
