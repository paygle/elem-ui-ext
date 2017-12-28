<script>
  const data = require('../../../examples/assets/grid-layer.json');
  export default {
    data() {
      return {
        fieldsName: {},
        listdata: data
      };
    },
    methods: {
      favorClick(item){
      console.log('favor-click:', item)
      },
      CellClick(val){
        console.log('cell-click:', val)
      },
      urltmplFun(code, pcode){
        return "javascript:void(0);"
      }
    }
  }
</script>

## GridLayer 简单数据布局流
```
fields 属性 默认字段名称配置
{
  kindNo: 'c_kind_no',
  kindName:'c_kind_name',
  child:'child',
  cellNo: 'c_prod_no',
  cellName: 'c_prod_name'
}
```

### 基础用法

::: demo
```html
<grid-layer
  :fields="fieldsName"
  :data="listdata"
  :urltmpl="urltmplFun"
  @favor-click="favorClick"
  @cell-click="CellClick">
</grid-layer>

<script>
  export default {
    data() {
      return {
        fieldsName: {},
        listdata: data
      };
    },
    methods: {
      favorClick(item){
      console.log('favor-click:', item)
      },
      CellClick(val){
        console.log('cell-click:', val)
      },
      urltmplFun(code, pcode){
        return "javascript:void(0);"
      }
    }
  }
</script>
```
:::


### GridLayer Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
|   fields      |  自定义字段名        |    Object         |      ——     |   ——   |
|   data        |  列表数据            |    Array          |      ——     |   ——   |
|   colnum      |  列数               |     Number        |      ——      |   4   |
|   gap         |  间隙宽度            |     String        |      ——     |   20px   |
|   urltmpl     |  Url配置回调函数     |    Function       |      ——     |   ——    |
|   numshow      |  默认显示条数       |  Number        |      ——     |   5     |
|   trigger      |  弹框触发方式       |  String       |       ——     |  'click'     |
|   placement    |  默认位置           | String     |       ——     | 'top-start'   |
|   ctxHeight    |  panel 内容的高度   |  String     |       ——     |  138px'   |
|   height       |  panel 的高度      |  String    |       ——     |  '208px'   |
