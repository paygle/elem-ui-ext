<script>
  export default {
    data () {
 
      const vadlidateRate = function(rule, value, callback, source, options){
        console.log("vadlidateRate value: ", value)
      }

      const vadlidateNumber = function(rule, value, callback, source, options){
        console.log("vadlidateNumber value: ", value)
      }

      return { 
        tableRules: {
          rate: [{ validator: vadlidateRate, trigger: 'blur' }],
          numtest: [{ validator: vadlidateNumber, trigger: 'blur' }]
        },
        tableData: [
          {
            date: '2016-05-03',
            name: 'GGG',
            numtest : 18123456,
            address: '11-1101-110101',
            addressDetail: '上海市普陀区请填写活动形式',
            schecked: '空空的',
            rate: 0.5,
            switch: 0,
            choose: '1'
          },
          {
            date: '2016-05-03',
            name: 'HHH',
            numtest : 12345654.78,
            address: '11-1101-110101',
            addressDetail: '上海市请填写活动',
            schecked: '空空的',
            rate: 0.2,
            switch: 0,
            choose: '1'
          }
        ],
        options: [
          {
            value: '1',
            label: '上海市普陀区上海市普陀区'
          }, {
            value: '2',
            label: '双皮奶'
          }, {
            value: '3',
            label: '蚵仔煎'
          }, {
            value: '4',
            label: '龙须面'
          }, {
            value: '5',
            label: '上海市普陀区普陀区北京烤普陀区北京烤'
          }
        ],
        newRow:{
          date: '2016-05-03',
          name: '',
          numtest : 0,
          address: '上海市',
          addressDetail: '',
          schecked: '空空的',
          switch: 0,
          choose: '1'
        },

        currentPage: 1,
        pageSize: 5,
        itemCount: 30,
        switchOption:{
          onText:'打开',
          offText:'关闭',
          onValue: 1,
          offValue: 0
        },
        inputBtnOption:{
          btnIcon: 'el-icon-menu'
        },
        currentRow: {},
        currentAddBtn:null,
        removeRows:[], 
        newAddRows:[], 
        editRows:[] 
      }
    },

    methods: {
      deletBtn(data, row, rowIndex){
        if(row){
          return true
        }
        return true
      },
      setColOption(row, column, $index){
        console.log("setColOption:",  row, column, $index)
        return {}
      }
    }
  }
</script>
## FormTable 表单表格
FormTable是在 ElTable 组件基础之上扩展的，相应文档请相看 ElTable 组件

### 基础用法

::: demo
```html
<form-table
  :rules="tableRules"
  :data="tableData"
  :new-row="newRow">
  <form-table-column type="expand">
    <template scope="props">
      {{ "名称" + props.row.name }}
      {{ "日期" + props.row.date }}
      {{ "区域" + props.row.address }}
    </template>
  </form-table-column>
  <form-table-column type="selection" width="50" label="选择"></form-table-column>
  <form-table-column type="fnumber" prop="numtest" label="格式化数字" width="100"></form-table-column>
  <form-table-column type="rate" prop="rate" label="比率" width="80"></form-table-column>
  <form-table-column 
    type="select" 
    :options-data="options" 
    :select-option="{filterable:true}"
    :set-col-option="setColOption"
    prop="choose" 
    label="下拉选择">
  </form-table-column>
  <form-table-column type="switch" prop="switch" :switch-option="{onValue:1, offValue:0}" label="切换"></form-table-column>
  <form-table-column label="地址合并">
    <form-table-column prop="addressDetail" label="详细地址" show-overflow-tooltip></form-table-column>
    <form-table-column type="checkbox" prop="schecked" label="可选"></form-table-column>
  </form-table-column>
  <form-table-column type="operate" :delete-visiable="deletBtn" width="110"></form-table-column>
</form-table>

<script>
  export default {
    data () {
 
      const vadlidateRate = function(rule, value, callback, source, options){
        console.log("vadlidateRate value: ", value)
      }
      const vadlidateNumber = function(rule, value, callback, source, options){
        console.log("vadlidateNumber value: ", value)
      }

      return { 
        tableRules: {
          rate: [{ validator: vadlidateRate, trigger: 'blur' }],
          numtest: [{ validator: vadlidateNumber, trigger: 'blur' }]
        },
        tableData: [
          {
            date: '2016-05-03',
            name: 'GGG',
            numtest : 18123456,
            address: '11-1101-110101',
            addressDetail: '上海市普陀区请填写活动形式',
            schecked: '空空的',
            rate: 0.5,
            switch: 0,
            choose: '1'
          },
          {
            date: '2016-05-03',
            name: 'HHH',
            numtest : 12345654.78,
            address: '11-1101-110101',
            addressDetail: '上海市请填写活动',
            schecked: '空空的',
            rate: 0.2,
            switch: 0,
            choose: '1'
          }
        ],
        options: [
          {
            value: '1',
            label: '上海市普陀区上海市普陀区'
          }, {
            value: '2',
            label: '双皮奶'
          }, {
            value: '3',
            label: '蚵仔煎'
          }, {
            value: '4',
            label: '龙须面'
          }, {
            value: '5',
            label: '上海市普陀区普陀区北京烤普陀区北京烤'
          }
        ],
        newRow:{
          date: '2016-05-03',
          name: '',
          numtest : 0,
          address: '上海市',
          addressDetail: '',
          schecked: '空空的',
          switch: 0,
          choose: '1'
        },

        currentPage: 1,
        pageSize: 5,
        itemCount: 30,
        switchOption:{
          onText:'打开',
          offText:'关闭',
          onValue: 1,
          offValue: 0
        },
        inputBtnOption:{
          btnIcon: 'el-icon-menu'
        },
        currentRow: {},
        currentAddBtn:null,
        removeRows:[], 
        newAddRows:[], 
        editRows:[] 
      }
    },

    methods: {
      deletBtn(data, row, rowIndex){
        if(row){
          return true
        }
        return true
      },
      setColOption(row, column, $index){
        console.log("setColOption:",  row, column, $index)
        return {}
      }
    }
  }
</script>
```
:::

#### formTableColumn 支持的类型 
```
  input/ inputBtn/ labelBtn/ rate/ textarea/ checkbox/ switch/ 
  select/ combobox/ date/ address/ operate/ manual

  其中 manual 类型不需要字符超出之后的提示功能时 代替 default 类型
  不使用 form-table-column 组件的 type 属性时，可直接使用 formatter 属性进行列翻译
```

### FormTable Attributes
```
地址全局变量配置： window.COMPONENTS_CONFIG.ADDRESS_DATA_URL
```

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
|  expand-only-one  | 同时仅允许展开一行数据  |  Boolean     |       ——         |  false |
| expand-icon-hidden |   隐藏展开图标         |  Boolean     |       ——         |  false |
|      type         |    对应列的类型        |   String     |        ——         |   支持的类型 |
|    editable       |   当前单元可编辑否     |   Function   |  返回 true或false  |   true，参数(row, index) |
|    new-row        |   新增行初始数据       |   Object     |         null      |    ——  |
|  options-data     |    下拉列表数据        |   Array      |         ——        |    ——   |
| select-option     |     下拉框选项         |   Object     |    与对应组件相同  |    ——  |
| address-data      |   地址选择列表数据     |   Array      |  ——    | 全局配置ADDRESS_DATA_URL |
| address-option    |    地址框选项         |   Object     |    与对应组件相同   |  请查看第三方UI帮助 |
| input-option      |    文本框选项         |   Object     |    与对应组件相同   |    同上 |
| input-btn-option  |   文本框带按钮选项     |   Object     |    与对应组件相同   |    同上 |
| input-btn-click   |   文本框带按钮事件     |   Function   |  ——  | 回调函数参数(row, colname, store) |
| checkbox-option   |    checkbox选项       |   Object     |    与对应组件相同   |   同上 |
| set-col-option    |   动态设置组件选项     |   Function   |  ——  | 回调函数参数(row, col, $index) |
|  box-styl         |  checkbox样式类型     |   String      |     ——    |   rich 或为空（普通样式） |
| checked-selection | checkbox与行选择关联   |   Function   |    与对应组件相同   |   同上  |
|  date-option      |    日期框选项         |   Object      |    与对应组件相同   |   同上  |
|  picker-options   |  时间日期特有的选项    |   Object     |    与对应组件相同   |   同上  |
|  switch-option    |    switch选项         |   Object     |    与对应组件相同   |   同上  |
|  delete-row       | operate类型，删除函数  |   Function   |   ——   | 执行删除后台数据功能回调函数 |
|   save-row        | operate类型，保存函数  |   Function   |   ——   | 执行后台保存数据功能回调函数  |
|  add-row-pre      | operate类型，添加函数  |   Function   |   ——   | 在添加新项之前处理功能回调函数 |
|  add-new-row      | operate类型，添加函数  |   Function   |   ——   | 添加新项的数据返回回调函数 |
|   edit-row        | operate类型，编辑函数  |   Function   |   ——   | 每行数据上单行编辑功能回调函数 |
|  add-visiable     | operate类型，隐藏添加  |   Function   |   ——   | 隐藏添加按钮，处理返回 Boolean |
|  delete-visiable  | operate类型，隐藏删除  |   Function   |   ——   | 隐藏删除按钮，处理返回 Boolean |
|  save-visiable    | operate类型，隐藏保存  |   Function   |   ——   | 隐藏保存按钮，处理返回 Boolean |
|  edit-visiable    | operate类型，隐藏编辑  |   Function   |   ——   | 隐藏编辑按钮，处理返回 Boolean |
| combobox-option   | combobox类型下拉框选项  |   Object   |     与对应组件相同  | -- |
|  dict-params      | combobox类型下拉框参数  |   Object   |     与对应组件相同  | -- |
|  dict-id          | combobox类型下拉框字典ID |   String   |  与对应组件相同    | -- |

```
当在 operate类型时，header头部的操作按钮被全部禁用时，头部自动默认显示 “操作” 二字。
```

#### 在 FormTable 组件上提供以下事件, 不支持直接对数据进行 unshift, reverse 数组操作
```
事件统一参数（row, colName, rowIndex, val, data）
```

#### row 当前行对象，colName 当前列名称，rowIndex 当前第几行数值， val 当前单元格改变后的值，全部表单数据对象

| 事件名称 | 说明  |
|---------|---------|
|table-change| 表格表单中，任何单元格的一个可输入数值发生改变都会触发此事件|
|input-change| 表格表单中所有 input类型，组件任何一个发生改变，则触发此事件|
|check-change| 表格表单中所有 check类型，组件任何一个发生改变，则触发此事件|
|switch-change| 表格表单中所有 switch类型，组件任何一个发生改变，则触发此事件|
|select-change| 表格表单中所有 select类型，组件任何一个发生改变，则触发此事件|
|date-change|  表格表单中所有 date类型，组件任何一个发生改变，则触发此事件|
|address-change| 表格表单中所有 address类型，组件任何一个发生改变，则触发此事件|

#### 组件翻译（支持翻译的组件类型： select/ address），当使用 translated 属性时对应的组件将不再显示只翻译的文本结果
例如：
```
<form-table-column type="select" label="翻译下拉杠" translated="select"></form-table-column>
<form-table-column type="address" label="翻译省市区" translated="address"></form-table-column>
```
#### 以下类型参数请参考： element-ui 对应的组件。

####  input/textarea 类型 inputOption 属性参数支持：
```
  { type, name, placeholder, readonly, maxlength, minlength, autoComplete, autofocus, min, max, form }
  新增属性：  histype 值类型， precision 精度，roundoff 是否四舍五入
```

#### rate 类型 属性使用 inputOption 参数配置支持, 以下是独有属性：
```
  <form-table-column type="rate" prop="percent" use-rate="permillage" label="千分比"> </form-table-column>
  属性 use-rate 默认不填为百分比
```

#### fnumber 数字格式化类型 属性使用 inputOption, 以下是独有属性是基于inputOption参数支持,以下是独有属性：
```
  { split，splitMark，precision }：

  <form-table-column type="fnumber" prop="numtest" label="格式化数字" width="120"></form-table-column>
```

#### inputBtn 类型 inputBtnOption 属性是基于inputOption参数支持,以下是独有属性：
```
  { btnIcon, disabled }

  inputBtn 类型支持 formatter方法如下： 
   <form-table-column type="inputBtn" prop="numtest" :formatter="inputFormatter" label="数字翻译"/>
```

#### labelBtn 类型参数
```
  <form-table-column 
    type="labelBtn" 
    :formatter="labelBtnformatter"
    :label-option="labelBtnOption"
    :label-btn-clicked="labelBtnClicked"
    prop="choose" 
    label="标签选择">
  </form-table-column>

    labelOption包括：
    { 
      dictId:  String,               字典ID
      dictParams:  Object,           下拉框参数
      dictFilter:  Boolean,          大数据过滤
      btnIcon:   String,             按钮Icon
      tipDisabled:  Boolean,         是否禁用自动提示
    }
    column列属性：
    { 
      formatter:  Function,           手动格式化函数， 参数(row, column)
      label-btn-clicked:  Function,   点击图标后回调函数，参数(row, property, store)
      editable:   Function,           是否可编辑返回Boolean，参数(row, index)
      dict-id:  String,               字典ID 与 labelOption内属性一致任选其一
      dict-params:  Object            下拉框参数 与 labelOption内属性一致任选其一
      dict-filter:  Boolean,          大数据过滤
    }
```

#### checkbox 类型 checkboxOption 属性参数支持：
```
  { checked, name, mtrueLabel, falseLabel, marked }

  checkboxOption 的 marked 属性标签显示内容，只有在 box-styl="rich" 时才有效。
  checkbox 类型支持 header-checked 属性，[Boolean]类型，决定是否显示表头全选 checkbox 组件 或 label字符
  :checked-selection属性 [Function] 类型，回调函数返回值为 Boolean，其决定在默认selection选择集中是否选择本行数据；
  :checkbox-all-toggle [Function] 类型，回调函数无返回值，通知使用者是否有全选/反选操作；

  <form-table-column 
     type="checkbox" 
     prop="ck" 
     box-styl="rich"
     :header-checked="true" label="选择"
     :checked-selection="checkedSelection"
     :checkbox-all-toggle="checkboxAllToggle" />
```
#### switch 类型 switchOption 属性参数支持：
```
  { name, width, onIconClass,  offIconClass, onText, offText, onColor, offColor}
```

#### select 下拉选择类型 selectOption 属性参数支持：
```
  { name, clearable, filterable, loading, remote, remoteMethod, filterMethod, multiple, placeholder } 
```

#### date 日期类型 dateOption 属性参数支持：
```
  { format, readonly, placeholder, editable, align }
```

#### address 地址类型 addressOption 属性参数支持：
```
  { dataUrl, placeholder }
```

#### combobox 下拉框类型 comboboxOption 属性(继承selectOption) 参数支持：
```
  { dictId, dictParams, dictRowCascade, dictRowCascadeMap }
```
