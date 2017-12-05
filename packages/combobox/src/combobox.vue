<template>
  <div
    class="el-select"
    v-clickoutside="handleClose">
    <div
      class="el-select__tags"
      v-if="multiple"
      @click.stop="toggleMenu"
      ref="tags"
      :style="{ 'max-width': inputWidth - 32 + 'px' }">
      <transition-group @after-leave="resetInputHeight">
        <el-tag v-if="!translated"
          v-for="item in selected"
          :key="getValueKey(item)"
          :closable="!disabled || !readonly"
          :hit="item.hitState"
          type="primary"
          @close="deleteTag($event, item)"
          close-transition>
          <span class="el-select__tags-text">{{ item.currentLabel }}</span>
        </el-tag>
      </transition-group>
      <span style="padding:2px;"
        v-if="translated"
        v-for="item in selected">
        {{ item.currentLabel }}
      </span>
      <input v-show="!translated"
        type="text"
        class="el-select__input"
        :class="`is-${ size }`"
        @focus="visible = true"
        :disabled="disabled"
        :readonly="readonly"
        @keyup="managePlaceholder"
        @keydown="resetInputState"
        @keydown.down.prevent="navigateOptions('next')"
        @keydown.up.prevent="navigateOptions('prev')"
        @keydown.enter.prevent="selectOption"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.delete="deletePrevTag"
        v-model="query"
        :debounce="remote || showPager ? 300 : 0"
        v-if="filterable"
        :style="{ width: inputLength + 'px', 'max-width': inputWidth - 42 + 'px' }"
        ref="input">
    </div>
    <span v-if="translated" v-text="selectedLabel"></span>
    <el-input v-show="!translated"
      ref="reference"
      v-model="selectedLabel"
      type="text"
      :parent-value="value"
      :get-fill-styl="getFillStyl"
      :tip-disabled="tipDisabled"
      :placeholder="currentPlaceholder"
      :name="name"
      :size="size"
      :id="id"
      :disabled="disabled"
      :readonly="!filterable || multiple || readonly"
      :validate-event="false"
      @focus="handleFocus"
      @click="handleIconClick"
      @mousedown.native="handleMouseDown"
      @keyup.native="debouncedOnInputChange"
      @keydown.native.down.prevent="navigateOptions('next')"
      @keydown.native.up.prevent="navigateOptions('prev')"
      @keydown.native.enter.prevent="selectOption"
      @keydown.native.esc.stop.prevent="visible = false"
      @keydown.native.tab="visible = false"
      @paste.native="debouncedOnInputChange"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
      :icon="iconClass">
    </el-input>
    <transition
      name="el-zoom-in-top"
      @before-enter="handleMenuEnter"
      @after-leave="doDestroy">
      <el-select-menu
        ref="popper"
        v-show="visible && !translated && !emptyText && !readonly">
        <el-scrollbar
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          :class="{ 'is-empty': !allowCreate && filteredOptionsCount === 0 }"
          v-show="options.length > 0 && !loading">
          <div v-if="dictId">
            <combo-option
              v-for="(item, index) in comboItems"
              v-if="typeof item === 'object'"
              :key="item.c_cod"
              :label="item.c_cname"
              :value="item.c_code">
            </combo-option>
          </div>
          <slot v-else></slot>
        </el-scrollbar>
        <p class="el-select-dropdown__empty" v-if="emptyText && (allowCreate && options.length === 0 || !allowCreate)">{{ emptyText }}</p>

        <el-pagination v-if="showPager"
          layout="total, prev, pager, next"
          :page-size="pageSize"
          :current-page.sync="currentPage"
           @current-change="onPageChange"
          :total="total">
        </el-pagination>

      </el-select-menu>
    </transition>
  </div>
</template>

<script type="text/babel">
  import Emitter from 'element-ui/src/mixins/emitter';
  import Locale from 'element-ui/src/mixins/locale';
  import ElInput from 'element-ui/packages/input';
  import ElSelectMenu from 'element-ui/packages/select/src/select-dropdown.vue';
  import ComboOption from './combo-option.vue';
  import ElTag from 'element-ui/packages/tag';
  import ElScrollbar from 'element-ui/packages/scrollbar';
  import debounce from 'throttle-debounce/debounce';
  import Clickoutside from 'element-ui/src/utils/clickoutside';
  import { addClass, removeClass, hasClass } from 'element-ui/src/utils/dom';
  import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
  import { t } from 'element-ui/src/locale';
  import scrollIntoView from 'element-ui/src/utils/scroll-into-view';
  import { getValueByPath } from 'element-ui/src/utils/util';
  import util from 'element-ui/src/utils/util-ext';
  import ElPagination from 'element-ui/packages/pagination';

  const sizeMap = {
    'large': 42,
    'small': 30,
    'mini': 22
  };

  export default {
    mixins: [Emitter, Locale],

    name: 'combobox',

    componentName: 'Combobox',

    computed: {
      iconClass() {
        let criteria = this.clearable &&
          !this.disabled &&
          !this.readonly &&
          this.inputHovering &&
          !this.multiple &&
          this.value !== undefined &&
          this.value !== '';
        return criteria ? 'circ-cross is-show-close' : (this.remote && this.filterable ? '' : 'caret-top');
      },

      debounce() {
        return this.remote || this.showPager ? 300 : 0;
      },

      emptyText() {
        if (this.loading || this.comboLoading) {
          return this.loadingText || this.t('el.select.loading');
        } else {
          if (this.voidRemoteQuery) {
            this.voidRemoteQuery = false;
            return false;
          }
          if (this.remote && this.query === '' && this.options.length === 0) return false;
          if (this.filterable && this.options.length > 0 && this.filteredOptionsCount === 0) {
            return this.noMatchText || this.t('el.select.noMatch');
          }
          if (this.options.length === 0) {
            return this.noDataText || this.t('el.select.noData');
          }
        }
        return null;
      },

      showNewOption() {
        let hasExistingOption = this.options.filter(option => !option.created)
          .some(option => option.currentLabel === this.query);
        return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption;
      },
      //是否显示分页
      showPager(){
        return this.total > this.pageSize;
      }
    },

    components: {
      ElInput,
      ElSelectMenu,
      ComboOption,
      ElTag,
      ElScrollbar,
      ElPagination
    },

    directives: { Clickoutside },

    props: {
      name: String,
      value: {
        required: true
      },
      tipDisabled: {                  // 默认不禁用显示tooltip
        type: Boolean,
        default(){
          return false;
        }
      },
      validItemName: {                 // 使用 valid-item组件时的组件名称
        type: String,
        default: 'ValidItem'
      },
      getFillStyl: Function,           // 获取自定义组件配色
      optionsData: [Array, Object],    // Option初始化数据
      translated: Boolean,             // 是否翻译代码为中文
      id: String,
      size: String,
      readonly: Boolean,
      disabled: Boolean,
      clearable: Boolean,
      filterable: Boolean,
      allowCreate: Boolean,
      loading: Boolean,
      popperClass: String,
      remote: Boolean,
      loadingText: String,
      noMatchText: String,
      noDataText: String,
      remoteMethod: Function,
      filterMethod: Function,
      multiple: Boolean,
      multipleLimit: {
        type: Number,
        default: 0
      },
      placeholder: {
        type: String,
        default() {
          return t('el.select.placeholder');
        }
      },
      defaultFirstOption: Boolean,
      valueKey: {
        type: String,
        default: 'value'
      },
      //扩展参数，字典ID
      dictId : String,
      //扩展参数，下拉框参数
      dictParams : Object,
      //扩展参数，是否强制刷新，true表示每次点击都从后台刷新下拉数据，默认为false
      forceRefresh:{
          type : Boolean,
          default : false
      },
      //下拉框在行编辑中时的行数据
      dictRowData:Object,
      //下拉框在行编辑中时参数是否级联本行的数据
      dictRowCascade:{
          type : Boolean,
          default : false
      },
      //行级联时的参数映射关系
      dictRowCascadeMap:Object,
      //是否默认选择第一个选项
      autoSelectFirst:{
          type : Boolean,
          default : false
      },
      //分页每页显示数量
      pageSize:{
        default:30,
        type : Number
      }
    },

    data() {
      return {
        options: [],
        cachedOptions: [],
        filterValue:'',      // 过滤暂存值
        isFilterLoad: false, // 处理自定义过滤标志
        createdLabel: null,
        createdSelected: false,
        selected: this.multiple ? [] : {},
        isSelect: true,
        inputLength: 20,
        inputWidth: 0,
        cachedPlaceHolder: '',
        optionsCount: 0,
        filteredOptionsCount: 0,
        visible: false,
        selectedLabel: '',
        hoverIndex: -1,
        query: '',
        optionsAllDisabled: false,
        inputHovering: false,
        currentPlaceholder: '',
        voidRemoteQuery: false,
        comboItems:[], //下拉框数据
        comboLoading:false, //是否加载后台数据
        realParams:{}, //下拉框参数,
        paramChg: false, // 参数是否改变来确定是否选择第一个
        currentPage:1,
        total:0,
        _COMBO_DATAS:[]
      };
    },

    watch: {
      disabled() {
        this.$nextTick(() => {
          this.resetInputHeight();
        });
      },

      placeholder(val) {
        this.cachedPlaceHolder = this.currentPlaceholder = val;
      },

      value(val) {
        if (val === null || val === 'null') this.$emit('input', '');  // 处理值为null时为空
        if (this.multiple) {
          this.resetInputHeight();
          if (val.length > 0 || (this.$refs.input && this.query !== '')) {
            this.currentPlaceholder = '';
          } else {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
        }
        this.setSelected();
        if (this.filterable && !this.multiple) {
          this.inputLength = 20;
        }
        this.$emit('change', val);
        this.dispatch('ElFormItem', 'el.form.change', val);
        this.dispatch('ElForm', 'compare-change', this);
        this.dispatch(this.validItemName, 'valid.item.change', val);
        this.dispatch(this.validItemName, 'compare-change', this);

        if(val && this.comboItems.length==0){
            this.comboLoading=true;//赋值时下拉框还没有加载的话就自动加载
        }
      },

      query(val) {
        if (val === null || val === undefined) return;
        this.$nextTick(() => {
          if (this.visible) this.broadcast('ElSelectDropdown', 'updatePopper');
        });
        this.hoverIndex = -1;
        if (this.multiple && this.filterable) {
          this.inputLength = this.$refs.input.value.length * 15 + 20;
          this.managePlaceholder();
          this.resetInputHeight();
        }
        if (this.remote && typeof this.remoteMethod === 'function') {
          this.hoverIndex = -1;
          this.remoteMethod(val);
          this.voidRemoteQuery = val === '';
          this.broadcast('ComboOption', 'resetIndex');
        } else if (typeof this.filterMethod === 'function') {

          if(val === this.filterValue && val!="" &&  this.filterValue!="") return;
          // 自定义过滤方法处理
          if(!this.isFilterLoad){
            this.filterValue = val;
            this.filterMethod(val);
            this.broadcast('ElOptionGroup', 'queryChange');
          }
        }else if(this.showPager){
            if(val === this.filterValue && val!="" &&  this.filterValue!="") return;
            // 自定义过滤方法处理
            if(!this.isFilterLoad){
              this.filterValue = val;
              this.filterAll(val);
            }
        }else {
          this.filteredOptionsCount = this.optionsCount;
          this.broadcast('ComboOption', 'queryChange', val);
          this.broadcast('ElOptionGroup', 'queryChange');
        }
        if (this.defaultFirstOption &&!this.showPager && (this.filterable || this.remote) && this.filteredOptionsCount) {
          this.checkDefaultFirstOption();
        }
      },

      visible(val) {
        if (!val) {
          this.$refs.reference.$el.querySelector('input').blur();
          this.handleIconHide();
          this.broadcast('ElSelectDropdown', 'destroyPopper');
          if (this.$refs.input) {
            this.$refs.input.blur();
          }
          this.query = '';
          this.selectedLabel = '';
          this.inputLength = 20;
          this.resetHoverIndex();
          this.$nextTick(() => {
            if (this.$refs.input &&
              this.$refs.input.value === '' &&
              this.selected.length === 0) {
              this.currentPlaceholder = this.cachedPlaceHolder;
            }
          });
          if (!this.multiple) {
            if (this.selected) {
              if (this.filterable && this.allowCreate &&
                this.createdSelected && this.createdOption) {
                this.selectedLabel = this.createdLabel;
              } else {
                this.selectedLabel = this.selected.currentLabel;
              }
              if (this.filterable) this.query = this.selectedLabel;
            }
          }
        } else {
          this.handleIconShow();
          this.broadcast('ElSelectDropdown', 'updatePopper');
          if (this.filterable) {
            this.query = this.selectedLabel;
            if (this.multiple) {
              this.$refs.input.focus();
            } else {
              if (!this.remote) {
                this.broadcast('ComboOption', 'queryChange', '');
                this.broadcast('ElOptionGroup', 'queryChange');
              }
              this.broadcast('ElInput', 'inputSelect');
            }
          }

          //获取到焦点开始显示下拉菜单时,没有下拉项或者强制刷新forceRefresh=true时自动加载,或者存在行级联时
          if(this.comboItems.length==0 || this.forceRefresh || this.dictRowCascade){
              this.comboLoading=true;
          }
        }

        // 验证 valid-item 组件
        this.dispatch(this.validItemName, 'valid.item.blur', [this.value]);
        this.dispatch('ElFormItem', 'el.form.blur', [this.value]);
        this.$emit('visible-change', val);
      },

      options(val) {
        if (this.$isServer) return;
        this.optionsAllDisabled = val.length === val.filter(item => item.disabled === true).length;
        if (this.multiple) {
          this.resetInputHeight();
        }
        let inputs = this.$el.querySelectorAll('input');
        if ([].indexOf.call(inputs, document.activeElement) === -1) {
          this.setSelected();
        }
        if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
          this.checkDefaultFirstOption();
        }
      },
      // 对自定义filterMethod方法处理
      optionsData:{
        immediate: true,
        handler(optData){
          this.isFilterLoad = true;
          this.$nextTick(function(){
            this.isFilterLoad = false;
            this.query = this.filterValue;
            this.selectedLabel = this.filterValue;
            this.initSelected(this.cachedOptions);
          });
        }
      },
      cachedOptions(cacheData){  // Cache 初始化赋值
        !this.showPager && this.initSelected(cacheData);
      },

      comboLoading(val) {
        //comboLoading变为ture时，自动远程加载数据
        if(val===true){
          this.mergeParams();
          this.loadRemoteData();
        }
      },
      dictParams(val,oldVal){
        //参数值改变时重新加载下拉框
        let oldParams=this.realParams;
        this.mergeParams();
        if(!util.isObjectValueEqual(this.realParams,oldParams)){
          this.reloadData();
        }
        this.paramChg = true;
      },
      dictId(){
        this.comboLoading = true; //comboLoading变为true时，自动远程加载数据
      }
    },

    methods: {

      initSelected(cacheData){ // 重新初始化赋值
        let this$0 = this;
        if(cacheData.length>0) {
          cacheData.forEach((item)=>{
            if(item.value == this$0.value){
              this$0.setSelected();
              return;
            }
          });
        }
      },

      handleIconHide() {
        if (this.readonly) return;
        let icon = this.$el.querySelector('.el-input__icon');
        if (icon) {
          removeClass(icon, 'is-reverse');
        }
      },

      handleIconShow() {
        if (this.readonly) return;
        let icon = this.$el.querySelector('.el-input__icon');
        if (icon && !hasClass(icon, 'el-icon-circ-cross')) {
          addClass(icon, 'is-reverse');
        }
      },

      scrollToOption(option) {
        const target = Array.isArray(option) && option[0] ? option[0].$el : option.$el;
        if (this.$refs.popper && target) {
          const menu = this.$refs.popper.$el.querySelector('.el-select-dropdown__wrap');
          scrollIntoView(menu, target);
        }
      },

      handleMenuEnter() {
        this.$nextTick(() => this.scrollToOption(this.selected));
      },

      getOption(value) {
        // 自定义设置 cachedOption.value == value 和 let label
        let option;
        const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]';
        for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
          const cachedOption = this.cachedOptions[i];
          const isEqual = isObject
            ? getValueByPath(cachedOption.value, this.valueKey) == getValueByPath(value, this.valueKey)
            : cachedOption.value == value;
          if (isEqual) {
            option = cachedOption;
            break;
          }
        }
        // 修复有数据无法赋值的问题
        if (!option) {
          for (let i = this.options.length - 1; i >= 0; i--) {
            const item = this.options[i];
            const isEqual = isObject
              ? getValueByPath(item.value, this.valueKey) == getValueByPath(value, this.valueKey)
              : item.value == value;
            if (isEqual) {
              option = item;
              break;
            }
          }
        }

        if (option) return option;
        let label = !isObject
          ? value : '';
        let newOption = {
          value: value,
          currentLabel: label
        };
        if (this.multiple) {
          newOption.hitState = false;
        }
        return newOption;
      },

      setSelected() {
        if (!this.multiple) {
          let option = this.getOption(this.value);
          if (option.created) {
            this.createdLabel = option.currentLabel;
            this.createdSelected = true;
          } else {
            this.createdSelected = false;
          }
          this.selectedLabel = option.currentLabel;
          this.selected = option;
          if (this.filterable) this.query = this.selectedLabel;
           this.dispatch('ElForm', 'compare-change', this);
           this.dispatch(this.validItemName, 'compare-change', this);
          return;
        }
        let result = [];
        if (Array.isArray(this.value)) {
          this.value.forEach(value => {
            result.push(this.getOption(value));
          });
        }
        this.selected = result;
        this.$nextTick(() => {
          this.resetInputHeight();
          this.dispatch('ElForm', 'compare-change', this);
          this.dispatch(this.validItemName, 'compare-change', this);
        });
      },

      handleFocus() {
        this.visible = true;
      },

      handleIconClick(event) {
        // 自定义清除图标
        if (this.iconClass.indexOf('circ-cross') > -1) {
          this.deleteSelected(event);
        } else {
          this.toggleMenu();
        }
      },

      handleMouseDown(event) {
        if (event.target.tagName !== 'INPUT') return;
        if (this.visible) {
          this.handleClose();
          event.preventDefault();
        }
      },

      doDestroy() {
        this.$refs.popper && this.$refs.popper.doDestroy();
        this.dropdownUl = null;
      },

      handleClose() {
        this.visible = false;
      },

      toggleLastOptionHitState(hit) {
        if (!Array.isArray(this.selected)) return;
        const option = this.selected[this.selected.length - 1];
        if (!option) return;

        if (hit === true || hit === false) {
          option.hitState = hit;
          return hit;
        }

        option.hitState = !option.hitState;
        return option.hitState;
      },

      deletePrevTag(e) {
        if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
          this.filterValue = '';  // 自定义过滤暂存值清除
          const value = this.value.slice();
          value.pop();
          this.$emit('input', value);
        }
      },

      managePlaceholder() {
        if (this.currentPlaceholder !== '') {
          this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
        }
      },

      resetInputState(e) {
        if (e.keyCode !== 8) this.toggleLastOptionHitState(false);
        this.inputLength = this.$refs.input.value.length * 15 + 20;
        this.resetInputHeight();
      },

      resetInputHeight() {
        this.$nextTick(() => {
          if (!this.$refs.reference) return;
          let inputChildNodes = this.$refs.reference.$el.childNodes;
          let input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0];
          const tags = this.$refs.tags;
          input.style.height = this.selected.length === 0
            ? (sizeMap[this.size] || 36) + 'px'
            : Math.max(tags ? (tags.clientHeight + 6) : 0, sizeMap[this.size] || 36) + 'px';
          if (this.visible && this.emptyText !== false) {
            this.broadcast('ElSelectDropdown', 'updatePopper');
          }
        });
      },

      resetHoverIndex() {
        setTimeout(() => {
          if (!this.multiple) {
            this.hoverIndex = this.options.indexOf(this.selected);
          } else {
            if (this.selected.length > 0) {
              this.hoverIndex = Math.min.apply(null, this.selected.map(item => this.options.indexOf(item)));
            } else {
              this.hoverIndex = -1;
            }
          }
        }, 300);
      },

      handleOptionSelect(option) {
        if (this.multiple) {
          const value = this.value.slice();
          const optionIndex = this.getValueIndex(value, option.value);
          if (optionIndex > -1) {
            value.splice(optionIndex, 1);
          } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
            value.push(option.value);
          }
          this.$emit('input', value);
          if (option.created) {
            this.query = '';
            this.inputLength = 20;
          }
          if (this.filterable) this.$refs.input.focus();
        } else {
          this.$emit('input', option.value);
          this.visible = false;
        }
        this.$nextTick(() => this.scrollToOption(option));
      },

      getValueIndex(arr = [], value) {
        const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]';
        if (!isObject) {
          return arr.indexOf(value);
        } else {
          const valueKey = this.valueKey;
          let index = -1;
          arr.some((item, i) => {
            if (getValueByPath(item, valueKey) === getValueByPath(value, valueKey)) {
              index = i;
              return true;
            }
            return false;
          });
          return index;
        }
      },

      toggleMenu() {
        if (this.filterable && this.query === '' && this.visible) {
          return;
        }
        if (!this.disabled && !this.readonly) {
          this.visible = !this.visible;
        }
      },

      navigateOptions(direction) {
        if (!this.visible) {
          this.visible = true;
          return;
        }
        if (this.options.length === 0 || this.filteredOptionsCount === 0) return;
        this.optionsAllDisabled = this.options.length === this.options.filter(item => item.disabled === true).length;
        if (!this.optionsAllDisabled) {
          if (direction === 'next') {
            this.hoverIndex++;
            if (this.hoverIndex === this.options.length) {
              this.hoverIndex = 0;
            }
            if (this.options[this.hoverIndex].disabled === true ||
              this.options[this.hoverIndex].groupDisabled === true ||
              !this.options[this.hoverIndex].visible) {
              this.navigateOptions('next');
            }
          }
          if (direction === 'prev') {
            this.hoverIndex--;
            if (this.hoverIndex < 0) {
              this.hoverIndex = this.options.length - 1;
            }
            if (this.options[this.hoverIndex].disabled === true ||
              this.options[this.hoverIndex].groupDisabled === true ||
              !this.options[this.hoverIndex].visible) {
              this.navigateOptions('prev');
            }
          }
        }
        this.$nextTick(() => this.scrollToOption(this.options[this.hoverIndex]));
      },

      selectOption() {
        if (this.options[this.hoverIndex]) {
          this.handleOptionSelect(this.options[this.hoverIndex]);
        }
      },

      deleteSelected(event) {
        event.stopPropagation();
        this.$emit('input', '');
        this.visible = false;
        this.$emit('clear');
      },

      deleteTag(event, tag) {
        let index = this.selected.indexOf(tag);
        if (index > -1 && !this.disabled && !this.readonly) {
          const value = this.value.slice();
          value.splice(index, 1);
          this.$emit('input', value);
          this.$emit('remove-tag', tag);
        }
        event.stopPropagation();
      },

      onInputChange() {
        if (this.filterable) {
          this.query = this.selectedLabel;
        }
      },

      onOptionDestroy(option) {
        this.optionsCount--;
        this.filteredOptionsCount--;
        let index = this.options.indexOf(option);
        if (index > -1) {
          this.options.splice(index, 1);
        }
        //从缓存中移除
        let idx=this.cachedOptions.indexOf(option);
        if(idx > -1){
          this.cachedOptions.splice(index, 1);
        }
        this.broadcast('ComboOption', 'resetIndex');
      },

      resetInputWidth() {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      },

      handleResize() {
        this.resetInputWidth();
        if (this.multiple) this.resetInputHeight();
      },

      checkDefaultFirstOption() {
        this.hoverIndex = -1;
        for (let i = 0; i !== this.options.length; ++i) {
          const option = this.options[i];
          if (this.query) {
            // pick first options that passes the filter
            if (!option.disabled && !option.groupDisabled && option.visible) {
              this.hoverIndex = i;
              break;
            }
          } else {
            // pick currently selected option
            if (option.itemSelected) {
              this.hoverIndex = i;
              break;
            }
          }
        }
      },

      getValueKey(item) {
        if (Object.prototype.toString.call(item.value).toLowerCase() !== '[object object]') {
          return item.value;
        } else {
          return getValueByPath(item.value, this.valueKey);
        }
      },

      //加载远程数据
      loadRemoteData(callback){
        var self=this;
        if(!this.$store){  // 警告提示
          console && console.warn('Vuex $store required!');
          return;
        }
        this.$store.dispatch('loadDict',{
            dictId:this.dictId,
            dictParams:this.realParams,
            cacheable: !this.forceRefresh,
            successCallback:function(payload){
              self.comboLoading=false;
              self.fillComboDatas(payload.dictData);
              if(util.isFunction(callback)){
                callback.call(this);
              }
            },
            errorCallback:function(){
              self.comboLoading=false;
            }
        });
      },
      //重新加载下拉框选项
      reloadData(){
        var self=this;
        var oldvalue=self.value;
        var callback=function(){
            let comboValue=oldvalue;
            //回调，当下拉框有值时，先判断新加载的数据是否在下拉选项中存在，存在则赋值，不存在则清空值
            if(comboValue && comboValue.length>0){
              var clearOldValue=true;
              for(var i=0; i<self.comboItems.length && !self.multiple ; i++){
                if(comboValue==self.comboItems[i].c_code){
                  clearOldValue=false;
                  break;
                }
              }
              if(clearOldValue){
                //清除选中的值
                self.selected = {};
                self.selectedLabel = '';
                let empty= self.multiple ? [] : '';
                self.$emit('input', empty);
                self.$emit('change', empty);
                self.visible = false;
              }
            }
        };
        self.loadRemoteData(callback);
      },
      //合并下拉框参数（从行数据中取到对应的值，附加到参数中）
      mergeParams(){
        let rowParams={};
        if(this.dictRowCascade && this.dictRowCascadeMap){ //含有行级联的下拉框
          for (let key in this.dictRowCascadeMap) {
            var prop=this.dictRowCascadeMap[key]; //遍历映射关系，从行数据中取到对应的值，附加到参数中
            rowParams[key]=getValueByPath(this.dictRowData,prop);
          }
        }
        this.realParams=util.mixins({},this.dictParams,rowParams);
      },

      //下拉框翻页
      onPageChange(val){
        let start=(val-1)*this.pageSize;
        let end=val*this.pageSize;
        let data=this._COMBO_DATAS.slice(start,end);
        let index=this.getValueIndexFromAll();
        if(index !=-1 && (index < start || index>=end)){
          let selected=this._COMBO_DATAS[index];
          data.splice(0,0,selected);
        }
        this.comboItems=util.getOriginalData(data);
      },

      //填充下拉框数据，自动分页
      fillComboDatas(datas){
        this._COMBO_DATAS=datas;
        this.total=datas.length;
        //有值时，找到值对应的页
        if(this.value && this.value.length>0 ){
          let index=this.getValueIndexFromAll();
          if(index < this.pageSize){
            this.currentPage=1;
          }else{
            this.currentPage=Math.floor(index/this.pageSize)+1;
          }
        }else{
          this.currentPage=1;
        }
        let start = (this.currentPage-1) * this.pageSize;
        let end = this.currentPage * this.pageSize;
        this.cachedOptions=[];
        this.comboItems = util.getOriginalData(this._COMBO_DATAS.slice(start,end));
      },

      //获取下拉框选中值所在的位置
      getValueIndexFromAll(){
        if(this.value && this._COMBO_DATAS.length>0){
          for(let i=0;i<this._COMBO_DATAS.length;i++){
            if(this._COMBO_DATAS[i].c_code==this.value){
              return i;
            }
          }
        }
        return -1;
      },
      filterAll(query){
        this.isFilterLoad=true;

        if(query==''){
          let start = (this.currentPage-1) * this.pageSize;
          let end = this.currentPage * this.pageSize;
          this.comboItems = util.getOriginalData(this._COMBO_DATAS.slice(start,end));
        }else{
          let arr=[];
          for(let i=0;i<this._COMBO_DATAS.length && arr.length < this.pageSize;i++){
            if(this._COMBO_DATAS[i].c_cname.indexOf(query)!=-1){
              arr.push(this._COMBO_DATAS[i]);
            }
          }
          this.comboItems = util.getOriginalData(arr);
        }

        this.isFilterLoad=false;
      },
      optionIndexChg(idx) {
        //没有值时根据autoSelectFirst决定是否选中第一个选项
        if ((this.comboItems.length -1) === idx && this.autoSelectFirst && this.paramChg && !this.value) {
          this.$nextTick(function(){
            let val=this.comboItems[0].c_code;
            let option = this.getOption(val);
            this.selectedLabel = option.currentLabel;
            this.selected = option;
            this.paramChg = false;
            this.$emit('input', val);
            this.$emit('change', val);
          });
        }
      }
    },

    created() {
      this.mergeParams();
      this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
      if (this.multiple && !Array.isArray(this.value)) {
        this.$emit('input', []);
      }
      if (!this.multiple && Array.isArray(this.value)) {
        this.$emit('input', '');
      }

      if (this.remote) {
        this.voidRemoteQuery = true;
      }
      this.debouncedOnInputChange = debounce(this.debounce, () => {
        this.onInputChange();
      });

      this.$on('handleOptionClick', this.handleOptionSelect);
      this.$on('onOptionDestroy', this.onOptionDestroy);
      this.$on('setSelected', this.setSelected);
      this.$on('optionIndexChg', this.optionIndexChg);
    },

    mounted() {
      this.mergeParams();
      if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
        this.currentPlaceholder = '';
      }
      addResizeListener(this.$el, this.handleResize);
      if (this.remote && this.multiple) {
        this.resetInputHeight();
      }
      this.$nextTick(() => {
        if (this.$refs.reference && this.$refs.reference.$el) {
          this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
        }
      });

      if(!this.$store){  // 警告提示
        console && console.warn('Vuex $store required!');
        return;
      }
      //如果dictId不为空，则加载已有的下拉框数据
      if(this.dictId){
        var data=this.$store.state.dictStore.dict[this.dictId];
        if(data && data.length>0){
          this.fillComboDatas(data);
        }else{ //缓存中没有数据时
          if(this.value && this.value.length>0){ //有默认值时立即加载后台数据
            this.comboLoading=true;
          }else{
            //下拉框没有有默认值，延迟加载 ////暂不自动加载，等赋值或者点击下拉框时再加载
           // var delay=Math.floor(Math.random()*3000); //3秒以内随机时间加载
          //  setTimeout(()=>{
          //    this.comboLoading=true;
           // },delay)
          }
        }
      }
      this.setSelected();
    },

    beforeDestroy() {
      if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
    }
  };
</script>
