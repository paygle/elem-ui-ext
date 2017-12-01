<script>
  const data = require('../../../examples/assets/waterful.json');
  export default {
    data() {
      return {
        fieldsName: {},
        listdata: data
      };
    },
    methods: {
      CellClick(val){
        console.log('cell-click:', val)
      },
      urltmplFun(code, pcode){
        return "javascript:void(0);"
      }
    }
  }
</script>

## WaterFall 简单数据瀑布流
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
<water-fall
  :fields="fieldsName"
  :data="listdata"
  :urltmpl="urltmplFun"
  @cell-click="CellClick">
</water-fall>

<script>
  export default {
    data() {
      return {
        fieldsName: {},
        listdata: data
      };
    },
    methods: {
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


### WaterFall Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
|   fields      |  自定义字段名        |    Object         |      ——     |   ——   |
|   data        |  列表数据            |    Array          |      ——     |   ——   |
|   colnum      |  列数               |     Number        |      ——      |   4   |
|   gap         |  间隙宽度            |     String        |      ——     |   20px   |
|   urltmpl     |  Url配置回调函数     |    Function       |      ——     |   ——    |
