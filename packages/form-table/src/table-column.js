import { TypeOf } from 'element-ui/src/utils/funcs';
import objectAssign from 'element-ui/src/utils/merge';
import { getValueByPath } from 'element-ui/src/utils/util';

let columnIdSeed = 1;

const defaults = {
  default: {
    order: ''
  },
  selection: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: '',
    className: 'el-table-column--selection'
  },
  expand: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: ''
  },
  index: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: ''
  }
};

// 设置动态选项数据
const setOptionData = function(callOption, row, column, $index, option){
  if(TypeOf(callOption) === 'Function'){
    let opData = callOption.call(column, row, column, $index) || {};
    return objectAssign(option || {}, opData || {});
  }
  return option || {};
};

const forced = {
  selection: {
    renderHeader: function(h) {
      return <el-checkbox
        nativeOn-click={ this.toggleAllSelection }
        value={ this.isAllSelected } />;
    },
    renderCell: function(h, { row, column, store, $index }) {
      return <el-checkbox
        value={ store.isSelected(row) }
        disabled={ column.selectable ? !column.selectable.call(null, row, $index) : false }
        on-input={ () => { store.commit('rowSelectedChanged', row); } } />;
    },
    sortable: false,
    resizable: false
  },
  index: {
    renderHeader: function(h, { column }) {
      return column.label || '#';
    },
    renderCell: function(h, { $index }) {
      return <div>{ $index + 1 }</div>;
    },
    sortable: false
  },
  expand: {
    renderHeader: function(h, {}) {
      return '';
    },
    renderCell: function(h, { row, store }, proxy) {
      const expanded = store.states.expandRows.indexOf(row) > -1;
      return <div class={ 'el-table__expand-icon ' + (expanded ? 'el-table__expand-icon--expanded' : '') }
                  on-click={ () => proxy.handleExpandClick(row) }>
        <i class='el-icon el-icon-arrow-right'></i>
      </div>;
    },
    sortable: false,
    resizable: false,
    className: 'el-table__expand-column'
  },
  manual: {
    renderHeader: function(h, {column}) {  
      return column.label || '';
    },
    renderCell: function(h, data, self) {
       if (self.$scopedSlots.default) {
        return <div>{ self.$scopedSlots.default(data) } </div>;
      }
      return <div>{ self.$slots.default } </div>;
    },
    sortable: false
  },
  operate: {
    renderHeader: function(h, { row, column, store}) {  
      let tableData = store.states.data;
      return (
        <op-box
          isheader = { true }
          delete-visit = { column.deleteVisiable? !!column.deleteVisiable.call(null, tableData) : false  }
          addVisit    = { column.addVisiable? !!column.addVisiable.call(null, tableData) : false }
          saveVisit   = { column.saveVisiable? !!column.saveVisiable.call(null, tableData) : false }
          deleteRow ={ column.deleteRow }
          addRowPre = { column.addRowPre }
          addNewRow ={ column.addNewRow }
          saveRow ={ column.saveRow }
          column ={ column }
          store  ={ store }/>
      );
    },
    renderCell: function(h, { row, column, store, $index}) { 
      let rowIndex = store.states.data.indexOf(row);
      let tableData = store.states.data;
      return (
        <op-box
        deleteVisit = { column.deleteVisiable? !!column.deleteVisiable.call(null, tableData, row, rowIndex) : false  }
        saveVisit   = { column.saveVisiable? !!column.saveVisiable.call(null, tableData, row, rowIndex) : false }
        editVisit = { column.editVisiable? !!column.editVisiable.call(null, tableData, row, rowIndex) : false }
        deleteRow={ column.deleteRow }
        editRow={ column.editRow }
        saveRow ={ column.saveRow }
        row    ={ row }
        column ={ column }
        store  ={ store }
        index  ={ $index }
        disabled={ column.selectable ? !column.selectable.call(null, row, $index) : false } />
      );
    },
    sortable: false
  },
  input: { // 文本框类型
    renderCell: function(h, { row, column, store, $index}, that) {
      let option = column.inputOption || {};
      return (
        <el-input type= { option.type }
          precision={ option.precision }
          roundoff={ option.roundoff }
          histype={ option.histype }
          value={ row[column.property] }
          name= { option.name }
          placeholder= { option.placeholder }
          readonly= { option.readonly }
          maxlength= { option.maxlength }
          minlength= { option.minlength }
          auto-complete= { option.autoComplete }
          autofocus= { option.autofocus }
          min= { option.min }
          max= { option.max }
          form= { option.form }
          disabled={column.editable ? !column.editable.call(null, row, $index) : false }
          onInput={ (val) => { store.commit('colInputChanged', row, column, val, that); }} />
      );
    },
    sortable: false
  },
  rate: { // 文本框百分比千分比类型
    renderCell: function(h, { row, column, store, $index}, that) {
      let option = column.inputOption || {};
      return (
        <rate-number type= { option.type }
          value={ row[column.property] }
          rate={ column.useRate }
          name= { option.name }
          placeholder= { option.placeholder }
          readonly= { option.readonly }
          maxlength= { option.maxlength }
          minlength= { option.minlength }
          autoComplete= { option.autoComplete }
          autofocus= { option.autofocus }
          min= { option.min }
          max= { option.max }
          form= { option.form }
          disabled={column.editable ? !column.editable.call(null, row, $index) : false }
          onInput={ (val) => { store.commit('colInputChanged', row, column, val, that); }} />
      );
    },
    sortable: false
  },
  fnumber: { // 数字格式化
    renderCell: function(h, { row, column, store, $index}, that) {
      let option = column.inputOption || {};
      return (
        <format-number type= { option.type }
          value={ row[column.property] }
          name= { option.name }
          placeholder= { option.placeholder }
          readonly= { option.readonly }
          max= { option.max }
          min= { option.min }
          split= { option.split }
          splitMark= { option.splitMark }
          precision= { option.precision }
          autoComplete= { option.autoComplete }
          autofocus= { option.autofocus }
          min= { option.min }
          max= { option.max }
          form= { option.form }
          disabled={column.editable ? !column.editable.call(null, row, $index) : false }
          onInput={ (val) => { store.commit('colInputChanged', row, column, val, that); }} />
      );
    },
    sortable: false
  },
   labelBtn: { // 标签翻译加按钮类型
    renderCell: function(h, { row, column, store, $index}, that) {
      let option = column.labelOption || {};
      return (
        <button-label
          value={ row[column.property] }
          formatter={ column.formatter }
          dictId= { option.dictId || column.dictId }
          dictParams= { option.dictParams || column.dictParams }
          dictFilter= { option.dictFilter || column.dictFilter }
          tipDisabled={ option.tipDisabled}
          row    ={ row }
          column ={ column }
          store  ={ store }
          index  ={ $index }
          width = { option.width }
          btnIcon = { option.btnIcon }
          btnClicked = { column.labelBtnClicked }
          disabled={column.editable ? !column.editable.call(null, row, $index) : false }
          onInput={ (val) => { store.commit('colInputChanged', row, column, val, that); }} />
      );
    },
    sortable: false
  },
  inputBtn: { // 文本框加按钮类型
    renderCell: function(h, { row, column, store, $index}, that) {
      let option = column.inputBtnOption || {};
      return (
        <button-input type= { option.type }
          value={ row[column.property] }
          formatter={ column.formatter }
          name= { option.name }
          placeholder= { option.placeholder }
          readonly= { option.readonly }
          maxlength= { option.maxlength }
          minlength= { option.minlength }
          autoComplete= { option.autoComplete }
          autofocus= { option.autofocus }
          disInput= { option.disabled }
          min= { option.min }
          max= { option.max }
          form= { option.form }
          row    ={ row }
          column ={ column }
          store  ={ store }
          index  ={ $index }
          btnIcon = { option.btnIcon }
          btnClick = { column.inputBtnClick }
          disabled={column.editable ? !column.editable.call(null, row, $index) : false }
          onInput={ (val) => { store.commit('colInputChanged', row, column, val, that); }} />
      );
    },
    sortable: false
  },
  checkbox: { // 检查类型
      renderHeader: function(h, { column, store }) { 
        if (!store.states.headerChecks.hasOwnProperty(column.property)){
          store.states.headerChecks[column.property] = false;
        }
        return (
          <check-all-box
            value={ store.states.headerChecks }
            headerChecked = { column.headerChecked }
            column ={ column }
            store  ={ store }/>
        );
      },
      renderCell: function(h,  { row, column, store, $index }) {
        let option = column.checkboxOption || {};
        setTimeout(function(){  store.commit('checkAllboxChanged', column); });
          
        return (column.boxStyl && column.boxStyl === 'rich')
          ? <rich-checkbox
            value={ row[column.property] }
            checked = { option.checked }
            name = { option.name }
            trueLabel = { option.trueLabel }
            falseLabel = { option.falseLabel }
            disabled={column.editable ? !column.editable.call(null, row, $index) : false }
            onInput={ (val) => { store.commit('colCheckboxChanged', row, column, val); }}
            onChange ={ (e) => { store.commit('checkAllboxChanged', column); }}>
              { option.marked || row[column.property] }
            </rich-checkbox>
          :<el-checkbox
            value={ row[column.property] }
            checked = { option.checked }
            name = { option.name }
            trueLabel = { option.trueLabel }
            falseLabel = { option.falseLabel }
            disabled={column.editable ? !column.editable.call(null, row, $index) : false }
            onInput={ (val) => { store.commit('colCheckboxChanged', row, column, val); }}
            onChange ={ (e) => { store.commit('checkAllboxChanged', column); }}>
          </el-checkbox>;
      },
    sortable: false
  },
  switch: { // 检查类型
      renderCell: function(h,  { row, column, store, $index }) { 
        let option = column.switchOption || {};
        return (
          <custom-switch
            value={ row[column.property] }
            name = { option.name }
            width = { option.width }
            oIconClass = { option.onIconClass }
            offIconClass = { option.offIconClass }
            oText = { option.onText }
            offText = { option.offText } 
            oColor = { option.onColor } 
            offColor = { option.offColor }
            oValue = { option.onValue } 
            offValue = { option.offValue }
            disabled={column.editable ? !column.editable.call(null, row, $index) : false }
            onInput={ (val) => { store.commit('colSwitchChanged', row, column, val); } }>
          </custom-switch>
        );
      },
    sortable: false
  },
  select: { //select类型
    renderCell: function (h, { row, column, store, $index }, this$1) { 
      // 动态加载Option
      let option = setOptionData(column.setColOption, row, column, $index, column.selectOption);
      return (
        <el-select
          translated = { column.translated === 'select' }
          value={ row[column.property]}
          optionsData={ column.optionsData }
          name = { option.name }
          clearable = { option.clearable }
          filterable = { option.filterable }
          loading = { option.loading }
          remote = { option.remote }
          remoteMethod = { option.remoteMethod }
          filterMethod = { option.filterMethod }
          multiple = { option.multiple }
          placeholder = { option.placeholder }
          disabled={column.editable ? !column.editable.call(null, row, $index) : false }
          onInput={ (val) => { store.commit('colSelectChanged', row, column, val); } }>
          { this$1._l(column.optionsData, (item)=> <el-option value={item.value} label={item.label} />)}
        </el-select>
      );
    },
    sortable: false
  },
  date: { // 日期类型
    renderCell: function(h,  { row, column, store, $index }) { 
      let option = column.dateOption || {};
      let dataType = option.dataType || 'string';
      
      return (
        <el-date-picker
          value={ row[column.property] }
          type = { option.type }
          dataType = { dataType }
          format = { option.format }
          readonly = { option.readonly }
          placeholder = { option.placeholder }
          editable = { option.editable }
          clearable = { option.clearable }
          align = { option.align }
          pickerOptions = { column.pickerOptions }
          disabled={column.editable ? !column.editable.call(null, row, $index) : false }
          onInput={ (val) => { store.commit('colDatePickerChanged', row, column, val); } }>
        </el-date-picker>
      );
    },
    sortable: false
  },
  address: { // 地址类型
    renderCell: function(h,  { row, column, store, $index }) {
      let option = column.addressOption || {};
      return (
        <address-box
          translated = { column.translated === 'address' }
          value = { row[column.property] }
          resdata = { column.addressData }
          dataUrl = { option.dataUrl }
          placeholder = { option.placeholder }
          disabled={column.editable ? !column.editable.call(null, row, $index) : false }
          onInput={ (val) => { store.commit('colAddressChanged', row, column, val); } }>
        </address-box>
      );
    },
    sortable: false
  },
  combobox: { //combobox类型
    renderCell: function (h, { row, column, store, $index }, this$1) {
      // 动态加载Option
      let option = setOptionData(column.setColOption, row, column, $index, column.comboboxOption);
      return (
        <combobox
          value={ row[column.property]}
          dictId = { option.dictId || column.dictId }
          forceRefresh = { option.forceRefresh }
          dictParams = {  option.dictParams || this$1.dictParams}
          dictRowData = { row }
          dictRowCascade = { option.dictRowCascade || false}
          dictRowCascadeMap = { option.dictRowCascadeMap }
          name = { option.name }
          clearable = { option.clearable }
          filterable = { option.filterable }
          loading = { option.loading }
          remote = { option.remote }
          remoteMethod = { option.remoteMethod }
          filterMethod = { option.filterMethod }
          multiple = { option.multiple }
          placeholder = { option.placeholder }
          disabled={column.editable ? !column.editable.call(null, row, $index) : false }
          onInput={ (val) => { store.commit('colSelectChanged', row, column, val); } }>          
        </combobox>
      );
    },
    sortable: false
  }
};

const getDefaultColumn = function(type, options) {
  const column = {};

  objectAssign(column, defaults[type || 'default']);

  for (let name in options) {
    if (options.hasOwnProperty(name)) {
      const value = options[name];
      if (typeof value !== 'undefined') {
        column[name] = value;
      }
    }
  }

  if (!column.minWidth) {
    column.minWidth = 80;
  }

  column.realWidth = column.width || column.minWidth;

  return column;
};

const DEFAULT_RENDER_CELL = function(h, { row, column }) {
  const property = column.property;
  const value = property && property.indexOf('.') === -1
    ? row[property]
    : getValueByPath(row, property);
  if (column && column.formatter) {
    return column.formatter(row, column, value);
  }
  return value;
};

function FnTrue(){ return true; }

export default {
  name: 'FormTableColumn',
  componentName: 'FormTableColumn', 
  props: {
    type: {
      type: String,
      default: 'default'
    },
    label: String,
    className: String,
    labelClassName: String,
    property: String,
    prop: String,
    width: {},
    minWidth: {},
    renderHeader: Function,
    sortable: {
      type: [String, Boolean],
      default: false
    },
    sortMethod: Function,
    resizable: {
      type: Boolean,
      default: true
    },
    context: {},
    columnKey: String,
    align: String,
    headerAlign: String,
    showTooltipWhenOverflow: Boolean,
    showOverflowTooltip: {     // 修改为默认显示提示
      type: Boolean,
      default: true
    },
    fixed: [Boolean, String],
    formatter: Function,
    selectable: Function,
    addVisiable: {                // 隐藏 添加按钮
      type: Function,
      default(){
        return FnTrue;
      }
    }, 
    deleteVisiable: {            // 隐藏 删除按钮 
      type: Function,
      default(){
        return FnTrue;
      }
    } ,            
    saveVisiable: {               // 隐藏 保存按钮 
      type: Function,
      default(){
        return FnTrue;
      }
    } ,              
    editVisiable: {                // 隐藏 动作按钮 
      type: Function,
      default(){
        return FnTrue;
      }
    },
    useRate:{                        // 百分比组件比率类型
      type: String,
      default(){
        return 'percent';
      }
    },
    optionsStore: null,
    setColOption: Function,           // 动态设置列组件选错值
    translated: [Boolean, String],    // 是否翻译，如果翻译组件将消失
    switchOption: Object,             // Switch类型初始化参数
    deleteRow: Function,              // 删除行回调
    editRow: Function,                //编辑行
    addRowPre: Function,              // 添加行前调用
    addNewRow: Function,              // 添加行回调
    saveRow: Function,                 // 保存列表数据
    editable: Function,               // 是否可编辑
    inputOption: Object,              // 文本类型初始化参数
    inputBtnOption: Object,
    labelOption: Object,
    inputBtnClick: Function,
    labelBtnClicked: Function,
    headerChecked: {                  // 表头是否显示 checkbox
      type: Boolean,
      default: false
    },
    boxStyl: String,                  // checkbox 样式风格
    checkboxAllToggle: Function,      // checkbox 全选或反选通知
    checkboxOption: Object,           // 检查类型初始化参数
    checkedSelection: Function,       // 返回 true | false 控制是否选择本行，如未定义而则不关联该功能
    selectOption: Object,             // select类型初始化参数
    comboboxOption: Object,           // combobox类型初始化参数
    dictParams:Object,                // combobox类型下拉框参数
    dictId:String,                    // combobox类型下拉框字典ID
    dictFilter: Boolean,              // 大数据过滤
    optionsData: [Object, Array],     // 初始化select列表数据
    dateOption: Object,               // 日期控件初始化参数
    pickerOptions: Object,            // 日期其他参数
    addressOption: Object,            // 地址类型初始化参数
    addressData: [Object, Array],     // 初始化地址数据
    reserveSelection: Boolean,
    filterMethod: Function,
    filteredValue: Array,
    filters: Array,
    filterPlacement: String,
    filterMultiple: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      isSubColumn: false,
      columns: []
    };
  },

  beforeCreate() {
    this.row = {};
    this.column = {};
    this.$index = 0;
  },

  computed: {
    owner() {
      let parent = this.$parent;
      while (parent && !parent.tableId) {
        parent = parent.$parent;
      }
      return parent;
    }
  },

  created() {
    this.customRender = this.$options.render;
    this.$options.render = h => h('div', this.$slots.default);
    this.columnId = (this.$parent.tableId || (this.$parent.columnId + '_')) + 'column_' + columnIdSeed++;

    let parent = this.$parent;
    let owner = this.owner;
    this.isSubColumn = owner !== parent;

    let type = this.type;

    let width = this.width;
    if (width !== undefined) {
      width = parseInt(width, 10);
      if (isNaN(width)) {
        width = null;
      }
    }

    let minWidth = this.minWidth;
    if (minWidth !== undefined) {
      minWidth = parseInt(minWidth, 10);
      if (isNaN(minWidth)) {
        minWidth = 80;
      }
    }

    let isColumnGroup = false;

    let column = getDefaultColumn(type, {
      id: this.columnId,
      columnKey: this.columnKey,
      label: this.label,
      className: this.className,
      labelClassName: this.labelClassName,
      property: this.prop || this.property,
      type,
      renderCell: null,
      renderHeader: this.renderHeader,
      minWidth,
      width,
      isColumnGroup,
      context: this.context,
      align: this.align ? 'is-' + this.align : null,
      headerAlign: this.headerAlign ? 'is-' + this.headerAlign : (this.align ? 'is-' + this.align : null),
      sortable: this.sortable === '' ? true : this.sortable,
      sortMethod: this.sortMethod,
      resizable: this.resizable,
      showOverflowTooltip: this.showOverflowTooltip || this.showTooltipWhenOverflow,
      formatter: this.formatter,
      selectable: this.selectable,

      translated: this.translated,
      useRate: this.useRate,
      setColOption: this.setColOption,
      textCNWord: '',                          // 默认翻译内容
      addRowPre: this.addRowPre,
      addVisiable: this.addVisiable,                // 隐藏 添加按钮
      deleteVisiable: this.deleteVisiable,          // 隐藏 删除按钮
      saveVisiable: this.saveVisiable,              // 隐藏 保存按钮
      editVisiable: this.editVisiable,          // 隐藏 动作按钮
      switchOption: this.switchOption,          // Switch类型初始化参数
      deleteRow: this.deleteRow,                // 删除行回调
      addNewRow: this.addNewRow,                // 添加行回调
      saveRow: this.saveRow,                    // 保存列表数据
      editRow: this.editRow,                    // 编辑行
      editable: this.editable,                  // 是否可编辑
      inputOption: this.inputOption,            // 文本类型初始化参数
      inputBtnOption: this.inputBtnOption,
      labelOption: this.labelOption,
      labelBtnClicked: this.labelBtnClicked,
      inputBtnClick: this.inputBtnClick,
      headerChecked: this.headerChecked,
      boxStyl: this.boxStyl,
      checkboxAllToggle: this.checkboxAllToggle,
      checkboxOption: this.checkboxOption,      // 检查类型初始化参数
      checkedSelection: this.checkedSelection,  // 返回 true | false 控制是否选择本行，如未定义而则不关联该功能
      selectOption: this.selectOption,          // select类型初始化参数
      optionsData: this.optionsData,            // 初始化select列表数据
      dateOption: this.dateOption,              // 日期控件初始化参数
      pickerOptions: this.pickerOptions, 
      addressOption: this.addressOption,        // 地址类型初始化参数
      addressData: this.addressData,            // 初始化地址数据
      comboboxOption: this.comboboxOption,        // combobox类型初始化参数
      dictParams: this.dictParams,                // combobox下拉框参数
      dictId: this.dictId,                        // combobox下拉框字段ID
      dictFilter: this.dictFilter,                // 大数据过滤

      reserveSelection: this.reserveSelection,
      fixed: this.fixed === '' ? true : this.fixed,
      filterMethod: this.filterMethod,
      filters: this.filters,
      filterable: this.filters || this.filterMethod,
      filterMultiple: this.filterMultiple,
      filterOpened: false,
      filteredValue: this.filteredValue || [],
      filterPlacement: this.filterPlacement || ''
    });

    objectAssign(column, forced[type] || {});

    this.columnConfig = column;

    let renderCell = column.renderCell;
    let _self = this, hiddenExpandIcon = '';

    if (type === 'expand') {
       // 自定义隐藏展开式编辑
      if(this.owner.store.table.expandIconHidden){
        column.realWidth = 1;
        hiddenExpandIcon = 'hidden-expand-icon';
      }
      owner.renderExpanded = function(h, data) {
        return _self.$scopedSlots.default
          ? _self.$scopedSlots.default(data)
          : _self.$slots.default;
      };

      column.renderCell = function(h, data) {
        return <div class={'cell ' + hiddenExpandIcon}>{ renderCell(h, data, this._renderProxy) }</div>;
      };

      return;
    }

    column.renderCell = function(h, data) {
      let {row, column} = data;
      // 未来版本移除
      if (_self.$vnode.data.inlineTemplate) {
        renderCell = function() {
          data._self = _self.context || data._self;
          if (Object.prototype.toString.call(data._self) === '[object Object]') {
            for (let prop in data._self) {
              if (!data.hasOwnProperty(prop)) {
                data[prop] = data._self[prop];
              }
            }
          }
          // 静态内容会缓存到 _staticTrees 内，不改的话获取的静态数据就不是内部 context
          data._staticTrees = _self._staticTrees;
          data.$options.staticRenderFns = _self.$options.staticRenderFns;
          return _self.customRender.call(data);
        };
      } else if (_self.$scopedSlots.default) {
        renderCell = () => _self.$scopedSlots.default(data);
      }

      if (!renderCell) {
        renderCell = DEFAULT_RENDER_CELL;
      }

      return (_self.showOverflowTooltip || _self.showTooltipWhenOverflow) && _self.type === 'default'
        ? <div class="cell el-tooltip" style={'width:' + (data.column.realWidth || data.column.width) + 'px'}>{ renderCell(h, data, _self) }</div>
        : <form-table-item 
             prop={data} 
             value={row[column.property]}>
              { renderCell(h, data, _self) }
          </form-table-item>;
    };
  },

  destroyed() {
    if (!this.$parent) return;
    this.owner.store.commit('removeColumn', this.columnConfig);
  },

  watch: {
    label(newVal) {
      if (this.columnConfig) {
        this.columnConfig.label = newVal;
      }
    },

    prop(newVal) {
      if (this.columnConfig) {
        this.columnConfig.property = newVal;
      }
    },

    property(newVal) {
      if (this.columnConfig) {
        this.columnConfig.property = newVal;
      }
    },

    filters(newVal) {
      if (this.columnConfig) {
        this.columnConfig.filters = newVal;
      }
    },

    filterMultiple(newVal) {
      if (this.columnConfig) {
        this.columnConfig.filterMultiple = newVal;
      }
    },

    align(newVal) {
      if (this.columnConfig) {
        this.columnConfig.align = newVal ? 'is-' + newVal : null;

        if (!this.headerAlign) {
          this.columnConfig.headerAlign = newVal ? 'is-' + newVal : null;
        }
      }
    },

    headerAlign(newVal) {
      if (this.columnConfig) {
        this.columnConfig.headerAlign = 'is-' + (newVal ? newVal : this.align);
      }
    },

    width(newVal) {
      if (this.columnConfig) {
        this.columnConfig.width = newVal;
        this.owner.store.scheduleLayout();
      }
    },

    minWidth(newVal) {
      if (this.columnConfig) {
        this.columnConfig.minWidth = newVal;
        this.owner.store.scheduleLayout();
      }
    },

    fixed(newVal) {
      if (this.columnConfig) {
        this.columnConfig.fixed = newVal;
        this.owner.store.scheduleLayout();
      }
    },

    sortable(newVal) {
      if (this.columnConfig) {
        this.columnConfig.sortable = newVal;
      }
    }
  },

  mounted() {
    const owner = this.owner;
    const parent = this.$parent;
    let columnIndex;

    if (!this.isSubColumn) {
      columnIndex = [].indexOf.call(parent.$refs.hiddenColumns.children, this.$el);
    } else {
      columnIndex = [].indexOf.call(parent.$el.children, this.$el);
    }

    owner.store.commit('insertColumn', this.columnConfig, columnIndex, this.isSubColumn ? parent.columnConfig : null);
  }
};
