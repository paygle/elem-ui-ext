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
        <div class="el-form-item__error" v-if="validateState === 'error' && showMessage">{{validateMessage}}</div>
      </transition>
    </div>
  </div>
</template>
<script>
import AsyncValidator from 'async-validator';
import Clickoutside from 'element-ui/src/utils/clickoutside';
import emitter from 'element-ui/src/mixins/emitter';
import { cssUnitsCalc } from 'element-ui/src/utils/funcs';
const noop = () => { };

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
    model: [String, Number, Boolean],  // 需要验证的值
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
    }
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
      ret.display = 'inline-block';
      ret.textAlign = this.labelAlign;
      if (this.labelWidth) {
        ret.width = this.labelWidth;
      }
      if (this.display) {
        ret.display = this.display;
      }
      return ret;
    },
    fieldValue: {
      cache: false,
      get() {
        return this.model;
      }
    }
  },
  data() {
    return {
      itemStyl: {
        display: this.display,
        width: this.itemWidth
      },
      contentStyl: {},
      validateState: '',
      validateMessage: '',
      validateDisabled: false,
      validator: {},
      isRequired: false
    };
  },
  methods: {
    validate(trigger, callback = noop) {

      var rules = this.getFilteredRule(trigger);
      if (!this.prop) return;
      if (!rules || rules.length === 0) {
        callback();
        this.$emit('validate', { prop: this.prop });
        return true;
      }

      this.validateState = 'validating';

      var validator, descriptor = {}, model = {};
      descriptor[this.prop] = rules;
      model[this.prop] = this.model;
      validator = new AsyncValidator(descriptor);

      validator.validate(model, { firstFields: true }, (errors, fields) => {
        this.validateState = !errors ? 'success' : 'error';
        this.validateMessage = errors ? errors[0].message : '';
        this.$emit('validate', { state: this.validateState, msg: this.validateMessage, prop: this.prop });
        callback(this.validateMessage);
      });
    },
    resetField() {
      this.broadcast('ElInput', 'input', this.initialValue);
      this.$nextTick(function () {
        this.validateState = '';
        this.validateMessage = '';
      });
    },
    getRules() {
      if (this.rules && this.prop) {
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
      this.validate(this.trigger, this.callback);
    },
    updateLayout() {
      this.$nextTick(function () {
        if (this.$el && this.$refs.validLabel) {
          if (this.display === 'inline-block') {
            this.contentStyl = { marginLeft: cssUnitsCalc("+", this.labelWidth, this.gapWidth) };
          }
        }
      });
    }
  },
  mounted() {

    this.$options.componentName = this.compoName;

    if (this.prop) {

      Object.defineProperty(this, 'initialValue', {
        value: this.fieldValue
      });

      let rules = this.getRules();

      if (rules.length) {
        rules.every(rule => {
          if (rule.required) {
            this.isRequired = true;
            return false;
          }
        });
      }
      this.$on('valid.item.blur', this.onFieldBlur);
      this.$on('valid.item.change', this.onFieldChange);
      this.$on('valid.item.reset', this.resetField);
    }
    this.updateLayout();
  }
};
</script>