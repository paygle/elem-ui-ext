<template>
  <div class="address-chooser" :style="{ minWidth: minWidth }">
    <ul class="address-tabs">
      <li :class="['tab', 'el-icon-arrow-down',{active:isActiveProvince}]" @click.stop="tabProvince" v-text="provinceWord" v-show="isShowProvince"></li>
      <li :class="['tab', 'el-icon-arrow-down',{active:isActiveCity}]" @click.stop="tabCity" v-text="cityWord" v-show="isShowCity"></li>
      <li :class="['tab', 'el-icon-arrow-down',{active:isActiveArea}]" @click.stop="tabArea" v-text="areaWord" v-show="isShowArea"></li>
    </ul>
    <div class="address-contents">
      <ul class="address-province" v-show="isActiveProvince">
        <li v-for="(item, index) in provinceData" 
          :key="index"
          @click.stop="clickProvince(item.c_area_code)" 
          v-text="item.c_area_cname">
        </li>
      </ul>
      <ul class="address-city" v-show="isActiveCity">
        <li v-for="(item, index) in cityData"
          :key="index" 
          @click.stop="clickCity(item.c_area_code)" 
          v-text="item.c_area_cname">
        </li>
      </ul>
      <ul class="address-area" v-if="!cityEnd" v-show="isActiveArea">
        <li v-for="(item, index) in areaData" 
          :key="index"
          @click.stop="clickArea(item.c_area_code)" 
          v-text="item.c_area_cname">
        </li>
      </ul>
    </div>
    <span class="close el-icon-close" @click.stop="handleClose"></span>
  </div>
</template>
<script>
// 地址弹出选择窗口
import Popper from 'element-ui/src/utils/vue-popper';
import Emitter from 'element-ui/src/mixins/emitter';

export default {
  name: 'address-pop',
  componentName: 'AddressPop',
  mixins: [Popper, Emitter],
  props: {
    value: {},            //省市县数值
    disabled: Boolean,
    cityEnd: Boolean,
    addrData: {            //省市县全部数据
      type: Array,
      default: function () {
        return [];
      }
    },
    placement: {
      default: 'bottom-start'
    },
    boundariesPadding: {
      default: 0
    },
    options: {
      default() {
        return {
          forceAbsolute: true,
          gpuAcceleration: false
        };
      }
    }
  },
  data() {
    return {
      province: -1,
      city: -1,
      area: -1,
      provinceWord: '请选择',
      cityWord: '请选择',
      areaWord: '请选择',
      provinceData: null,
      cityData: null,
      areaData: null,
      addressLabel: '',
      addressValue: '',
      isShowProvince: true,
      isShowCity: false,
      isShowArea: false,
      dataIsReady: false,
      minWidth: ''
    };
  },
  methods: {
    handleClose(e) {
      this.dispatch('AddressBox', 'handleClose', this);
    },
    tabProvince() {
      this.isShowArea = false;
      this.isShowCity = false;
      this.city = -1;
      this.area = -1;
      this.areaWord = this.cityWord = this.provinceWord = '请选择';
    },
    tabCity() {
      this.isShowArea = false;
      this.isShowCity = true;
      this.area = -1;
      this.areaWord = this.cityWord = '请选择';
    },
    tabArea() {
      this.areaWord = '请选择';
    },
    clickProvince(code) {
      let data = this.addrData;
      if (data) {
        for (let item of data) {
          if (item.c_area_code == code) {
            this.provinceWord = item.c_area_cname;
            this.province = code;
            if (item.sub && item.sub.length > 0) {
              this.cityData = item.sub;
              this.isShowCity = true;
            } else {
              this.cityData = null;
            }
            break;
          }
        }
      }
    },
    clickCity(code) {
      let data = this.cityData;
      if (data) {
        for (let item of data) {
          if (item.c_area_code == code) {
            this.cityWord = item.c_area_cname;
            this.city = code;
            if (item.sub && item.sub.length > 0) {
              this.areaData = item.sub;
              this.isShowArea = true;
            } else {
              this.areaData = null;
            }
            // 到市级获取值
            if (this.cityEnd) {
              this.addressValue = this.province + '-' + this.city;
              this.addressLabel = this.provinceWord + '-' + this.cityWord;
              this.handleClose();
              this.dispatch('AddressBox', 'valueChange', { value: this.addressValue, label: this.addressLabel });
            }
            break;
          }
        }
      }
    },
    clickArea(code) {
      let data = this.areaData;
      if (data) {
        for (let item of data) {
          if (item.c_area_code == code) {
            this.areaWord = item.c_area_cname;
            this.area = code;
            this.addressValue = this.province + '-' + this.city + '-' + this.area;
            this.addressLabel = this.provinceWord + '-' + this.cityWord + '-' + this.areaWord;
            this.handleClose();
            this.dispatch('AddressBox', 'valueChange', { value: this.addressValue, label: this.addressLabel });
            break;
          }
        }
      }
    },
    reset() {
      this.province = -1;
      this.city = -1;
      this.area = -1;
      this.provinceWord = '请选择';
      this.cityWord = '请选择';
      this.areaWord = '请选择';
      this.provinceData = null;
      this.cityData = null;
      this.areaData = null;
      this.addressLabel = '';
      this.addressValue = '';
      this.isShowProvince = true;
      this.isShowCity = false;
      this.isShowArea = false;
    }
  },
  watch: {
    addrData(val) {
      if (Object.prototype.toString.call(val) === '[object Array]' && val.length > 0) {
        this.provinceData = val;
      }
    },
    '$parent.inputWidth'() {
      this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';
    }
  },
  computed: {
    isActiveProvince() {
      return this.isShowCity ? !this.isShowCity : this.isShowProvince;
    },
    isActiveCity() {
      return this.isShowArea ? !this.isShowArea : this.isShowCity;
    },
    isActiveArea() {
      return this.isShowArea;
    }
  },
  mounted() {
    this.referenceElm = this.$parent.$refs.reference;
    this.$parent.popperElm = this.popperElm = this.$el;
    this.$on('updatePopper', this.updatePopper);
    this.$on('destroyPopper', this.destroyPopper);
    this.$on('reset', this.reset);
  }
};
</script>