<template>  
  <el-input 
    v-model="modelValue"
    @blur="blurChange"
    :type="type"
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
    value: [String, Number],
    placeholder: String,
    size: String,
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
      this.setCurrentValue(val);
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
        pv = this.setPrecision(pv, 6);
        this.$emit('input', pv);
        this.$emit('change', pv);
      }
    }
  },
  methods:{
    setPrecision(value, bit){
      let numStr, num = null, mbit = bit || 4;
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
        return math.div(this.setPrecision(val, 3), 1000);
      }
    },
    blurChange(e){
      if(this.getRate() === 'percent'){
        e.target.value = this.setPrecision(e.target.value);
      }else{
        e.target.value = this.setPrecision(e.target.value, 3); 
      }
      let realVal =this.setPrecision(this.getSizeNumber(e.target.value), 6);
      this.setCurrentValue(realVal);
      this.$emit('input', realVal);
      this.$emit('change', realVal);

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
    },
    getRateValue(value) {
      return this.getRate() === 'percent'
        ? math.multi(value, 100) : math.multi(value, 1000);
    },
    getRate() {
      let _rate = 'percent';
      if(this.rate === 'permillage'){ _rate = 'permillage'; }
      return _rate;
    }
  },
  mounted() {
    if(this.getRate() === 'permillage'){
      this.rateIcon = 'el-icon-permillage';
    }
    this.currentValue = this.getRateValue(this.value);
  }
};
</script>