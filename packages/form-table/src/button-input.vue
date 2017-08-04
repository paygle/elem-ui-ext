<template>
  <div class="button-input">
    <el-input 
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabledInput"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :auto-complete="autoComplete"
        :autofocus="autofocus"
        :min="min"
        :max="max"
        :form="form"
        v-model="currentDisplay"
      >
      <el-button slot="append" type="primary" :disabled="disabled" @click="iconButtonClick"><i :class="[btnIcon]"></i></el-button>
    </el-input>
  </div>
</template>
<script>
import ElButton from 'element-ui/packages/button';
import ElInput from 'element-ui/packages/input';
import { TypeOf } from 'element-ui/src/utils/funcs';

const loopFn = function(){};

export default{
  name:'ButtonInput',
  components:{
    ElInput,
    ElButton
  },         
  props:{
    value: [String, Number],
    placeholder: String,
    size: String,
    readonly: Boolean,
    autofocus: Boolean,
    icon: String,
    disabled: Boolean,
    disInput: Boolean,
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
    btnIcon: {
      type:String,
      default: 'el-icon-circle-plus'
    },
    btnClick: {
      type: Function,
      default(){
        return loopFn;
      }
    },
    formatter: Function,
    index: [String, Number],
    store: Object,
    row: Object,
    column: Object
  },
  data(){
    return{
      currentValue: this.value,
      currentLabel: ''
    };
  },
  watch:{
    value(val, old){
        this.setCurrentValue(val);
    },
    currentValue(n, o){
      if(n !== o){
        if(TypeOf(this.formatter) === 'Function'){
          this.currentLabel = this.formatter(this.row, this.column);
        }else{
          this.currentLabel = n;
        }
        this.$emit('input', n);
        this.$emit('change', n);
      }
    }
  },
  computed:{
    disabledInput() {
      if(this.disabled){
        return this.disabled;
      }else{
        return this.disInput;
      }
    },
    currentDisplay:{
      get(){
        return this.currentLabel;
      },
      set(val){
        if(val != this.currentLabel){
          this.currentLabel = val;
          this.currentValue = val;
        }
      }
    }
  },
  methods:{
    iconButtonClick(){
      this.btnClick.call(null, this.row, this.column.property, this.store);
    },
    setCurrentValue(value) {
      if (value === this.currentValue) return;
      this.currentValue = value;
    }
  },
  mounted(){
    if(this.formatter){
      this.currentLabel = this.formatter(this.row, this.column);
    }else{
      this.currentLabel = this.currentValue;
    }
  }
};
</script>