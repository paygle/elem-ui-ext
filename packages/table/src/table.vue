<template>
  <div class="el-table"
    :class="{
      'el-table--fit': fit,
      'el-table--striped': stripe,
      'el-table--border': border,
      'el-table--hidden': isHidden,
      'el-table--fluid-height': maxHeight,
      'el-table--enable-row-hover': !store.states.isComplex,
      'el-table--enable-row-transition': (store.states.data || []).length !== 0 && (store.states.data || []).length < 100
    }"
    @mouseleave="handleMouseLeave($event)">
    <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>
    <div class="el-table__header-wrapper" ref="headerWrapper" v-if="showHeader">
      <table-header
        :store="store"
        :layout="layout"
        :border="border"
        :default-sort="defaultSort"
        :style="{ width: layout.bodyWidth ? layout.bodyWidth + 'px' : '' }">
      </table-header>
    </div>
    <div
      class="el-table__body-wrapper"
      ref="bodyWrapper"
      :style="[bodyHeight, ieMaxHeight]">
      <table-body
        :expand-only-one="expandOnlyOne"
        :context="context"
        :store="store"
        :stripe="stripe"
        :layout="layout"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :highlight="highlightCurrentRow"
        :style="{ width: bodyWidth }">
      </table-body>
      <div :style="{ width: bodyWidth }" class="el-table__empty-block" v-if="!data || data.length === 0">
        <span class="el-table__empty-text"><slot name="empty">{{ emptyText || t('el.table.emptyText') }}</slot></span>
      </div>
    </div>
    <div class="el-table__footer-wrapper" ref="footerWrapper" v-if="showSummary" v-show="data && data.length > 0">
      <table-footer
        :store="store"
        :layout="layout"
        :border="border"
        :sum-text="sumText || t('el.table.sumText')"
        :summary-method="summaryMethod"
        :default-sort="defaultSort"
        :style="{ width: layout.bodyWidth ? layout.bodyWidth + 'px' : '' }">
      </table-footer>
    </div>
    <div class="el-table__fixed" ref="fixedWrapper"
      v-if="fixedColumns.length > 0"
      :style="[
        { width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' },
        fixedHeight
      ]">
      <div class="el-table__fixed-header-wrapper" ref="fixedHeaderWrapper" v-if="showHeader">
        <table-header
          fixed="left"
          :border="border"
          :store="store"
          :layout="layout"
          :style="{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' }"></table-header>
      </div>
      <div class="el-table__fixed-body-wrapper" ref="fixedBodyWrapper"
        :style="[
          { top: layout.headerHeight + 'px' },
          fixedBodyHeight
        ]">
        <table-body
          :expand-only-one="expandOnlyOne"
          fixed="left"
          :store="store"
          :stripe="stripe"
          :layout="layout"
          :highlight="highlightCurrentRow"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :style="{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' }">
        </table-body>
      </div>
      <div class="el-table__fixed-footer-wrapper" ref="fixedFooterWrapper" v-if="showSummary" v-show="data && data.length > 0">
        <table-footer
          fixed="left"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :layout="layout"
          :style="{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' }"></table-footer>
      </div>
    </div>
    <div class="el-table__fixed-right" ref="rightFixedWrapper"
      v-if="rightFixedColumns.length > 0"
      :style="[
        { width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' },
        { right: layout.scrollY ? (border ? layout.gutterWidth : (layout.gutterWidth || 1)) + 'px' : '' },
        fixedHeight
      ]">
      <div class="el-table__fixed-header-wrapper" ref="rightFixedHeaderWrapper" v-if="showHeader">
        <table-header
          fixed="right"
          :border="border"
          :store="store"
          :layout="layout"
          :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' }"></table-header>
      </div>
      <div class="el-table__fixed-body-wrapper" ref="rightFixedBodyWrapper"
        :style="[
          { top: layout.headerHeight + 'px' },
          fixedBodyHeight
        ]">
        <table-body
          :expand-only-one="expandOnlyOne"
          fixed="right"
          :store="store"
          :stripe="stripe"
          :layout="layout"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :highlight="highlightCurrentRow"
          :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' }">
        </table-body>
      </div>
      <div class="el-table__fixed-footer-wrapper" ref="rightFixedFooterWrapper" v-if="showSummary" v-show="data && data.length > 0">
        <table-footer
          fixed="right"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :layout="layout"
          :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' }"></table-footer>
      </div>
    </div>
    <div class="el-table__fixed-right-patch"
      v-if="rightFixedColumns.length > 0"
      :style="{ width: layout.scrollY ? layout.gutterWidth + 'px' : '0', height: layout.headerHeight + 'px' }"></div>
    <div class="el-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div>
  </div>
</template>

<script type="text/babel">
  import ElCheckbox from 'element-ui/packages/checkbox';
  import throttle from 'throttle-debounce/throttle';
  import debounce from 'throttle-debounce/debounce';
  import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
  import Locale from 'element-ui/src/mixins/locale';
  import TableStore from './table-store';
  import TableLayout from './table-layout';
  import TableBody from './table-body';
  import TableHeader from './table-header';
  import TableFooter from './table-footer';
  import { mousewheel } from './util';
  import { on, off } from 'element-ui/src/utils/dom';
  import { focusInput } from 'element-ui/src/utils/funcs';

  let tableIdSeed = 1;

  export default {
    name: 'ElTable',

    mixins: [Locale],

    props: {
      data: {
        type: Array,
        default: function() {
          return [];
        }
      },

      width: [String, Number],

      height: [String, Number],

      maxHeight: [String, Number],

      fit: {
        type: Boolean,
        default: true
      },

      stripe: Boolean,

      border: Boolean,

      rowKey: [String, Function],

      context: {},

      showHeader: {
        type: Boolean,
        default: true
      },

      showSummary: Boolean,

      sumText: String,

      summaryMethod: Function,

      rowClassName: [String, Function],

      rowStyle: [Object, Function],

      highlightCurrentRow: {    //设置默认点击单行时选定显示
        type: Boolean,
        default: true
      },

      currentRowKey: [String, Number],

      emptyText: String,

      expandRowKeys: Array,

      defaultExpandAll: Boolean,

      defaultSort: Object,

      tooltipEffect: String,

      expandOnlyOne: {    // 同时仅允许打开一行数据
        type: Boolean,
        default: false
      },

      expandIconHidden:{    // 是否隐藏展开图标
        type: Boolean,
        default: false
      },

      compareStyl: Array,   // 比较字段设置样式

      modifiedStyl: Function  //修改后的样式
    },

    components: {
      TableHeader,
      TableFooter,
      TableBody,
      ElCheckbox
    },

    methods: {
      // 设置行样式
      setRowStyle(rowIndexs, styl) {

        const rows = this.$el.querySelectorAll('tbody > tr.el-table__row');
        if (rows.length < 1 || typeof styl === 'undefined') return;

        function setRowIndexStyl(index, stylObj) {
          let row = rows[index];
          if (row && typeof stylObj === 'object') {
            for (let p in stylObj) {
              if (stylObj.hasOwnProperty(p)) row.style[p] = stylObj[p];
            }
          }
        }

        if (Array.isArray(rowIndexs)) { //格式: [1,2,4,6,8]
          for (let k = 0; k < rowIndexs.length; k++) setRowIndexStyl.call(this, rowIndexs[k], styl);
        } else if (!isNaN(rowIndexs)) {  //格式: 5
          setRowIndexStyl.call(this, rowIndexs, styl);
        } else if (typeof rowIndexs === 'string') {
          if (rowIndexs === 'all') {     //格式:  all
            for (let k = 0; k < rows.length; k++) setRowIndexStyl.call(this, k, styl);
          } else if (/^\d+\-\d+$/g.test(rowIndexs)) { //格式: 0-12
            let span = rowIndexs.split('-');
            for (let k = parseInt(span[0], 10); k <= parseInt(span[1], 10); k++) {
              setRowIndexStyl.call(this, k, styl);
            }
          }
        }
      },

      // 数据修改比较
      modifiedCompare() {
        clearTimeout(this.timeHanlder);  // 一定要使用定时器，否则严重损耗性能
        this.timeHanlder = setTimeout(() => { this.store.commit('modifiedCompare'); }, 500);
      },

      //锁定初始数据用于判定是否为修改
      lockData() {
        this.store.commit('lockData');
      },

      setCurrentRow(row) {
        this.store.commit('setCurrentRow', row);
      },

      toggleRowSelection(row, selected) {
        this.store.toggleRowSelection(row, selected);
        this.store.updateAllSelected();
      },

      clearSelection() {
        this.store.clearSelection();
      },

      handleMouseLeave() {
        this.store.commit('setHoverRow', null);
        if (this.hoverState) this.hoverState = null;
      },

      updateScrollY() {
        this.layout.updateScrollY();
      },

      bindEvents() {
        const { headerWrapper, footerWrapper } = this.$refs;
        const refs = this.$refs;
        this.bodyWrapper.addEventListener('scroll', function() {
          if (headerWrapper) headerWrapper.scrollLeft = this.scrollLeft;
          if (footerWrapper) footerWrapper.scrollLeft = this.scrollLeft;
          if (refs.fixedBodyWrapper) refs.fixedBodyWrapper.scrollTop = this.scrollTop;
          if (refs.rightFixedBodyWrapper) refs.rightFixedBodyWrapper.scrollTop = this.scrollTop;
        });

        const scrollBodyWrapper = event => {
          const { deltaX, deltaY } = event;

          if (Math.abs(deltaX) < Math.abs(deltaY)) return;

          if (deltaX > 0) {
            this.bodyWrapper.scrollLeft += 10;
          } else if (deltaX < 0) {
            this.bodyWrapper.scrollLeft -= 10;
          }
        };
        if (headerWrapper) {
          mousewheel(headerWrapper, throttle(16, scrollBodyWrapper));
        }
        if (footerWrapper) {
          mousewheel(footerWrapper, throttle(16, scrollBodyWrapper));
        }

        if (this.fit) {
          this.windowResizeListener = throttle(50, () => {
            if (this.$ready) this.doLayout();
          });
          addResizeListener(this.$el, this.windowResizeListener);
        }
      },

      doLayout() {
        this.store.updateColumns();
        this.layout.update();
        this.updateScrollY();
        this.$nextTick(() => {
          if (this.height) {
            this.layout.setHeight(this.height);
          } else if (this.maxHeight) {
            this.layout.setMaxHeight(this.maxHeight);
          } else if (this.shouldUpdateHeight) {
            this.layout.updateHeight();
          }
          // if (this.$el) { //导致无法展示
          //   this.isHidden = this.$el.clientWidth === 0;
          //   if (this.isHidden && this.layout.bodyWidth) {
          //     setTimeout(() => this.doLayout());
          //   }
          // }
        });
      },
      // 跳转到输入框
      jumpToFocus(e) {
        //t38 d40
        if (e.keyCode === 38) {
          this.gotoNextFocus(this.getCurrentFocusName(e.target), 'up');
        } else if (e.keyCode === 40) {
          this.gotoNextFocus(this.getCurrentFocusName(e.target), 'down');
        }
      },
      getCurrentFocusName(elem) {
        if (elem) {
          let current = elem,
            clsName,
            isFind,
            r, clses,
            splitCls = ['row'];
          do {
            current = current.parentNode;
            clsName = current.parentNode.className;
            isFind = /row\d+[a-zA-Z]+\w+/.test(clsName);
          } while (!isFind && this.$el.contains(current));

          clses = clsName.split(/\s+/);
          for (let i = 0; i < clses.length; i++) {
            if (/row\d+[a-zA-Z]+\w+/.test(clses[i])) {
              clsName = clses[i];
              break;
            } else {
              clsName = null;
            }
          }
          if (clsName) {
            r = clsName.replace(/row\d+/ig, '');
            splitCls.push(clsName.replace('row', '').replace(r, ''));
            splitCls.push(r);
            return splitCls;
          } else {
            return [];
          }
        }
        return [];
      },
      gotoNextFocus(clsParam, updw) {

        if (clsParam.length !== 3) return;
        let rowlen = this.store.states.data.length;
        let rowindex = parseInt(clsParam[1], 10);
        let arrow = updw === 'up' ? -1 : 1;
        let queryElem, inputElm, times = 0, gonext;

        do {
          times++;
          if (updw === 'up' && rowindex > 0) {
            clsParam[1] = rowindex + arrow;
          } else if (updw === 'up' && rowindex === 0) {
            clsParam[1] = rowlen - 1;
          } else if (updw === 'down' && rowindex < rowlen - 1) {
            clsParam[1] = rowindex + arrow;
          } else if (updw === 'down' && rowindex === rowlen - 1) {
            clsParam[1] = 0;
          }
          rowindex = parseInt(clsParam[1], 10);
          queryElem = this.$el.querySelector('.'+clsParam.join(''));
          if (queryElem) {
            inputElm = queryElem.querySelector('input') || queryElem.querySelector('textarea');
            focusInput(inputElm);
            if (inputElm && (inputElm.readonly || inputElm.disabled)) {
              gonext = true;
            } else {
              gonext = false;
            }
          }
        } while ((!inputElm || gonext) && times < rowlen);
      }
    },

    created() {
      this.tableId = 'el-table_' + tableIdSeed + '_';
      this.debouncedLayout = debounce(50, () => this.doLayout());
    },

    computed: {
      bodyWrapper() {
        return this.$refs.bodyWrapper;
      },

      shouldUpdateHeight() {
        return typeof this.height === 'number' ||
          this.fixedColumns.length > 0 ||
          this.rightFixedColumns.length > 0;
      },

      selection() {
        return this.store.states.selection;
      },

      columns() {
        return this.store.states.columns;
      },

      tableData() {
        return this.store.states.data;
      },

      fixedColumns() {
        return this.store.states.fixedColumns;
      },

      rightFixedColumns() {
        return this.store.states.rightFixedColumns;
      },

      ieMaxHeight() { // 修复IE9表格引起的页面抖动
        let len = Array.isArray(this.data) ? this.data.length : 0;
        if(typeof this.height === 'undefined' && len > 0 &&
          navigator.appName == "Microsoft Internet Explorer" &&
          navigator.appVersion .split(";")[1].replace(/\s/g,'')=="MSIE9.0") {
          return {maxHeight: (30 * len + 80) + 'px', overflow: 'hidden'};
        }
        return {};
      },

      bodyHeight() {
        let style = {};

        if (this.height) {
          style = {
            height: this.layout.bodyHeight ? this.layout.bodyHeight + 'px' : ''
          };
        } else if (this.maxHeight) {
          style = {
            'max-height': (this.showHeader
              ? this.maxHeight - this.layout.headerHeight - this.layout.footerHeight
              : this.maxHeight - this.layout.footerHeight) + 'px'
          };
        }
        return style;
      },

      bodyWidth() {
        const { bodyWidth, scrollY, gutterWidth } = this.layout;
        return bodyWidth ? bodyWidth - (scrollY ? gutterWidth : 0) + 'px' : '';
      },

      fixedBodyHeight() {
        let style = {};

        if (this.height) {
          style = {
            height: this.layout.fixedBodyHeight ? this.layout.fixedBodyHeight + 'px' : ''
          };
        } else if (this.maxHeight) {
          let maxHeight = this.layout.scrollX ? this.maxHeight - this.layout.gutterWidth : this.maxHeight;

          if (this.showHeader) {
            maxHeight -= this.layout.headerHeight;
          }

          style = {
            'max-height': maxHeight + 'px'
          };
        }

        return style;
      },

      fixedHeight() {
        let style = {};

        if (this.maxHeight) {
          style = {
            bottom: (this.layout.scrollX && this.data.length) ? this.layout.gutterWidth + 'px' : ''
          };
        } else {
          style = {
            height: this.layout.viewportHeight ? this.layout.viewportHeight + 'px' : ''
          };
        }

        return style;
      }
    },

    watch: {
      height(value) {
        this.layout.setHeight(value);
      },

      currentRowKey(newVal) {
        this.store.setCurrentRowKey(newVal);
      },

      data: {
        immediate: true,
        handler(val) {
          this.store.commit('setData', val);
          if (this.$ready) this.doLayout();
        }
      },

      expandRowKeys(newVal) {
        this.store.setExpandRowKeys(newVal);
      }
    },

    beforeDestroy() {
      if (this.$refs.bodyWrapper) off(this.$refs.bodyWrapper, 'keyup', this.jumpToFocus);
    },

    destroyed() {
      if (this.windowResizeListener) removeResizeListener(this.$el, this.windowResizeListener);
    },

    mounted() {
      this.bindEvents();
      this.doLayout();

      // init filters
      this.store.states.columns.forEach(column => {
        if (column.filteredValue && column.filteredValue.length) {
          this.store.commit('filterChange', {
            column,
            values: column.filteredValue,
            silent: true
          });
        }
      });

      this.$ready = true;
      // 初始化比对样式
      this.$nextTick(_ => {
        this.store.commit('updateCompare');
        on(this.$refs.bodyWrapper, 'keyup', this.jumpToFocus);
      });
    },

    data() {
      const store = new TableStore(this, {
        rowKey: this.rowKey,
        defaultExpandAll: this.defaultExpandAll
      });
      const layout = new TableLayout({
        store,
        table: this,
        fit: this.fit,
        showHeader: this.showHeader
      });
      return {
        store,
        layout,
        isHidden: false,
        renderExpanded: null,
        resizeProxyVisible: false,
        timeHanlder: null
      };
    }
  };
</script>
