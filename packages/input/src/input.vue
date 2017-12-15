<template>
  <div :class="[
    type === 'textarea' ? 'el-textarea' : 'el-input',
    size ? 'el-input--' + size : '',
    {
      'is-readonly': readonly,
      'is-disabled': disabled,
      'el-input-group': $slots.prepend || $slots.append,
      'el-input-group--append': $slots.append,
      'el-input-group--prepend': $slots.prepend
    }
  ]">
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="el-input-group__prepend"
        v-if="$slots.prepend"
        :style="[preWidth, fixedFirefox]">
        <slot name="prepend"></slot>
      </div>
      <!-- input 图标 -->
      <slot name="icon">
        <i class="el-input__icon"
          :class="[
            'el-icon-' + icon,
            onIconClick ? 'is-clickable' : ''
          ]"
          v-if="icon"
          @click="handleIconClick">
        </i>
      </slot>
      <input
        v-if="type !== 'textarea'"
        class="el-input__inner"
        v-bind="$props"
        :autocomplete="autoComplete"
        :value="currentValue"
        ref="input"
        :style="[customCrtStyl, fixedChrome]"
        @mouseover="inputMSEnter"
        @mouseout="inputMSOut"
        @keydown="fixIeReadonly"
        @keyup.enter="keyEnter"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      >
      <i class="el-input__icon el-icon-loading" v-if="validating"></i>
      <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      class="el-textarea__inner"
      :value="currentValue"
      @input="handleInput"
      ref="textarea"
      v-bind="$props"
      :style="[textareaStyle, customCrtStyl]"
      @focus="handleFocus"
      @blur="handleBlur">
    </textarea>
  </div>
</template>
<script>
  import emitter from 'element-ui/src/mixins/emitter';
  import calcTextareaHeight from './calcTextareaHeight';
  import merge from 'element-ui/src/utils/merge';
  import { getFloatNumber, createDomElement, isOwnEmpty, Browser } from 'element-ui/src/utils/funcs';

  const getMaxMinVal = function(value, max, min, type){
    if(type !== "string" && value !== "" && value !== "-"){
      if(isNaN(value)) { value = 0; } 
      if(typeof max !== "undefined" && !isNaN(max) && value > max) {
        value = max;
      }
      if(typeof min !== "undefined" && !isNaN(min) && value < min) {
        value = min;
      }
    }
    return value;
  };
  const bws = new Browser();

  export default {
    name: 'ElInput',

    componentName: 'ElInput',

    mixins: [emitter],

    data() {
      return {
        currentValue: '',
        textareaCalcStyle: {},
        isSetNumber: true,         // 是否允许获取精度数
        parentTipText: '',         // 父类组件提示内容
        tipContent: '',            // tooltip内容
        notifyStyl: {},
        notifyWidth: 0,
        isNoticeShow: false,
        tipTimeHander: null,
        noticeDom: null,
        innerTipShow: false,   // 默认禁用 tooltip功能
        customSfStyl: '',
        customStyl: ''         // 自定义样式
      };
    },

    props: {
      validItemName: {     // 使用 valid-item组件时的组件名称
        type: String,
        default: 'ValidItem'
      },
      histype: {           // 值类型  唯一值 string 类型或不存在
        type: String,
        default: 'string'
      },
      delayed: Boolean,          // 值变化延时响应
      tipDisabled: {             // 默认不禁用显示tooltip
       type: Boolean,
        default: false
      },
      roundoff:{                 // 是否四啥五入
       type: Boolean,
        default: false
      },
      precision: {               // 数字自定义精度
        type: [Number, String],
        default: -1
      },
      prependWidth: String, // 前置宽度
      parentValue: null,   // 父组件值
      getFillStyl: Function,         // 获取自定义组件配色
      value: [String, Number],
      placeholder: String,
      size: String,
      resize: String,
      readonly: Boolean,
      autofocus: Boolean,
      icon: String,
      disabled: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      name: String,
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      rows: {
        type: Number,
        default: 2
      },
      autoComplete: {
        type: String,
        default: 'off'
      },
      form: String,
      maxlength: Number,
      minlength: Number,
      max: {},
      min: {},
      step: {},
      validateEvent: {
        type: Boolean,
        default: true
      },
      onIconClick: Function
    },

    computed: {
      validating() {
        return this.$parent.validateState === 'validating';
      },
      textareaStyle() {
        return merge({}, this.textareaCalcStyle, { resize: this.resize });
      },
      fixedChrome() {
        if (bws.browser === 'Chrome') {
          return {height: '100%'};
        }
        return {};
      },
      fixedFirefox() {
        if (bws.browser === 'Firefox') {
          return {overflow: 'hidden'};
        }
        return {};
      },
      preWidth() {
        if (this.prependWidth) {
          return {width: this.prependWidth};
        }
        return {};
      },
      customCrtStyl() {
        if (typeof this.customStyl === 'object' && !isOwnEmpty(this.customStyl)) {
          return this.customStyl;
        } else if (typeof this.customSfStyl === 'object' && !isOwnEmpty(this.customSfStyl)) {
          return this.customSfStyl;
        }
        return {};
      },
      isEmptyPrtValue() {
        return this.parentValue === null || typeof this.parentValue === 'undefined';
      }
    },

    watch: {
      'value': {
        immediate: true,
        handler(value){
          value = typeof value === 'undefined' ? '' : value;
          this.setCurrentValue(value);
          this.customfillStyl(value);
        }
      },
      currentValue(val){   //自动设置是否显示hover提示
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
      // 独立样式设置
      customfillStyl(value) {
        if (typeof this.getFillStyl === 'function') {
          let val = !this.isEmptyPrtValue ? this.parentValue : value;
          this.customSfStyl = this.getFillStyl.call(null, val);
        }
      },
      // 设置错误样式
      setCustomStyle(styl) {
        this.customStyl = styl;
      },
      keyEnter(e) {
        this.$emit('key-enter', e);
      },
      inputMSEnter(e) {
        let pos, gapw, style, color = "", that = this;
        let inputEl = this.$el.querySelector('input');
        let inputWidth = this.getPlaceWidth(inputEl);
        let isParentText = typeof that.parentTipText === 'string' &&  that.parentTipText !== '';
        that.notifyWidth = this.getTipContentWidth(inputEl, this.tipContent);

        if(that.innerTipShow || isParentText){
          that.tipTimeHander = setTimeout(()=>{
            pos = inputEl.getBoundingClientRect();
            gapw = that.notifyWidth > 0 ? (that.notifyWidth - inputWidth)/2 : 0;
            
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
      inputMSOut(e){
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
            this.tipContent = value ? String(value) : String(this.currentValue);
            this.innerTipShow = this.getTipStatus(this.$el.querySelector('input'));
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
      fixIeReadonly(e){ // 修复IE下readonly后退问题
        if(this.readonly){
          e.preventDefault();
        }
      },
      getTypeVal(value){
        if(this.histype !== 'string' && value !== "" && value !== "-") {
          // 数值转化
          if(this.precision > -1){
            value = isNaN(value) ? 0 : getFloatNumber(this.precision, value, this.roundoff);
          }
          value = isNaN(value) ? value : Number(value);
          value = getMaxMinVal(value, this.max, this.min, this.histype);
        }else{
          value = String(value);
        }
        return value;
      },
      handleBlur(event) {
        this.isSetNumber = true;
        // 自定义精度计算
        let value = event.target.value;
        value = this.getTypeVal(value);
        if(value === "-") value = 0;
        if(value === 0) event.target.value = 0;
        // 失去焦点后才改变值
        this.$emit('input', value);
        this.setCurrentValue(value);
        this.$emit('change', value);
        this.$emit('any-change', value);    // 任何修改都调用  
        this.$emit('blur', event);
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue]);
          // 验证 valid-item 组件
          this.dispatch(this.validItemName, 'valid.item.blur', [this.currentValue]);
          this.dispatch('ElForm', 'compare-change', this);
          this.dispatch(this.validItemName, 'compare-change', this);
        }
      },
      inputSelect() {
        this.$refs.input.select();
      },
      resizeTextarea() {
        if (this.$isServer) return;
        var { autosize, type } = this;
        if (type !== 'textarea') return;
        if (!autosize) {
          this.textareaCalcStyle = {
            minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
          };
          return;
        }
        const minRows = autosize.minRows;
        const maxRows = autosize.maxRows;

        this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
      },
      handleFocus(event) {
        this.isSetNumber = false;
        this.$emit('focus', event);
      },
      handleInput(event) {
        if(!this.delayed) {
          let value = event.target.value;
          value = this.getTypeVal(value);
          value = getMaxMinVal(value, this.max, this.min, this.histype);
          this.$emit('input', value);
          this.currentValue = value;
          // this.setCurrentValue(value);  // 这里响应太快
          this.$emit('change', value);
        }
      },
      handleIconClick(event) {
        if (this.onIconClick) {
          this.onIconClick(event);
        }
        this.$emit('click', event);
      },
      setCurrentValue(value) {
        // 设置精度或字符串
        if(this.histype !== 'string') {
          if(this.precision > 0 && this.isSetNumber){
            value = getFloatNumber(this.precision, value, this.roundoff);
          }else{
            value = (!isNaN(value) && value !="") ? Number(value) : value;
          }
          value = getMaxMinVal(value, this.max, this.min, this.histype);
        }else{
          value = String(value);
        }

        if (value === this.currentValue) return;
        this.$emit('any-change', value);   // 任何修改都调用
        this.$nextTick(_ => {
          this.resizeTextarea();
        });
        this.currentValue = value;
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.change', [value]);
          // 验证 valid-item 组件
          this.dispatch(this.validItemName, 'valid.item.change', [value]);
          this.dispatch('ElForm', 'compare-change', this);
          this.dispatch(this.validItemName, 'compare-change', this);
        }
      }
    },

    created() {
      this.$on('inputSelect', this.inputSelect);
      this.$on('custom-style', this.setCustomStyle);
    },

    mounted() {
      this.$on('parent-tip-text', (val)=>{ this.parentTipText = val; });
      this.resizeTextarea();
      this.setTipContent();
      this.$nextTick(() => {
        if (this.isEmptyPrtValue) {
          this.dispatch('ElForm', 'compare-change', this);
          this.dispatch(this.validItemName, 'compare-change', this);
        }
      });
    }
  };
</script>
