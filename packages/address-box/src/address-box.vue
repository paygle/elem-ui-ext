<template>
<div class="address-box" v-clickoutside="handleClose">
  <div class="addrbox">
    <i class="el-input__icon el-icon-caret-top" v-show="!translated" @click="handleOpenBox"></i>
    <input type="text" class="txt-box" :class="inputStyle"  v-show="!translated"
      ref="reference"
      v-model="addressLabel"
      :disabled="disabled"
      :style="customCrtStyl"
      @mouseover="inputMSEnter"
      @mouseout="inputMSOut"
      @focus="handleOpenBox"
      @blur="handleBlur"
      :placeholder="placeholder"
      readonly>
    <span class="txt-box" v-if="translated" v-text="addressLabel"></span>
  </div>
  <transition name="md-fade-bottom" @after-leave="doDestroy">
    <address-pop
      ref="popper"
      :city-end="cityEnd"
      :addr-data="addrData"
      v-show="isShowAddrBox"
      :disabled="readonly || disabled">
    </address-pop>
  </transition>
</div>
</template>
<script>
// 地址选择组件
import AddressPop from './address-pop';
import { t } from 'element-ui/src/locale';
import Emitter from 'element-ui/src/mixins/emitter';
import Clickoutside from 'element-ui/src/utils/clickoutside';
import { addClass, removeClass } from 'element-ui/src/utils/dom';
import { TypeOf, createDomElement, getLocalDataItem, setLocalDataItem, isOwnEmpty } from 'element-ui/src/utils/funcs';

const $ = window.$ || window.jQuery || console && console.warn('Need jQuery lib pre.'); // 引入jQuery

const ADDRESS_DATA_URL = window.COMPONENTS_CONFIG ? window.COMPONENTS_CONFIG.ADDRESS_DATA_URL : '';

const getAddressData = function () {
  let _this = this;
  let localData = _this.addrData || getLocalDataItem('address', 'addressStore') || [];
  let usedata = localData.length > 0 ? localData : _this.resdata;

  if (usedata.length > 0) {
    _this.initAddress(usedata);
    _this.addrData = usedata;
  } else {
    $.getJSON(_this.dataUrl, function (data) {
      _this.addrData = data;
      setLocalDataItem('address', data, 'addressStore');
      _this.initAddress(data);
    });
  }
};

export default {
  name: 'AddressBox',
  componentName: 'AddressBox',
  directives: {
    Clickoutside
  },
  components: {
    AddressPop
  },
  mixins: [Emitter],
  props: {
    readonly: Boolean,
    validItemName: {     // 使用 valid-item组件时的组件名称
      type: String,
      default: 'ValidItem'
    },
    getFillStyl: Function,         // 获取自定义组件配色
    tipDisabled: {             // 默认不禁用显示tooltip
      type: Boolean,
      default: false
    },
    dataUrl: {
      type: String,  //数据请求URL
      default() {
        return ADDRESS_DATA_URL;
      }
    },
    translated: Boolean,  // 是否翻译省市县代码为中文
    value: {},            // 省市县数值
    disabled: Boolean,
    resdata: {             // 省市县全部数据
      type: Array,
      default() {
        return [];
      }
    },
    cityEnd: {           // 是否选择到市级取值
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default() {
        return t('el.select.placeholder');
      }
    },
    params: null         // 自定义参数
  },
  data() {
    return {
      customStyl: '',            // 自定义样式
      tipContent: '',            // tooltip内容
      tipTimeHander: null,
      innerTipShow: false,      // 默认禁用 tooltip功能
      notifyWidth: 0,
      noticeDom: null,
      addrData: null,
      provinceWord: '',
      cityWord: '',
      areaWord: '',
      addressLabel: '',
      addressValue: '',
      isShowAddrBox: false,
      dataIsReady: false,
      inputLength: 20,
      inputWidth: 0
    };
  },
  methods: {
    // 独立样式设置
    customfillStyl(value) {
      if (typeof this.getFillStyl === 'function') {
        let val = typeof this.parentValue !== 'undefined' ? this.parentValue : value;
        this.customSfStyl = this.getFillStyl.call(null, val);
      }
    },
    // 设置错误样式
    setCustomStyle(styl) {
      this.customStyl = styl;
    },
    inputMSEnter(e) {
      getAddressData.call(this); // 如果未加载数据再次载入数据
      let pos, gapw, style;
      let inputEl = this.$el.querySelector('input');
      let inputWidth = this.getPlaceWidth(inputEl);
      this.notifyWidth = this.getTipContentWidth(inputEl, this.tipContent);

      if(this.innerTipShow){
        this.tipTimeHander = setTimeout(()=>{
          pos = inputEl.getBoundingClientRect();
          gapw = this.notifyWidth > 0 ? (this.notifyWidth - inputWidth)/2 : 0;
          style = `left:${pos.left - gapw}px; top: ${pos.top - 38}px; z-index: 99; position: fixed`;
          this.noticeDom = createDomElement('div', {class:"itxt-notify-popw", style: style});
          this.noticeDom.innerHTML = this.tipContent;
          document.body.appendChild(this.noticeDom);
        });
      }
    },
    inputMSOut(e) {
      clearTimeout(this.tipTimeHander);
      let delDoms = document.querySelectorAll('.itxt-notify-popw');
      if(delDoms.length && this.noticeDom) {
        for(let i=0; i<delDoms.length; i++){
          document.body.removeChild(delDoms[i]);
        }
        this.noticeDom = null;
      }
    },
    getPlaceWidth(el){  // 计算组件除padding的宽度
      let elStyl, paddingLeft, paddingRight;
      if(el) {
        elStyl = getComputedStyle(el);
        paddingLeft =  parseInt(elStyl.paddingLeft.replace('px',''), 10);
        paddingRight =  parseInt(elStyl.paddingRight.replace('px',''), 10);
        return el.getBoundingClientRect().width - paddingLeft - paddingRight;
      }else{
        return 0;
      }
    },
    getTipContentWidth(el, text){ // 计算文本宽度
      let elStyl, fontSize,  zhword, zhWidth;
      text = text || '';
      elStyl = getComputedStyle(el);
      fontSize = parseInt(elStyl.fontSize.replace('px',''), 10);
      zhword = String(text).replace(/[0-9A-Za-z\-\:]/ig, '');
      zhWidth = zhword.length * fontSize;
      return (String(text).length - zhword.length) * fontSize * 0.5 + zhWidth;
    },
    tipUpdateStatus() {  // 获取tip动态配置
      this.$nextTick(function () {
        if (!this.tipDisabled) {
          let width, contentWidth;
          let el = this.$el.querySelector('.txt-box');
          this.tipContent = String(this.addressLabel);

          if(el){
            width = this.getPlaceWidth(el);
            contentWidth = this.getTipContentWidth(el, this.tipContent);
            if(contentWidth > width){
              this.innerTipShow =  true;
            }else{
              this.innerTipShow =  false;
            }
          }else{
            this.innerTipShow =  false;
          }
        }
      });
    },
    initAddress(data) {
      let addr = String(this.value).split('-');
      this.dataIsReady = true;

      if (addr.length > 1) {
        let province = addr[0];
        let city = addr[1];
        let area = addr[2];

        if (data && typeof province !== 'undefined') {
          this.provinceData = data;
          this.isShowProvince = true;
          for (let item of data) { // 省
            if (item.c_area_code == province) {
              this.provinceWord = item.c_area_cname;
              //this.province = item.c_area_code;
              if (item.sub && item.sub.length > 0 && typeof city !== 'undefined') {

                this.cityData = item.sub;
                this.isShowCity = true;
                for (let subitem of item.sub) {  // 市
                  if (subitem.c_area_code == city) {
                    this.cityWord = subitem.c_area_cname;
                    this.addressLabel = this.provinceWord + '-' + this.cityWord;
                    // this.city = subitem.c_area_code;
                    if (subitem.sub && subitem.sub.length > 0 && typeof area !== 'undefined') {

                      this.areaData = subitem.sub;
                      this.isShowArea = true;
                      for (let ssub of subitem.sub) {  // 区
                        if (ssub.c_area_code == area) {
                          this.areaWord = ssub.c_area_cname;
                          //this.area = subitem.c_area_code;
                          this.addressLabel = this.provinceWord + '-' + this.cityWord + '-' + this.areaWord;
                          break;
                        }
                      }
                    }
                    break;
                  }
                }
              }
              break;
            }
          }
        }

      }

    },
    handleOpenBox(e) {
      if (!this.disabled && !this.readonly) {
        this.isShowAddrBox = true;
      }
    },
    handleClose(e) {
      this.isShowAddrBox = false;
    },
    valueChange(args) {
      this.addressLabel = args.label;
      this.addressValue = args.value;
    },
    doDestroy() {
      if (this.$refs.popper) {
        this.$refs.popper.doDestroy();
      }
    },
    handleBlur(e) {
      // 验证 valid-item 组件
      console.log('Address blur');
      this.dispatch('ElFormItem', 'el.form.blur', this.value);
      this.dispatch(this.validItemName, 'valid.item.blur', this.value);
      this.dispatch('ElForm', 'compare-change', this);
      this.dispatch(this.validItemName, 'compare-change', this);
    }
  },
  computed: {
    inputStyle() {
      let s = 'place-text el-input__inner';
      if (this.disabled || this.readonly) {
        s += ' is-disabled';
      }
      return s;
    },
    customCrtStyl() {
      if (typeof this.customStyl === 'object' && !isOwnEmpty(this.customStyl)) {
        return this.customStyl;
      } else if (typeof this.customSfStyl === 'object' && !isOwnEmpty(this.customSfStyl)) {
        return this.customSfStyl;
      }
      return {};
    }
  },
  watch: {

    value(val, old) {
      this.broadcast('AddressPop', 'reset');
      if (TypeOf(val) === 'String' && val && val !== old) {
        getAddressData.call(this);
      } else {
        this.addressLabel = '';
        this.addressValue = '';
        this.provinceWord = '';
        this.cityWord = '';
        this.areaWord = '';
      }
    },
    addressValue(val) {
      this.$emit('input', val);
      this.$emit('change', val);
      this.dispatch('ElFormItem', 'el.form.change', val);
      this.dispatch(this.validItemName, 'valid.item.change', val);
      this.dispatch('ElForm', 'compare-change', this);
      this.dispatch(this.validItemName, 'compare-change', this);
      this.$nextTick(()=>{
        this.customfillStyl(this.value);
      });
    },
    addressLabel(val) {
      let addr = TypeOf(this.addressLabel) === 'String' ? this.addressLabel.split('-') : [];
      let code = TypeOf(this.addressValue) === 'String' ? this.addressValue.split('-') : [];
      if (addr.length > 1) {
        this.$emit('address-change', { cn: addr, code: code, param: this.params });
      }
      this.tipUpdateStatus();
    },
    isShowAddrBox(isShow) {
      if (isShow) {
        this.broadcast('AddressPop', 'updatePopper');
        addClass(this.$el.querySelector('.el-input__icon'), 'is-reverse');
      } else {
        this.broadcast('AddressPop', 'destroyPopper');
        removeClass(this.$el.querySelector('.el-input__icon'), 'is-reverse');
      }
    }
  },
  beforeDestroy() {
    this.doDestroy();
  },
  created() {
    this.$on('handleClose', this.handleClose);
    this.$on('valueChange', this.valueChange);
    this.$on('custom-style', this.setCustomStyle);
  },
  mounted() {
    getAddressData.call(this);
    this.tipUpdateStatus();
    this.$nextTick(() => {
      this.dispatch('ElForm', 'compare-change', this);
      this.dispatch(this.validItemName, 'compare-change', this);
    });
  }
};
</script>
