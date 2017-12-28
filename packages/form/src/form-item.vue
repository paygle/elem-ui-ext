<template>
  <div class="el-form-item" :class="{
    'is-error': validateState === 'error',
    'is-validating': validateState === 'validating',
    'is-required': isRequired || required
  }">
    <label :for="prop" class="el-form-item__label" v-bind:style="labelStyle" v-if="label || $slots.label">
      <slot name="label">{{label + form.labelSuffix}}</slot>
    </label>
    <div class="el-form-item__content" v-bind:style="contentStyle">
      <slot></slot>
      <transition name="el-zoom-in-top">
        <div class="el-form-item__error" v-if="validateState === 'error' && showMessage && form.showMessage">{{validateMessage}}</div>
      </transition>
    </div>
  </div>
</template>
<script>
  import AsyncValidator from 'async-validator';
  import emitter from 'element-ui/src/mixins/emitter';
  import { TypeOf } from 'element-ui/src/utils/funcs';

  function noop() {}
  // 自定义日期兼容转换
  const compatDateStr = function(date){
    return typeof date === 'string' ? String(date).replace('-', '/') : date;
  };

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

  export default {
    name: 'ElFormItem',

    componentName: 'ElFormItem',

    mixins: [emitter],

    props: {
      label: String,
      labelWidth: String,
      prop: String,
      required: Boolean,
      rules: [Object, Array],
      error: String,
      validateStatus: String,
      showMessage: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      error(value) {
        this.validateMessage = value;
        this.validateState = value ? 'error' : '';
      },
      validateStatus(value) {
        this.validateState = value;
      }
    },
    computed: {
      labelStyle() {
        var ret = {};
        if (this.form.labelPosition === 'top') return ret;
        var labelWidth = this.labelWidth || this.form.labelWidth;
        if (labelWidth) {
          ret.width = labelWidth;
        }
        return ret;
      },
      contentStyle() {
        var ret = {};
        const label = this.label;
        if (this.form.labelPosition === 'top' || this.form.inline) return ret;
        if (!label && !this.labelWidth && this.isNested) return ret;
        var labelWidth = this.labelWidth || this.form.labelWidth;
        if (labelWidth) {
          ret.marginLeft = labelWidth;
        }
        return ret;
      },
      form() {
        let parent = this.$parent;
        let parentName = parent.$options.componentName;
        while (parentName !== 'ElForm') {
          if (parentName === 'ElFormItem') {
            this.isNested = true;
          }
          parent = parent.$parent;
          parentName = parent.$options.componentName;
        }
        return parent;
      },
      fieldValue: {
        cache: false,
        get() {
          var model = this.form.model;
          if (!model || !this.prop) { return; }

          var path = this.prop;
          if (path.indexOf(':') !== -1) {
            path = path.replace(/:/, '.');
          }

          return getPropByPath(model, path).v;
        }
      },
      isRequired() {
        let rules = this.getRules();
        let isRequired = false;

        if (rules && rules.length) {
          rules.every(rule => {
            if (rule.required) {
              isRequired = true;
              return false;
            }
            return true;
          });
        }
        return isRequired;
      }
    },
    data() {
      return {
        validateState: '',
        validateMessage: '',
        validateDisabled: false,
        validator: {},
        isNested: false,
        isCustomStyl: false,  // 是否以自定义为主
        customStyl: '',
        errStyl: {}    // 错误样式设置
      };
    },
    methods: {
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
        this.validateDisabled = false;
        var rules = this.getFilteredRule(trigger);

        // 验证样式设置
        this.$nextTick(()=> {
          this.customStylSet(this.prop, this.validateState);
          // 触发外部校验
          if (typeof this.form.validTrigger === 'function') this.form.validTrigger.call(null, this.form.model);
        });

        if ((!rules || rules.length === 0) && !this._props.hasOwnProperty('required')) {
          callback();
          return true;
        }

        this.validateState = 'validating';

        var descriptor = {};
        descriptor[this.prop] = rules;

        var validator = new AsyncValidator(descriptor);
        var model = {}, that = this;

        model[this.prop] = this.getTypeData(this.fieldValue, rules);

        validator.validate(model, { firstFields: true }, (errors, fields) => {
          that.validateState = !errors ? 'success' : 'error';
          that.validateMessage = errors ? errors[0].message : '';
          callback(that.validateMessage);
        });

      },
      // 自定义清除状态
      resetStatus() {
        this.validateState = '';
        this.validateMessage = '';
      },

      resetField() {
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
      },
      getRules() {
        var formRules = this.form.rules;
        var selfRules = this.rules;
        var requiredRule = this._props.hasOwnProperty('required') ? { required: !!this.required } : [];

        formRules = formRules ? formRules[this.prop] : [];

        return [].concat(selfRules || formRules || []).concat(requiredRule);
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

        this.validate('change');
      }
    },
    mounted() {
      if (this.prop) {
        this.dispatch('ElForm', 'el.form.addField', [this]);

        let initialValue = this.fieldValue;
        if (Array.isArray(initialValue)) {
          initialValue = [].concat(initialValue);
        }
        Object.defineProperty(this, 'initialValue', {
          value: initialValue
        });

        let rules = this.getRules();

        if (rules.length || this._props.hasOwnProperty('required')) {
          this.$on('el.form.blur', this.onFieldBlur);
          this.$on('el.form.change', this.onFieldChange);
        }
      }
    },
    beforeDestroy() {
      this.dispatch('ElForm', 'el.form.removeField', [this]);
    }
  };
</script>
