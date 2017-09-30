<template>  
  <el-input 
    v-model="modelValue"
    @blur="blurChange"
    type="text"
    :name="name"
    :placeholder="placeholder"
    :validate-event="false"
    :disabled="disabled"
    :readonly="readonly"
    :maxlength="maxlength"
    :minlength="minlength"
    :auto-complete="autoComplete"
    :autofocus="autofocus"
    :form="form">
    <i slot="append" :class="[rateIcon]"></i>
  </el-input>
</template>
<script>
import emitter from 'element-ui/src/mixins/emitter';
import ElInput from 'element-ui/packages/input';
import math from 'element-ui/src/utils/math';

export default{
  name: 'RateNumber',
  componentName: 'RateNumber',
  components:{
    ElInput
  },
  mixins: [emitter],
  props:{
    value: {
      type: [String, Number],
      default: 0
    },
    isEmpty: Boolean,    // 默认是否可以为空
    placeholder: String,
    size: String,
    readonly: Boolean,
    autofocus: Boolean,
    icon: String,
    disabled: Boolean,
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
    max: null,
    min: null,
    validateEvent: {
      type: Boolean,
      default: true
    },
    rate: {
      type: String,
      default: 'percent'           // 还可以填 permillage 千分比
    }
  },
  data(){
    return{
      currentValue: 0,
      oldValue: 0,
      modelValue: 0,
      rateIcon: 'el-icon-percent' 
    };
  },
  watch:{
    value(val, old){
      // 是否允许为空
      if (this.hasEmpty(val)) {
        this.$emit('input', 0);
      } else {
        this.setCurrentValue(val);
      }
    },
    currentValue(n, o){

      if(n !== o){

        let pv, tmin, tmax;
        o = typeof o === "undefined" ? 0 : o;
        pv = isNaN(n) ? this.getSizeNumber(o) : this.getSizeNumber(n);

        if(!isNaN(pv) && n !== ""){

          tmin = parseFloat(this.min);
          if(!isNaN(this.min) && parseFloat(pv) < tmin){
            pv = tmin;
            this.setCurrentValue(pv);
          }

          tmax = parseFloat(this.max);
          if(!isNaN(this.max) && parseFloat(pv) > tmax){
            pv = tmax;
            this.setCurrentValue(pv);
          }

          if(isNaN(n)){
            this.setCurrentValue(pv);
          }

        } else {

          pv = "";
         
        }

        this.modelValue = n;
        pv = this.setPrecision(pv);
        this.$emit('input', pv);
        this.$emit('change', pv);
      }
    }
  },
  methods:{
    setPrecision(value){
      let numStr, num = null, mbit = 8;
      numStr = String(value).split(".");
      if(numStr.length===2 && String(numStr[1]).length > mbit){
        numStr[1] = String(numStr[1]).substr(0, mbit);
        num = numStr.join(".");
      }
      return (num === null || isNaN(num)) ? value : Number(num);
    },
    getSizeNumber(val){
      if(val === ""){
        return "";
      }else if(this.getRate() === 'percent'){ 
        return math.div(this.setPrecision(val), 100);
      }else{
        return math.div(this.setPrecision(val), 1000);
      }
    },
    blurChange(e){
      e.target.value = this.setPrecision(e.target.value);
      let realVal =this.setPrecision(this.getSizeNumber(e.target.value));
      this.setCurrentValue(realVal);
      this.$emit('input', realVal);
      this.$emit('change', realVal);

      if (realVal == 0) this.modelValue = 0;
      this.$nextTick(function() {
        if (this.validateEvent) {
          // 验证 valid-item 组件
          this.dispatch(this.validItemName, 'valid.item.blur', [realVal]);
          this.dispatch('ElFormItem', 'el.form.blur', [realVal]);
        }
      });
    },
    setCurrentValue(value) {
      if(!isNaN(value) && value !== ""){
      
        value = Number(value);
      
        let pv = this.getRateValue(value);

        if (pv === this.currentValue) return;

        this.currentValue = pv;

      }else if(value === "" || value === "-"){
        this.currentValue = "";
      }else{
        this.currentValue = value;
      }
      this.modelValue = this.currentValue;
    },
    getRateValue(value) {
      return this.getRate() === 'percent'
        ? math.multi(value, 100) : math.multi(value, 1000);
    },
    getRate() {
      let _rate = 'percent';
      if(this.rate === 'permillage'){ _rate = 'permillage'; }
      return _rate;
    },
    hasEmpty(val) {
      if (!this.isEmpty &&
        (typeof val === 'undefined' || val ==='' || /^\s+$/g.test(val))) {
        return true;
      }
      return false;
    }
  },
  mounted() {
    let val = this.value;
    if (this.hasEmpty(val)) {
      this.$emit('input', 0);
    } else {
      this.rateIcon = (this.getRate() === 'permillage') ? 'el-icon-permillage': this.rateIcon;
      this.currentValue = this.getRateValue(val);
    }
  }
};
</script>