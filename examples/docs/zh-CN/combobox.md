<script>
  export default {
    data() {
      return {
        bank: ''
      };
    }
  }
</script>
## Combobox 下拉翻译框
复制了一份el-select的源码，修改实现以下功能
1.使用dict-id来加载指定codelist字典id，字典加载数据
2.异步加载
3.带参数的下拉框，级联（级联时自动清除子级下拉框值）

### 基础用法

::: demo
```html
<combobox v-model="bank" :dict-id="'bank'" clearable placeholder="请选择"></combobox>
 
```
:::


### Combobox Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
|  dict-id    |  字典ID               |   String       |          ——          |   *
| dict-params |  字典参数             |   Object       |          ——          |   null |
| force-refresh |  强制每次自动刷新    |   Boolean      |          ——          |   false |
| dict-row-data |  下拉框在行编辑中时的行数据    |   Object      |       ——    |   null |
| dict-row-cascade |  在行编辑中时参数是否级联本行的数据  | Boolean  | —— |  false |
| dict-row-cascade-map |  行编辑级联时的参数映射关系    |   Object      |    —— |  null |
| auto-select-first |  是否默认选中第一项    |   Boolean      |    —— |      false |
| readonly       | 	是否只读             |  Boolean     |   ——    |  false |
| validItem-name  | valid-item组件域名         |  String     |   ——    |  ValidItem |
| tip-disabled    | 是否禁用提示      |  Boolean     |   ——    |  false |
| get-fill-styl   | 获取自定义组件配色  |  Function     |   ——    |   —— |
| options-data   | Option初始化数据         |  Array     |   ——    |  —— |
| translated     | 是否变成翻译组件      |  Boolean     |   ——    |  false |
| page-size     | 分页每页显示数量  |  Number     |   ——    |   30 |



其他参数参见el-select

#### 修改说明
```
  在原有el-select的基础上扩充了6个prop
  1.dictId 数据字典ID
  2.dictParams 数据字典参数（默认为空，绑定一个computed的字段对象）
  3.forceRefresh 是否强制刷新（默认false），true时每次点击下拉框都强制请求后台
```

#### 以下3个prop用于行编辑时级联
```
  4.dictRowData 下拉框在行编辑中时的行数据
  5.dictRowCascade 下拉框在行编辑中时参数是否级联本行的数据
  6.dictRowCascadeMap  行级联时的参数映射关系
```

#### data扩充了2个字段
```
1.comboItems:[] 下拉框数据
2.comboLoading:false  是否加载后台数据
```

#### watch监听增加comboLoading和dictParams，当值改变时自动加载下拉框选项

### ComboTableColumn 表格下拉框翻译组件
```
复制了一份table/table-column的源码，修改实现以下功能
1.使用dict-id来加载指定codelist字典id，翻译表格中的下拉框代码
2.异步加载
```

### ComboTableColumn Attributes

|     参数    |     说明	          |   类型 	      |         可选值	      |  默认值
|------------|---------------------|---------------|---------------------|-------- |
|  dict-id    |  字典ID               |   String       |        ——      |   * |
| dict-params |  字典参数             |   Object       |          ——     |   null |
| dict-filter |  是否启用大数据量翻译  |   Boolean   |     ——     |   false |

```
机构等大量数据需要翻译时dict-filter设置为true，此时不会加载机构全量数据，只翻译页面指定的值
其他参数参见table-column
```
