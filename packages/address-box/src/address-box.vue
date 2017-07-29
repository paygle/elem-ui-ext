<template>
<div class="address-box" v-clickoutside="handleClose">
  <div class="addrbox">
    <i class="el-input__icon el-icon-caret-top" v-show="!translated" @click="handleOpenBox"></i>
    <input type="text" class="txt-box" :class="inputStyle"  v-show="!translated"
      ref="reference"
      v-model="addressLabel"
      :disabled="disabled"
      @mouseover="inputMSEnter"
      @mouseout="inputMSOut"
      @focus="handleOpenBox"
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
      disabled="disabled">
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
import { TypeOf, createDomElement, getLocalDataItem, setLocalDataItem } from 'element-ui/src/utils/funcs';

const $ = window.$ || window.jQuery || {};  // 模拟引入jQuery

const ADDRESS_DATA_URL = window.ComponentsConfig ? window.ComponentsConfig.ADDRESS_DATA_URL : '';

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
    translated: {   // 是否翻译省市县代码为中文
      type: [Boolean, String],
      default() {
        return false;
      }
    },
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
    inputMSEnter(e) {
      getAddressData.call(this); // 如果未加载数据再次载入数据
      if (this.innerTipShow) {
        this.tipTimeHander = setTimeout(() => {
          let pos = this.$el.parentElement.getBoundingClientRect();
          let gapw = this.notifyWidth > 0 ? (this.notifyWidth - pos.width) / 2 : 0;
          let style = `left:${pos.left - gapw}px; top: ${pos.top - 38}px; z-index: 99; position: fixed`;
          this.noticeDom = createDomElement('div', { class: 'itxt-notify-popw', style: style });
          this.noticeDom.innerHTML = this.tipContent;
          document.body.appendChild(this.noticeDom);
        });
      }
    },
    inputMSOut(e) {
      clearTimeout(this.tipTimeHander);
      $(this.noticeDom).remove();
    },
    tipUpdateStatus() {  // 获取tip动态配置
      this.$nextTick(function () {
        if (!this.tipDisabled) {
          let el = this.$el.querySelector('.txt-box');
          this.tipContent = String(this.addressLabel);
          if (el && el.scrollWidth > el.offsetWidth) {
            this.innerTipShow = true;
            this.notifyWidth = el.scrollWidth;
          } else {
            this.innerTipShow = false;

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
      if (!this.disabled) {
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
    }
  },
  computed: {
    inputStyle() {
      let s = 'place-text el-input__inner';
      if (this.disabled) {
        s += ' is-disabled';
      }
      return s;
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
  },
  mounted() {
    getAddressData.call(this);
    this.tipUpdateStatus();
  }
};
</script>
