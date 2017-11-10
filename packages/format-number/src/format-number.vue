<template>
  <div class="format-number">
    <el-input 
      v-model="formatValue"
      ref="inputel"
      type="text"
      @blur="blurChange"
      :name="name"
      :placeholder="placeholder"
      :validate-event="false"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :minlength="minlength"
      :auto-complete="autoComplete"
      :autofocus="autofocus"
      :parent-value="currentValue"
      :get-fill-styl="getFillStyl"
      :form="form" delayed>
    </el-input>
  </div>
</template>
<script>
import ElInput from 'element-ui/packages/input';
import emitter from 'element-ui/src/mixins/emitter';

export default {
  name: 'FormatNumber',
  componentName: 'FormatNumber',
  components: {
    ElInput
  },
  mixins: [emitter],
  props: {
    validItemName: {     // 使用 valid-item组件时的组件名称
      type: String,
      default: 'ValidItem'
    },
    value: { // 格式转换数字最大位数不能超过16位
      type: [String, Number],
      default: '0'
    },
    getFillStyl: Function,     // 获取自定义组件配色
    isEmpty: Boolean,    // 默认是否可以为空
    placeholder: String,
    readonly: Boolean,
    autofocus: Boolean,
    disabled: Boolean,
    name: String,
    autoComplete: {
      type: String,
      default: 'off'
    },
    form: String,
    maxlength: Number,
    minlength: Number,
    validateEvent: {
      type: Boolean,
      default: true
    },
    max: Number,                // 最大值
    min: Number,                // 最小值
    split: {                // 分隔位数
      type: [Number, String],
      default: 3
    },
    splitMark: {            // 分隔符号
      type: String,
      default: ','
    },
    precision: {            // 精度
      type: [Number, String],
      default: 2
    }
  },
  data() {
    return {
      formatValue: ''
    };
  },
  watch: {

    value(val, old) {
      // 是否允许为空
      if (this.hasEmpty(val)) {
        this.$emit('input', 0);
      } else {
        if (val !== old) {
          this.formatValue = this.getFormatVal(val);
        }
        this.$nextTick(function () {
          this.dispatch('ElForm', 'compare-change', this);
          this.dispatch(this.validItemName, 'compare-change', this);
          if (!isNaN(this.max) && typeof this.max !== 'undefined' && this.value > this.max) {
            this.emitValue(this.max);
          }

          if (!isNaN(this.min) && typeof this.min !== 'undefined' && this.value < this.min) {
            this.emitValue(this.min);
          }
        });
      }
    }
  },

  computed: {
    formatRegx() {
      return '^\\-?[\\d\\' + this.splitMark + ']*(\\.?\\d*)$';
    },
    currentValue() {
      return this.getValue(this.formatValue);
    }
  },

  methods: {
    // 验证格式是否符合要求
    validFormat(formatVal) {
      if (new RegExp(this.formatRegx, 'g').test(formatVal)) {
        let integer, decimal, short;
        let splitVal = String(formatVal).split('.');

        if (splitVal.length == 2) {
          integer = splitVal[0] || 0;
          decimal = splitVal[1];
        } else {
          integer = splitVal[0];
        }

        if (integer && integer.length && integer !== '') {
          short = integer.split(this.splitMark).reverse();
          for (let i = 0; i < short.length; i++) {
            if (i < short.length - 1 && short[i].length !== this.split) {
              return false;
            } else if (short[i].length > this.split && (String(short[i]).replace(/^\-/g, '')).length !== this.split) {
              return false;
            }
          }
        }

        if (decimal && decimal !== '' && decimal.length > this.precision) {
          return false;
        }

      } else {
        return false;
      }

      return true;
    },

    // 从 12345678.12 -> 12,345,678.12
    getFormatVal(value) {
      value = typeof value === 'undefined' ? String(this.value)
        : String(value).replace(new RegExp(this.splitMark, 'g'), '');

      if (!isNaN(value) && value !== '' && !/e/g.test(value)) {
        let integer, decimal, minus = '';
        let splitVal, integerArray = [];

        if(/^\-/g.test(value)){
          value = value.replace(/^\-/g, '');
          minus = '-';
        }
        
        splitVal = String(this.setPrecision(value)).split('.');

        if (splitVal.length >= 2) {
          integer = splitVal[0] || 0;
          decimal = splitVal[1];
        } else {
          integer = splitVal[0];
        }

        if (integer && integer.length) {
          let len = integer.length;
          let i = len, tmps = '', end;
          let span = this.split;

          for (; i >= 0;) {
            end = i - span;
            tmps = integer.substring(i, end);
            if (tmps !== '' && tmps.length === span) {
              integerArray.push(tmps);
            } else if (i < span && tmps !== '') {
              integerArray.push(integer.substring(i, 0));
            }
            i = i - span;
          }
        }
        if (decimal && decimal.length) {
          return minus + integerArray.reverse().join(this.splitMark) + '.' + decimal;
        }
        return minus + integerArray.reverse().join(this.splitMark);
      } else if (this.hasEmpty(value)) {
        this.$emit('input', 0);
      }
      return value;
    },

    setPrecision(value, bit) {
      let numStr, num = null, mbit = bit || this.precision;
      numStr = String(value).split('.');
      if (numStr.length === 2 && String(numStr[1]).length > mbit) {
        numStr[1] = String(numStr[1]).substr(0, mbit);
        num = numStr.join('.');
      }
      return (num === null || isNaN(num)) ? value : Number(num);
    },

    // 从 12,345,678.12 -> 12345678.12
    getValue(value) {
      value = typeof value === 'undefined' ? this.formatValue : value;
      if (value && value !== '' && new RegExp(this.formatRegx, 'g').test(value)) {
        value = String(value).replace(new RegExp(this.splitMark, 'g'), '');
        return this.setPrecision(value);
      }

      // 是否允许为空
      if (this.hasEmpty(value)) {
        return 0;
      } else {
        return value;
      }
    },

    emitValue(value) {
      this.$emit('input', value);
      this.$emit('change', value);
      if (this.validateEvent) {
        // 验证 valid-item 组件
        this.dispatch(this.validItemName, 'valid.item.blur');
        this.dispatch('ElFormItem', 'el.form.blur');
        this.$nextTick(()=>{
          this.dispatch('ElForm', 'compare-change', this);
          this.dispatch(this.validItemName, 'compare-change', this);
        });
      }
    },

    blurChange(e) {
      this.$nextTick(function () {
        let value = String(this.getValue());
        value = (!isNaN(value) && value !== '') ? Number(value) : '';
        this.emitValue(value);
        if (value == 0) this.formatValue = 0;
      });
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
    this.formatValue = this.getFormatVal();
    this.$nextTick(()=>{
      this.dispatch('ElForm', 'compare-change', this);
      this.dispatch(this.validItemName, 'compare-change', this);
    });
  }
};
</script>
