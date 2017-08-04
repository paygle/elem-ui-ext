<template>
  <div class="cell el-form-item" :class="{
    'is-error': validateState === 'error',
    'is-validating': validateState === 'validating',
    'is-required': isRequired || required }"
    @mouseover="mouseHandler"
    @mouseout="mouseHandler">
    <slot></slot>
  </div>
</template>
<script>
  import AsyncValidator from 'async-validator';
  import emitter from 'element-ui/src/mixins/emitter';
  import { TypeOf } from 'element-ui/src/utils/funcs';

  function noop() {}

  const getTypeOfVal = function(value, type){
  
    let ret = undefined;
    if(typeof value === 'undefined') return ret;
    switch (type) {

      case 'string':
      case 'email':
      case 'url':
        ret = String(value);
        break;

      case 'number':
      case 'integer':
        ret = isNaN(value) ? value : Number(value);
        break;

      case 'float':
        ret = isNaN(value) ? value : parseFloat(value);
        break;

      case 'boolean':
        ret = Boolean(value);
        break;

      default:
        ret = undefined;
    }

    return ret;
  };

  export default {
    name: 'FormTableItem',

    componentName: 'ElFormItem',

    mixins: [emitter],

    props: {
      prop: Object,
      value: [String, Number, Boolean, Array],
      required: Boolean,
      rules: [Object, Array],
      error: String,
      validateStatus: String
    },
    watch: {
      error(value) {
        this.validateMessage = value;
        this.validateState = 'error';
      },
      validateStatus(value) {
        this.validateState = value;
      },
      value(){
        // this.validate('blur');
      }
    },
    data() {
      return {
        validateState: '',
        validateMessage: '',
        validateDisabled: false,
        validator: {},
        isRequired: false
      };
    },
    methods: {
      mouseHandler(e) { // 自定义事件通知
        this.broadcast('ElInput', 'parent-tip-text', this.validateMessage);
      },
      validate(trigger, callback = noop) {

        if(TypeOf(this.value) === 'Array')  return; //类型为数据时不校验
        // const regxNumber = /^\d*\.?\d*$/g;
        const {row, column, store:{table:{rules}}} =  this.prop;
        const rule = rules?rules[column.property]:null; // 获取当前属性的校验规则
        if(rule){ // 存在规则才进行校验
          this.validateState = 'validating';
          let descriptor = {};
          descriptor[column.property] = rule;
          let validator = new AsyncValidator(descriptor);
          let cell, type = 'string', model = {};

          for(let i=0; i<rule.length; i++){
            cell = rule[i] || {};
            type = cell.type ? cell.type : 'string';
          }

          let cvtVal = getTypeOfVal(this.value, type);
          model[column.property] = typeof cvtVal === 'undefined' ? this.value : cvtVal;
          validator.validate(model, { firstFields: true, row : row }, (errors, fields) => {
            this.validateState = !errors ? 'success' : 'error';
            this.validateMessage = errors ? errors[0].message : '';

            callback(errors);
          });
        }
        
        let p = this.prop;
        if(p.column.property){
          if(this.validateState != 'error'){
            p.store.commit('disErrCount', 'row'+p.$index+p.column.property);
          }else{
            p.store.commit('setErrCount', 'row'+p.$index+p.column.property);
          }
        }
        
        this.dispatch('FormTable', 'err-change');
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
        // 排除table-column 为default的属性，防止校验属性重复添加
        if( this.prop.column.type != 'default' ){
           this.dispatch('FormTable', 'el.form.addField', [this]);
           this.$on('el.form.blur', this.onFieldBlur);
           this.$on('el.form.change', this.onFieldChange);
        }
      }
    },
    beforeDestroy() {
      this.dispatch('FormTable', 'el.form.removeField', [this]);
    }
  };
</script>
