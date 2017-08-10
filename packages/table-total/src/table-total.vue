<template>
  <div class="form-table-total" v-show="isShow">
    <div class="total-cell" 
      v-for="(item, index) in layoutData"
      v-if="!item.hide"
      :key="index"
      :style="{textAlign:item.align, left:item.left, width:item.width }">
      <span class="total-label" v-text="item.label"></span><span class="total-value" v-text="item.value"></span>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import debounce from 'throttle-debounce/debounce';
export default {
  name: 'TableTotal',
  data() {
    return {
      parentEl: null,
      totalData: [],        // 统计数据
      colWidths: [],
      layoutData: [],
      selfPos: {},
      isShow: false,
      store: null    //指令绑定的table组件的store
    };
  },
  computed: {
    columns() { //table的单元格数据
      return this.store.states.columns;
    }
  },
  watch: {
    totalData(n, o) {
      if (n !== o) {
        this.computedWidths();
      }
    },
    columns: debounce(200, function (n, o) {
      this.computedWidths(n);
    })
  },
  methods: {
    computedWidths(columns) {
      let tr, tds, colgroup, cols, tmp, _this = this;
      let colWidths = this.colWidths;
      this.layoutData = [];

      function getLayoutData(item) {
        let i, j, cell = {}, width = 0, left = 0;
        cell.align = item.align;                // 对齐
        cell.hide = item.hide;                  // 是否隐藏
        cell.label = item.label;                // 显示名称
        cell.value = item.value;                // 对应值

        if (colWidths.length > 0) {
          // 获取X坐标
          if (item.pos < colWidths.length) {
            if (item.pos > 0) {                    // 所在位置
              for (i = 0; i < item.pos - 1; i++) {
                left += colWidths[i] ? colWidths[i].width : 0;
              }
              cell.left = left + 'px';
            } else {
              cell.left = '0px';
            }
          } else {
            cell.left = '-50%';
          }
          // 获取宽度
          if (item.colspan < colWidths.length) {
            let length = item.pos - 1 + item.colspan;
            if (item.colspan > 0) {                // 所跨单元格
              for (j = item.pos - 1; j < length; j++) {
                width += colWidths[j] ? colWidths[j].width : 0;
              }
              cell.width = width + 'px';
            } else {
              cell.width = colWidths[0].width + 'px';
            }
          } else {
            cell.width = '100%';
          }
        }
        return cell;
      }

      function LazyRun() {
        let i, j, k, item;
        if (_this.parentEl && !columns) {
          colgroup = _this.parentEl.querySelector('.el-table__header-wrapper colgroup');
          cols = colgroup ? colgroup.querySelectorAll('col') : null;
          if (!cols) {
            tr = _this.parentEl.querySelector('.el-table__body-wrapper tbody tr');
            tds = tr ? tr.querySelectorAll('td') : null;
          }
        }

        if (tds || cols || columns) {

          if (tds) {  // 计算单元格
            colWidths = []; //清空旧数据
            for (i = 0; i < tds.length; i++) {
              item = tds[i];
              tmp = item.getBoundingClientRect();
              colWidths.push({ width: tmp.width });
            }
          } else if (cols) { // 计算列
            colWidths = []; //清空旧数据
            for (i = 0; i < cols.length; i++) {
              item = cols[i];
              colWidths.push({ width: parseInt(item.width, 10) });
            }
          } else if (columns) {
            colWidths = columns.map(column => {
              return { width: column.realWidth || column.width };
            });
          }

          for (j = 0; j < _this.totalData.length; j++) {
            _this.layoutData.push(getLayoutData(_this.totalData[j]));
          }
        }

        // 是否显示统计组件
        _this.isShow = false;
        for (k = 0; k < _this.layoutData.length; k++) {
          item = _this.layoutData[k];
          if (item && !item.hide) {
            _this.isShow = true;
          }
        }

      }// LazyRun

      Vue.nextTick(LazyRun);
    }

  },
  mounted() {
    this.$nextTick(function () {
      this.computedWidths();
      this.$el.parentElement.style.paddingBottom = '20px';
    });
  }
};
</script>