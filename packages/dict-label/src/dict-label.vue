<template>
  <div class="dict-label" :class="{'is-border': borderShow}" :style="{width:width}">
    <input 
      type="text"
      readonly
      v-if="borderShow"  
      :placeholder="placeholder" 
      :value="dictText"
      v-on:keydown.stop.prevent="doNot">
    <span v-else  class="label-ctx" v-text="dictText"></span>
    <i v-if="clearable && borderShow" 
      v-show="clearShow" 
      class="clear el-icon-circ-cross"
      @click="clearContent">
    </i>
  </div>
</template>
<script>
import objectAssign from 'element-ui/src/utils/merge';
import * as cacheUtil from 'element-ui/src/utils/cache-util';

export default {
  name: 'DictLabel',
  props: {
    value: String,
    //扩展参数，字典ID
    dictId: String,
    //扩展参数，下拉框参数
    dictParams: Object,
    //扩展参数，下拉框大数据过滤（机构等大数据量下拉框翻译时使用，只翻译table中已加载的那部分code）
    dictFilter: {
      type: Boolean,
      default: false
    },
    //扩展参数，是否强制刷新，true表示都从后台刷新下拉数据，默认为false
    forceRefresh: {
      type: Boolean,
      default: false
    },
    labelChanged: Function,   // 文本更新通知
    placeholder: String,       // 占位文本
    display: {               // 显示模式 default/ border
      type: String,
      default: 'default'
    },
    width: String,           // 
    clearable: Boolean       // 是否显示清除
  },
  data() {
    return {
      loading: false,
      dictText: '',
      comboItems: [],
      realParams: {} //下拉框参数
    };
  },

  watch: {
    value(val, oldVal) {
      if (val != oldVal && val) {
        this.loading = true;
      } else if (!val) { //代码值为空时，将文本置空
        this.dictText = '';
      }
    },
    loading(val, oldVal) {
      if (val === true) {
        this.loadRemoteData();
      }
    },
    dictText(val) {
      if (this.labelChanged) { // 通知变更
        this.labelChanged(val);
      }
    }
  },

  computed: {
    clearShow() {
      return this.value !== '';
    },
    borderShow() {
      return this.display == 'border';
    }
  },

  methods: {
    clearContent() {

      this.$emit('input', '');
      this.dictText = "";
    },
    doNot(e) { },
    //加载远程数据
    loadRemoteData() {
      var self = this;
      if (this.dictFilter) { //大数据量的翻译
        var text = cacheUtil.getDictText(this.dictId, this.value);
        if (text) {
          this.dictText = text;
          return;
        }
      }
      var data = this.$store.state.dictStore.dict[this.dictId];
      if (data && data.length > 0  && !this.forceRefresh && JSON.stringify(this.dictParams)=='{}') {
        this.comboItems = data;
        this.computedDictText();
      } else { //缓存中没有数据时
        let dictParams = objectAssign({}, this.dictParams);
        if (this.dictFilter) {
          dictParams = objectAssign(dictParams, { 'filter_codes': [this.value] });
        }
        this.$store.dispatch('loadDict', {
          dictId: this.dictId,
          dictParams: dictParams,
          dictFilter: this.dictFilter,
          cacheable: true,
          successCallback: function (payload) {
            self.loading = false;
            if (!self.dictFilter) {
              self.comboItems = payload.dictData;
            }
            self.computedDictText();
          },
          errorCallback: function () {
            self.loading = false;
          }
        });
      }
    },
    computedDictText() {
      if (this.dictFilter) { //大数据量的翻译
        var text = cacheUtil.getDictText(this.dictId, this.value);
        if (text) {
          this.dictText = text;
          return;
        }
      }
      if (this.value && this.comboItems && this.comboItems.length > 0) {
        for (var i = 0; i < this.comboItems.length; i++) {
          if (this.comboItems[i].c_code == this.value) {
            this.dictText = this.comboItems[i].c_cname;
            return;
          }
        }
      } else {
        this.dictText = this.value;
      }
    }
  },

  mounted() {
    //如果dictId不为空，则加载已有的下拉框数据
    if (this.dictId) {
      if (this.dictFilter) { //大数据量的翻译
        var text = cacheUtil.getDictText(this.dictId, this.value);
        if (text) {
          this.dictText = text;
          return;
        }
      }
      var data = this.$store.state.dictStore.dict[this.dictId];
      if (data && data.length > 0 && JSON.stringify(this.dictParams)=='{}') {
         //当参数为空时才从store加载，防止相同dictId不同参数的下拉框翻译出问题
        this.comboItems = data;
        this.computedDictText();
      } else { //缓存中没有数据时
        if (this.value && this.value.length > 0) { //有默认值时立即加载后台数据
          this.loading = true;
        }
      }
    }
  }
};
</script>