<template>
  <div v-clickoutside="updateLayout" class="valid-item el-form-item" :style="itemStyl" :class="{
    'is-error': validateState === 'error',
    'is-validating': validateState === 'validating',
    'is-required': isRequired || required
  }">
    <label :for="prop" ref="validLabel" class="el-form-item__label" v-bind:style="labelStyle" v-if="label">
      {{label}}
    </label>
    <div class="el-form-item__content" v-bind:style="contentStyl">
      <slot></slot>
      <transition name="el-zoom-in-top">
        <div class="el-form-item__error" v-if="validateState === 'error' && showMessageIs">{{validateMessage}}</div>
      </transition>
    </div>
  </div>
</template>
<script>
import AsyncValidator from 'async-validator';
import Clickoutside from 'element-ui/src/utils/clickoutside';
import emitter from 'element-ui/src/mixins/emitter';
import { cssUnitsCalc, TypeOf, compatDateStr } from 'element-ui/src/utils/funcs';
const noop = () => { };

function getPropByPath(obj, path) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');

  let keyArr = path.split('.');
  let i = 0;

  for (let len = keyArr.length; i < len - 1; ++i) {
    let key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      throw new Error('please transfer a valid prop path to form item!');
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj[keyArr[i]]
  };
}

function setCustomStyle(cp, styl) {
  let that = this;
  let fields = cp.stylefields || cp.fields;
  if (!Array.isArray(that.fields)) return;
  fields.forEach((f)=>{
    that.fields.forEach((field) => {
      if (f === field.prop) field.customStylSet(field.prop, 'custom', styl);
    });
  });
}

export default {
  name: 'ValidItem',
  mixins: [emitter],
  directives: {
    Clickoutside
  },
  props: {
    compoName: {                        // 自定义组件名称
      type: String,
      default() {
        return 'ValidItem';
      }
    },
    display: {
      type: String,
      default: 'inline-block'
    },
    trigger: {                      // 触发函数类型 blur | change
      type: String,
      default() {
        return 'blur';
      }
    },
    callback: {                      // 回调函数
      type: Function,
      default() {
        return noop;
      }
    },
    prop: String,
    model: null,                      // 需要验证的数据对象
    itemWidth: String,                // 项目宽度
    label: String,
    labelAlign: {                      // label 对齐 left center right
      type: String,
      default: 'right'
    },
    labelWidth: String,
    gapWidth: {
      type: String,
      default: '0px'
    },
    required: Boolean,
    rules: [Object, Array],           // 验证规则
    error: String,
    showMessage: {
      type: Boolean,
      default: true
    },
    validTrigger: Function, // 触发外部验证函数
    errStyl: Object,     // 错误样式设置
    compareStyl: Array   // 比较字段设置样式
  },
  watch: {
    error(value) {
      this.validateMessage = value;
      this.validateState = value ? 'error' : '';
    },
    model(n, o) {
      this.onFieldChange();
    }
  },
  computed: {

    labelStyle() {
      var ret = {};
      var labelWidth = typeof this.labelWidth !== 'undefined' ? this.labelWidth : this.form.labelWidth;
      ret.display = 'inline-block';
      ret.textAlign = this.labelAlign;
      if (labelWidth) {
        ret.width = labelWidth;
      }
      if (this.display) {
        ret.display = this.display;
      }
      return ret;
    },
    fieldValue: {
      cache: false,
      get() {
        var model = this.model;
        if (!model || !this.prop) { return; }

        var path = this.prop;
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.');
        }

        return getPropByPath(model, path).v;
      }
    },
    form() {
      if (this.$parent.$options.componentName === 'ValidForm') {
        return this.$parent;
      }
      return {};
    },
    showMessageIs() {
      return typeof this.form.showMessage !== 'undefined' ? this.form.showMessage : this.showMessage;
    },
    validThisTrigger() {
      return this.form.validTrigger || this.validTrigger;
    },
    compareStylThis() {
      return this.form.compareStyl || this.compareStyl;
    }
  },
  data() {
    return {
      itemStyl: {
        display: this.display,
        width: this.itemWidth
      },
      errItemStyl: {},        // 错误样式设置
      contentStyl: {},
      validateState: '',
      validateMessage: '',
      validateDisabled: false,
      validator: {},
      isRequired: false,
      isCustomStyl: false,
      customStyl: '',
      fields: []
    };
  },
  methods: {
    /* 比值样式计算
      [
        {
          style: {                 // 自定义样式
            color: '#fff',
            background: 'green'
          },
          fields: ['name', 'desc'], // 需要比较触发计算的字段
          stylefields: ['desc'], // 需要设置样式的字段（省略时，同fields)
          compare:function(data) {
            return data.name > data.desc;    // 返回为真时设置给定样式
          }
        }
      ]
    */
    compareChgStyl(el) {
      if (this.form.$options) {
          this.form.compareChgStyl(el);
      } else {
        if (!Array.isArray(this.compareStylThis)) return;
        let that = this;
        let fieldname = el.$parent.prop;  // 获取字段名称

        this.compareStylThis.forEach((cp) => {
          let hasf = cp.fields.filter(n => n === fieldname);
          if (hasf.length > 0) {
            if (cp.compare.call(null, that.model)) {
              setCustomStyle.call(this, cp, cp.style);
            } else {
              setCustomStyle.call(this, cp, {});
            }
          }
        });
      }
    },
    /**
    *@param parent [Object] 父级组件
    *@param validateName [String] 独立验证单元域名
    */
    loadFields(parent, validateName) {
      if (this.form.$options) return;
      if (this.compareStylThis) this.isCustomStyl = true;
      let vdname = validateName || 'ValidItem', that = this, i, cp;

      if (typeof parent === 'object' && Array.isArray(parent.$children) && Array.isArray(this.compareStylThis)) {
        for (i=0; i < that.compareStylThis.length; i++) {
          cp = that.compareStylThis[i]; 
          if (Array.isArray(cp.fields) && cp.fields.filter(n => n === that.prop).length > 0) {
            cp.fields.forEach((f) => {
              parent.$children.forEach((item) => {
                if (vdname === item.$options.componentName && item.prop === f && that.fields.indexOf(item) < 1) {
                  that.fields.push(item);
                }
              });
            });
          }
        }
      }
    },
    // 自定义样式设置
    customStylSet(field, status, styl) {
      // 验证样式设置
      if (typeof styl !== 'undefined') this.customStyl = styl;
      if (status === 'error') {
        this.broadcast('ElInput', 'custom-style', this.errStyl);
        this.broadcast('AddressBox', 'custom-style', this.errStyl);
      } else  if (status === 'custom' && this.validateState !== 'error') {
        this.broadcast('ElInput', 'custom-style', styl);
        this.broadcast('AddressBox', 'custom-style', styl);
      } else if ((this.isCustomStyl && status !== 'custom') || styl === '') {
        if (this.customStyl === '' && this.validateState !== 'error') {
          this.broadcast('ElInput', 'custom-style', {});
          this.broadcast('AddressBox', 'custom-style', {});
        } 
      }
    },
    getTypeData(value, rules){ // 自定义获取日期数据类型
      let typevalue="", cdate;
      if(TypeOf(rules) === 'Array'){
        for(let i=0; i<rules.length; i++){
          if(TypeOf(rules[i]) === 'Object' && rules[i]['type'] === 'date' && TypeOf(value) === "String"){
            cdate = new Date(compatDateStr(value));
          }
        }
      }else if(TypeOf(rules) === 'Object' && rules.type === 'date' && TypeOf(value) === "String"){
        cdate = new Date(compatDateStr(value));
      }

      if(TypeOf(value) === 'Date'){
        typevalue = value;
      }else if(TypeOf(cdate) === 'Date' && !isNaN(cdate.getTime())){
        typevalue = cdate;
      }else{
        typevalue = value;
      }
      return typevalue;
    },
    validate(trigger, callback = noop) {

      var rules = this.getFilteredRule(trigger);
      // 验证样式设置
      this.$nextTick(()=> {
        this.customStylSet(this.prop, this.validateState);
        // 触发外部校验
        if (typeof this.validThisTrigger === 'function') this.validThisTrigger.call(null, this.model);
      });

      if (!this.prop) return;
      if (!rules || rules.length === 0) {
        callback();
        this.$emit('validate', { prop: this.prop });
        return true;
      }

      this.validateState = 'validating';

      var validator, descriptor = {}, model = {};
      descriptor[this.prop] = rules;
      model[this.prop] = this.getTypeData(this.fieldValue, rules);
      validator = new AsyncValidator(descriptor);

      validator.validate(model, { firstFields: true }, (errors, fields) => {
        this.validateState = !errors ? 'success' : 'error';
        this.validateMessage = errors ? errors[0].message : '';
        this.$emit('validate', { state: this.validateState, msg: this.validateMessage, prop: this.prop });
        callback(this.validateMessage);
      });
    },
    resetField() {

      if (this.form.$options) {

        this.validateState = '';
        this.validateMessage = '';

        let model = this.form.model;
        let value = this.fieldValue;
        let path = this.prop;
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.');
        }

        let prop = getPropByPath(model, path);

        if (Array.isArray(value)) {
          this.validateDisabled = true;
          prop.o[prop.k] = [].concat(this.initialValue);
        } else {
          this.validateDisabled = true;
          prop.o[prop.k] = this.initialValue;
        }

        this.customStylSet(this.prop, 'clear');

      } else {
        this.broadcast('ElInput', 'input', this.initialValue);
        this.$nextTick(function () {
          this.validateState = '';
          this.validateMessage = '';
          this.customStylSet(this.prop, 'clear');
        });
      }
    },
    getRules() {
      if (this.form.$options) {
        var formRules = this.form.rules;
        var selfRules = this.rules;
        var requiredRule = this._props.hasOwnProperty('required') ? { required: !!this.required } : [];

        formRules = formRules ? formRules[this.prop] : [];

        return [].concat(selfRules || formRules || []).concat(requiredRule);
      } else if (this.rules && this.prop) {
        return [].concat(this.rules[this.prop] || []);
      }
      return [];
    },
    getFilteredRule(trigger) {
      var rules = this.getRules();
      return rules.filter(rule => {
        return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
      });
    },
    onFieldBlur() {
      this.validate('blur');
    },
    onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false;
        return;
      }
      this.validate('change', this.callback);
      this.validate(this.trigger, this.callback);
    },
    updateLayout() {
      this.$nextTick(function () {
        if (this.$el && this.$refs.validLabel) {
          if (this.display === 'inline-block') {
            var labelWidth = typeof this.labelWidth !== 'undefined' ? this.labelWidth : this.form.labelWidth;
            this.contentStyl = { marginLeft: cssUnitsCalc("+", labelWidth, this.gapWidth) };
          }
        }
      });
    }
  },
  mounted() {

    this.$options.componentName = this.compoName;
    this.errItemStyl = this.errStyl;
    if (this.prop) {
      this.dispatch('ValidForm', 'valid.form.addField', [this]);

      let initialValue = this.fieldValue;
      if (Array.isArray(initialValue)) {
        initialValue = [].concat(initialValue);
      }
      Object.defineProperty(this, 'initialValue', {
        value: initialValue
      });

      let rules = this.getRules();
      let that = this;

      if (rules.length) {
        rules.every(rule => {
          if (rule.required) {
            that.isRequired = true;
            return false;
          }
        });
      }
      this.$on('valid.item.blur', this.onFieldBlur);
      this.$on('valid.item.change', this.onFieldChange);
      this.$on('valid.item.reset', this.resetField);
    }
    this.updateLayout();
    this.$on('compare-change', this.compareChgStyl);
    this.$on('load.valid.fields', this.loadFields);
  },
  beforeDestroy() {
    if (this.form.$options) this.dispatch('ValidForm', 'valid.form.removeField', [this]);
  }
};
</script>