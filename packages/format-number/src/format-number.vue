<template>
  <div class="format-number">
    <el-input 
      v-model="formatValue"
      ref="inputel"
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
    value: { // 格式转换数字最大位数不能超过16位
      type: [String, Number],
      default: ''
    },
    placeholder: String,
    readonly: Boolean,
    autofocus: Boolean,
    disabled: Boolean,
    type: {
      type: String,
      default: 'text'
    },
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
      if (val !== old) {
        this.formatValue = this.getFormatVal(val);
      }
      this.$nextTick(function () {
        if (!isNaN(this.max) && typeof this.max !== 'undefined' && this.value > this.max) {
          this.emitValue(this.max);
        }

        if (!isNaN(this.min) && typeof this.min !== 'undefined' && this.value < this.min) {
          this.emitValue(this.min);
        }
      });
    },

    formatValue(n, o) {
      if (n !== o) {
        if (!new RegExp(this.formatRegx, 'g').test(n)) {
          this.formatValue = o;
          this.inputEl.value = o;
        } else if (!this.validFormat(n)) {
          this.formatValue = this.getFormatVal(n);
          this.inputEl.value = this.formatValue;
        }
      }
    }

  },

  computed: {
    inputEl() {
      return this.$refs.inputel.$el.querySelector('input');
    },
    formatRegx() {
      return '^[\\d\\" + this.splitMark + "]*(\\.?\\d*)$';
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
            } else if (short[i].length > this.split) {
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
        let integer, decimal;
        let integerArray = [];
        let splitVal = String(this.setPrecision(value)).split('.');

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
          return integerArray.reverse().join(this.splitMark) + '.' + decimal;
        }
        return integerArray.reverse().join(this.splitMark);
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
      return value;
    },

    emitValue(value) {
      this.$emit('input', value);
      this.$emit('change', value);
      if (this.validateEvent) {
        // 验证 valid-item 组件
        this.dispatch(this.validItemName, 'valid.item.blur');
        this.dispatch('ElFormItem', 'el.form.blur');
      }
    },

    blurChange(e) {
      this.$nextTick(function () {
        let value = String(this.getValue());
        value = (!isNaN(value) && value !== '') ? Number(value) : '';
        this.emitValue(value);
      });
    }

  },

  mounted() {
    this.formatValue = this.getFormatVal();
  }
};

</script>
