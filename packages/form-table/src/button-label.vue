<template>
  <div class="button-label">
    <div class="lbl-txt">
    <el-tooltip :disabled="innerTipDisabled" :content="tipContent" placement="bottom" effect="light" defree>
      <span class="label-ctx" v-if="isFormatter" v-text="currentLabel"></span>
      <dict-label 
        v-else
        v-model="currentValue" 
        :width="width"
        :dict-id="dictId"
        :dict-params="dictParams"
        :dict-filter="dictFilter"
        :label-changed="labelChanged">
      </dict-label>
    </el-tooltip>
    </div>
    <el-button :disabled="disabled" :plain="true" type="info" @click="iconButtonClick">
      <i :class="[btnIcon]"></i>
    </el-button>
  </div>
</template>
<script>
import ElTooltip from 'element-ui/packages/tooltip';
import ElButton from 'element-ui/packages/button';
import DictLabel from 'element-ui/packages/dict-label';
import { TypeOf } from 'element-ui/src/utils/funcs';
const loopFn = () => { };

export default {
  name: 'ButtonLabel',
  components: {
    ElTooltip,
    ElButton,
    DictLabel
  },
  props: {
    value: [String, Number],
    disabled: Boolean,
    btnIcon: {
      type: String,
      default: 'el-icon-plus'
    },
    btnClicked: {
      type: Function,
      default() {
        return loopFn;
      }
    },
    //扩展参数，字典ID
    dictId: String,
    //扩展参数，下拉框参数
    dictParams: Object,
    //扩展参数，下拉框大数据过滤（机构等大数据量下拉框翻译时使用，只翻译table中已加载的那部分code）
    dictFilter: {
      type: Boolean,
      default: false
    },
    tipDisabled: {             // 默认不禁用显示tooltip
      type: Boolean,
      default: false
    },
    width: String,
    formatter: Function,
    index: [String, Number],
    store: Object,
    row: Object,
    column: Object
  },
  data() {
    return {
      tipContent: '',            // tooltip内容
      innerTipDisabled: true,    // 默认禁用 tooltip功能
      currentValue: '',
      currentLabel: ''
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.setCurrentValue(String(val));
      }
    },
    currentValue(n, o) {
      if (n !== o) {
        if (this.isFormatter) {
          this.currentLabel = this.formatter(this.row, this.column);
        }
        this.$emit('input', n);
        this.$emit('change', n);
      }
    },
    currentLabel(n, o) {
      this.$nextTick(function () {
        if (!this.tipDisabled) {
          this.tipContent = String(n);
          this.innerTipDisabled = this.getTipStatus(this.$el.querySelector('.label-ctx'), this.tipContent);
        }
      });
    }
  },
  computed: {
    isFormatter() {
      return TypeOf(this.formatter) === 'Function';
    }
  },
  methods: {
    labelChanged(text) {
      this.currentLabel = text;
    },
    getTipStatus(el, wd) {  // 获取tip动态配置
      if (!el || !wd) return true;
      let CSet = el.getBoundingClientRect();
      let fz = Number(getComputedStyle(el).fontSize.replace('px', ''));
      let cn = String(wd).match(/\W/g);
      let cnLen = cn ? cn.length : 0;
      let enLen = cn ? wd.length - cnLen : wd.length;
      if ((fz * enLen * 66 / 100 + fz * cnLen * 120 / 100) > (CSet.width + 20)) {
        return false;
      } else {
        return true;
      }
    },
    iconButtonClick() {
      this.btnClicked.call(null, this.row, this.column.property, this.store);
    },
    setCurrentValue(value) {
      if (value === this.currentValue) return;
      this.currentValue = value;
    }
  },
  mounted() {
    if (this.isFormatter) {
      this.currentLabel = this.formatter(this.row, this.column);
    }
    if (this.value) {
      this.currentValue = String(this.value);
    }
  }
};
</script>