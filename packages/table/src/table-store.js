import Vue from 'vue';
import debounce from 'throttle-debounce/debounce';
import { orderBy, getColumnById, getRowIdentity } from './util';

const sortData = (data, states) => {
  const sortingColumn = states.sortingColumn;
  if (!sortingColumn || typeof sortingColumn.sortable === 'string') {
    return data;
  }
  return orderBy(data, states.sortProp, states.sortOrder, sortingColumn.sortMethod);
};

const getKeysMap = function(array, rowKey) {
  const arrayMap = {};
  (array || []).forEach((row, index) => {
    arrayMap[getRowIdentity(row, rowKey)] = { row, index };
  });
  return arrayMap;
};

const toggleRowSelection = function(states, row, selected) {
  let changed = false;
  const selection = states.selection;
  const index = selection.indexOf(row);
  if (typeof selected === 'undefined') {
    if (index === -1) {
      selection.push(row);
      changed = true;
    } else {
      selection.splice(index, 1);
      changed = true;
    }
  } else {
    if (selected && index === -1) {
      selection.push(row);
      changed = true;
    } else if (!selected && index > -1) {
      selection.splice(index, 1);
      changed = true;
    }
  }
  return changed;
};

/* 比值样式计算
[
 {
   style: {                 // 自定义样式
     color: '#fff',
     background: 'green'
   },
   fields: ['name', 'desc'], // 需要比较触发计算的字段
   stylefields: ['desc'], // 需要设置样式的字段（省略时，同fields)
   compare:function(data) {
     return data.name > data.desc;    // 返回为真时设置给定样式
   }
 }
]
*/
const compareChgStyl = function(table, states) {

 if (!Array.isArray(table.compareStyl) || !Array.isArray(table.data)) return;
 let data = table.data;  // 表数据
 let compareMap = states.compareMap;

 function setCustomStyle(row, rowIndex, cp, styl) {
   let fields = cp.stylefields || cp.fields;

   fields.forEach((f) => {
     for (let prop in row) {
       if (row.hasOwnProperty(prop) && prop === f) {
          compareMap['row' + rowIndex + f] = styl;
       }
     }
   });
 }

  // 设定表格样式
  table.compareStyl.forEach((cp)=>{

    for (let i=0; i < data.length; i++) {

      if (cp.compare.call(null, data[i], cp.fields, i)) {
        setCustomStyle(data[i], i, cp, cp.style);
      } else {
        let empty = {};
        for (let p in cp.style) {
          if (cp.style.hasOwnProperty(p)) empty[p] = '';
        }
        setCustomStyle(data[i], i, cp, empty);
      }
    }

  });

  // 渲染样式
  let dom, compSty;
  for (let key in states.compareMap) {
    dom = table.$el.querySelector('.' + key);
    if (states.compareMap.hasOwnProperty(key) && dom) {
      compSty = states.compareMap[key];
      for (let p in compSty) {
        if (compSty.hasOwnProperty(p)) dom.parentNode.style[p] = compSty[p];
      }
    }
  }
};

const TableStore = function(table, initialState = {}) {
  if (!table) {
    throw new Error('Table is required.');
  }
  this.table = table;

  this.states = {
    rowKey: null,
    _columns: [],
    originColumns: [],
    columns: [],
    fixedColumns: [],
    rightFixedColumns: [],
    isComplex: false,
    _data: null,
    filteredData: null,
    data: null,
    sortingColumn: null,
    sortProp: null,
    sortOrder: null,
    isAllSelected: false,
    selection: [],
    reserveSelection: false,
    selectable: null,
    currentRow: null,
    hoverRow: null,
    filters: {},
    expandRows: [],
    defaultExpandAll: false,
    delRowCount: 0,     // 删除行数
    _initialData: [],   // 初始化数据
    modifiedMap: {},    // 数据修改比对映射，数据格式：{ row: {background: 'green' },  col: {background: 'red' } }
    compareMap: {}      // 比较值样式映射
  };

  for (let prop in initialState) {
    if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
      this.states[prop] = initialState[prop];
    }
  }
};

TableStore.prototype.mutations = {
  // 更新比较样式
  updateCompare(states) {
    if (Array.isArray(this.table.compareStyl)) {
      compareChgStyl.call(this, this.table, states);
    }
  },
  // 数据比较映射删除处理
  compareDel(states, rowIndex) {

    if (!isNaN(rowIndex)) {
      if (rowIndex < states._initialData.length) {
        let k, x, n, key1, key2, item, modifiedMap = {}, compareMap = {};
        let reg = new RegExp(`row${rowIndex}[a-z]+[a-z0-9]*$`, 'ig');
        for (k in states.modifiedMap) {
          reg.lastIndex = 0;
          if (states.modifiedMap.hasOwnProperty(k) && reg.test(k)) {
            delete states.modifiedMap[k];
          }
        }

        for (x in states.compareMap) {
          reg.lastIndex = 0;
          if (states.compareMap.hasOwnProperty(x) && reg.test(x)) {
            delete states.compareMap[x];
          }
        }

        for (n = 0; n < states._initialData.length; n++) {
          item = states._initialData[n];
          // 处理删除元素前部分
          if (n < rowIndex && typeof item === 'object') {
            for (key1 in item) {
              if (item.hasOwnProperty(key1)) {
                compareMap[`row${n}${key1}`] = states.compareMap[`row${n}${key1}`];
                modifiedMap[`row${n}${key1}`] = states.modifiedMap[`row${n}${key1}`];
              }
            }
          // 处理删除元素后部分
          } else if (n > rowIndex && typeof item === 'object') {

            for (key2 in item) {
              if (item.hasOwnProperty(key2)) {
                compareMap[`row${n - 1}${key2}`] = states.compareMap[`row${n}${key2}`];
                modifiedMap[`row${n - 1}${key2}`] = states.modifiedMap[`row${n}${key2}`];
              }
            }
          }
        }
        states.compareMap = compareMap;
        states.modifiedMap = modifiedMap;
        states._initialData.splice(rowIndex, 1);
        states.delRowCount++;
      }
    }
  },
  // 数据修改比较
  modifiedCompare(states) {
    let row,itemStyl,table = this.table;
    // 比较对象是否相等
    function isEqualObj(item$1, item$2) {

      function equalObj(item1, item2) {
        for (let p in item1) {
          if (item1.hasOwnProperty(p) && item1[p] !== item2[p]) {
            return false;
          }
        }
        return true;
      }

      if (Array.isArray(item$1) === Array.isArray(item$2)) {
        if (item$1.length === item$2.length) {
          for (let k = 0; k < item$1.length; k++) {
            if (item$1[k] !== item$2[k]) return false;
          }
          return true; // 相等
        }
        return false;
      } else if (typeof item$1 === 'object' && typeof item$2 === 'object') {
        if (equalObj(item$1, item$2) && equalObj(item$2, item$1)) {
          return true;
        }
        return false;
      }
      return false;
    }

    // 合并样式
    function mergeStyl(origin, cover) {
      if (typeof origin['col'] === 'object' && typeof cover === 'object') {
        for (let k in cover) {
          if (cover.hasOwnProperty(k)) {
            if (origin['col'].hasOwnProperty(k)) {
              if (origin['col'][k] === '') origin['col'][k] = cover[k];
            } else {
              origin['col'][k] = cover[k];
            }
          }
        }
      }
      return origin;
    }

    // 数据修改比较处理
    if (Array.isArray(states.data) && Array.isArray(states._initialData) && typeof table.modifiedStyl === 'function') {
      for (let rowindex = 0; rowindex < states._initialData.length; rowindex++) {
        row = states._initialData[rowindex];
        for (let prop in row) {
          if (row.hasOwnProperty(prop)) {
            if (typeof row[prop] !== 'object') {
              itemStyl = table.modifiedStyl.call(null, row[prop] !== states.data[rowindex][prop], row, prop, rowindex, states.delRowCount);
              states.modifiedMap['row' + rowindex + prop] = mergeStyl(itemStyl, states.compareMap['row' + rowindex + prop]);
            } else if (typeof row[prop] === 'object') {
              itemStyl = table.modifiedStyl.call(null, !isEqualObj(states.data[rowindex][prop], row[prop]), row, prop, rowindex, states.delRowCount);
              states.modifiedMap['row' + rowindex + prop] = mergeStyl(itemStyl, states.compareMap['row' + rowindex + prop]);
            }
          }
        }
      }

      // 渲染样式
      let dom, rowStyl, colStyl, rowSet = {}, rowIdx;
      for (let key in states.modifiedMap) {
        dom = table.$el.querySelector('.' + key);

        if (states.modifiedMap.hasOwnProperty(key) && dom) {

          rowStyl = states.modifiedMap[key]['row'] || {};
          colStyl = states.modifiedMap[key]['col'] || {};
          for (let p in colStyl) {
            if (colStyl.hasOwnProperty(p)) {
              dom.parentNode.style[p] = colStyl[p];
            }
          }

          rowIdx = key.replace('row', '').replace(/[a-z]+[a-z0-9]*$/ig, '');
          if (!rowSet[rowIdx] && states.modifiedMap[key]['todo'] === 'set') {
            table.setRowStyle(rowIdx, rowStyl);
            rowSet[rowIdx] = true;
          } else if (!rowSet[rowIdx]) {
            table.setRowStyle(rowIdx, rowStyl);
            rowSet[rowIdx] = false;
          }

        }
      }
    }

  },

  //锁定初始数据用于判定是否为修改
  lockData(states) {
    states.modifiedMap = {};
    if (states.data) {
      states._initialData = JSON.parse(JSON.stringify(states.data));
    }
  },

  setData(states, data) {
    const dataInstanceChanged = states._data !== data;
    states._data = data;
    states.data = sortData((data || []), states);

    this.updateCurrentRow();

    if (!states.reserveSelection) {
      if (dataInstanceChanged) {
        this.clearSelection();
      } else {
        this.cleanSelection();
      }
      this.updateAllSelected();
    } else {
      const rowKey = states.rowKey;
      if (rowKey) {
        const selection = states.selection;
        const selectedMap = getKeysMap(selection, rowKey);

        states.data.forEach((row) => {
          const rowId = getRowIdentity(row, rowKey);
          const rowInfo = selectedMap[rowId];
          if (rowInfo) {
            selection[rowInfo.index] = row;
          }
        });

        this.updateAllSelected();
      } else {
        console && console.warn('WARN: rowKey is required when reserve-selection is enabled.');
      }
    }

    const defaultExpandAll = states.defaultExpandAll;
    if (defaultExpandAll) {
      this.states.expandRows = (states.data || []).slice(0);
    }

    Vue.nextTick(() => this.table.updateScrollY());
  },

  changeSortCondition(states) {
    states.data = sortData((states.filteredData || states._data || []), states);

    this.table.$emit('sort-change', {
      column: this.states.sortingColumn,
      prop: this.states.sortProp,
      order: this.states.sortOrder
    });

    Vue.nextTick(() => this.table.updateScrollY());
  },

  filterChange(states, options) {
    let { column, values, silent } = options;
    if (values && !Array.isArray(values)) {
      values = [values];
    }

    const prop = column.property;
    const filters = {};

    if (prop) {
      states.filters[column.id] = values;
      filters[column.columnKey || column.id] = values;
    }

    let data = states._data;

    Object.keys(states.filters).forEach((columnId) => {
      const values = states.filters[columnId];
      if (!values || values.length === 0) return;
      const column = getColumnById(this.states, columnId);
      if (column && column.filterMethod) {
        data = data.filter((row) => {
          return values.some(value => column.filterMethod.call(null, value, row));
        });
      }
    });

    states.filteredData = data;
    states.data = sortData(data, states);

    if (!silent) {
      this.table.$emit('filter-change', filters);
    }

    Vue.nextTick(() => this.table.updateScrollY());
  },

  insertColumn(states, column, index, parent) {
    let array = states._columns;
    if (parent) {
      array = parent.children;
      if (!array) array = parent.children = [];
    }

    if (typeof index !== 'undefined') {
      array.splice(index, 0, column);
    } else {
      array.push(column);
    }

    if (column.type === 'selection') {
      states.selectable = column.selectable;
      states.reserveSelection = column.reserveSelection;
    }

    this.updateColumns();  // hack for dynamics insert column
    this.scheduleLayout();
  },

  removeColumn(states, column) {
    let _columns = states._columns;
    if (_columns) {
      _columns.splice(_columns.indexOf(column), 1);
    }

    this.updateColumns();  // hack for dynamics remove column
    this.scheduleLayout();
  },

  setHoverRow(states, row) {
    states.hoverRow = row;
  },

  setCurrentRow(states, row) {
    const oldCurrentRow = states.currentRow;
    states.currentRow = row;

    if (oldCurrentRow !== row) {
      this.table.$emit('current-change', row, oldCurrentRow);
    }
  },

  rowSelectedChanged(states, row) {
    const changed = toggleRowSelection(states, row);
    const selection = states.selection;

    if (changed) {
      const table = this.table;
      table.$emit('selection-change', selection);
      table.$emit('select', selection, row);
    }

    this.updateAllSelected();
  },
  // 打开一个，其余全部关闭
  toggleOneRowExpanded: function(states, row, expanded) {
    if (states.expandRows.indexOf(row) === -1) {
      states.expandRows = [];
      states.expandRows.push(row);
    } else {
      states.expandRows = [];
    }
    this.table.$emit('expand', row);
  },

  toggleRowExpanded: function(states, row, expanded) {
    const expandRows = states.expandRows;
    if (typeof expanded !== 'undefined') {
      const index = expandRows.indexOf(row);
      if (expanded) {
        if (index === -1) expandRows.push(row);
      } else {
        if (index !== -1) expandRows.splice(index, 1);
      }
    } else {
      const index = expandRows.indexOf(row);
      if (index === -1) {
        expandRows.push(row);
      } else {
        expandRows.splice(index, 1);
      }
    }
    this.table.$emit('expand', row, expandRows.indexOf(row) !== -1);
  },

  toggleAllSelection: debounce(10, function(states) {
    const data = states.data || [];
    const value = !states.isAllSelected;
    const selection = this.states.selection;
    let selectionChanged = false;

    data.forEach((item, index) => {
      if (states.selectable) {
        if (states.selectable.call(null, item, index) && toggleRowSelection(states, item, value)) {
          selectionChanged = true;
        }
      } else {
        if (toggleRowSelection(states, item, value)) {
          selectionChanged = true;
        }
      }
    });

    const table = this.table;
    if (selectionChanged) {
      table.$emit('selection-change', selection);
    }
    table.$emit('select-all', selection);
    states.isAllSelected = value;
  })
};

const doFlattenColumns = (columns) => {
  const result = [];
  columns.forEach((column) => {
    if (column.children) {
      result.push.apply(result, doFlattenColumns(column.children));
    } else {
      result.push(column);
    }
  });
  return result;
};

TableStore.prototype.updateColumns = function() {
  const states = this.states;
  const _columns = states._columns || [];
  states.fixedColumns = _columns.filter((column) => column.fixed === true || column.fixed === 'left');
  states.rightFixedColumns = _columns.filter((column) => column.fixed === 'right');

  if (states.fixedColumns.length > 0 && _columns[0] && _columns[0].type === 'selection' && !_columns[0].fixed) {
    _columns[0].fixed = true;
    states.fixedColumns.unshift(_columns[0]);
  }
  states.originColumns = [].concat(states.fixedColumns).concat(_columns.filter((column) => !column.fixed)).concat(states.rightFixedColumns);
  states.columns = doFlattenColumns(states.originColumns);
  states.isComplex = states.fixedColumns.length > 0 || states.rightFixedColumns.length > 0;
};

TableStore.prototype.isSelected = function(row) {
  return (this.states.selection || []).indexOf(row) > -1;
};

TableStore.prototype.clearSelection = function() {
  const states = this.states;
  states.isAllSelected = false;
  const oldSelection = states.selection;
  states.selection = [];
  if (oldSelection.length > 0) {
    this.table.$emit('selection-change', states.selection);
  }
};

TableStore.prototype.setExpandRowKeys = function(rowKeys) {
  const expandRows = [];
  const data = this.states.data;
  const rowKey = this.states.rowKey;
  if (!rowKey) throw new Error('[Table] prop row-key should not be empty.');
  const keysMap = getKeysMap(data, rowKey);
  rowKeys.forEach((key) => {
    const info = keysMap[key];
    if (info) {
      expandRows.push(info.row);
    }
  });

  this.states.expandRows = expandRows;
};

TableStore.prototype.toggleRowSelection = function(row, selected) {
  const changed = toggleRowSelection(this.states, row, selected);
  if (changed) {
    this.table.$emit('selection-change', this.states.selection);
  }
};

TableStore.prototype.cleanSelection = function() {
  const selection = this.states.selection || [];
  const data = this.states.data;
  const rowKey = this.states.rowKey;
  let deleted;
  if (rowKey) {
    deleted = [];
    const selectedMap = getKeysMap(selection, rowKey);
    const dataMap = getKeysMap(data, rowKey);
    for (let key in selectedMap) {
      if (selectedMap.hasOwnProperty(key) && !dataMap[key]) {
        deleted.push(selectedMap[key].row);
      }
    }
  } else {
    deleted = selection.filter((item) => {
      return data.indexOf(item) === -1;
    });
  }

  deleted.forEach((deletedItem) => {
    selection.splice(selection.indexOf(deletedItem), 1);
  });

  if (deleted.length) {
    this.table.$emit('selection-change', selection);
  }
};

TableStore.prototype.updateAllSelected = function() {
  const states = this.states;
  const { selection, rowKey, selectable, data } = states;
  if (!data || data.length === 0) {
    states.isAllSelected = false;
    return;
  }

  let selectedMap;
  if (rowKey) {
    selectedMap = getKeysMap(states.selection, rowKey);
  }

  const isSelected = function(row) {
    if (selectedMap) {
      return !!selectedMap[getRowIdentity(row, rowKey)];
    } else {
      return selection.indexOf(row) !== -1;
    }
  };

  let isAllSelected = true;
  let selectedCount = 0;
  for (let i = 0, j = data.length; i < j; i++) {
    const item = data[i];
    if (selectable) {
      const isRowSelectable = selectable.call(null, item, i);
      if (isRowSelectable) {
        if (!isSelected(item)) {
          isAllSelected = false;
          break;
        } else {
          selectedCount++;
        }
      }
    } else {
      if (!isSelected(item)) {
        isAllSelected = false;
        break;
      } else {
        selectedCount++;
      }
    }
  }

  if (selectedCount === 0) isAllSelected = false;

  states.isAllSelected = isAllSelected;
};

TableStore.prototype.scheduleLayout = function() {
  this.table.debouncedLayout();
};

TableStore.prototype.setCurrentRowKey = function(key) {
  const states = this.states;
  const rowKey = states.rowKey;
  if (!rowKey) throw new Error('[Table] row-key should not be empty.');
  const data = states.data || [];
  const keysMap = getKeysMap(data, rowKey);
  const info = keysMap[key];
  if (info) {
    states.currentRow = info.row;
  }
};

TableStore.prototype.updateCurrentRow = function() {
  const states = this.states;
  const table = this.table;
  const data = states.data || [];
  const oldCurrentRow = states.currentRow;

  if (data.indexOf(oldCurrentRow) === -1) {
    states.currentRow = null;

    if (states.currentRow !== oldCurrentRow) {
      table.$emit('current-change', null, oldCurrentRow);
    }
  }
};

TableStore.prototype.commit = function(name, ...args) {
  const mutations = this.mutations;
  if (mutations[name]) {
    mutations[name].apply(this, [this.states].concat(args));
  } else {
    throw new Error(`Action not found: ${name}`);
  }
};

export default TableStore;
