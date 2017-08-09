<script>
  export default {
    data() {
      return {
        input: ''
      };
    }
  }
</script>
## DictLabel 翻译标签

支持在html中翻译下拉框

### 基础用法

::: demo
```html
<dict-label 
  :dict-filter="true" 
  dict-id="riDept" 
  v-model="input">
</dict-label>
 
```
:::


### DictLabel Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| force-refresh | 是否强制刷新      |   Boolean     |          ——         |  false |
|  dict-id    |  字典ID               |   String       |          ——          |   * |
| dict-params |  字典参数             |   Object       |    ——          |   null |
| dict-filter |  是否启用大数据量翻译  |   Boolean   |     ——     |   false
| placeholder |  提示文本信息  |   String   |  ——  |    ——   （display==border时有效） |
| display     |  显示类型  |   String   |     ——     |   default / border |
| width       |  自定义宽度       |   String   |     ——     |    —— |
| clearable   |  是否显示清除 |   Boolean  |  —— | false （display==border时有效） |

```
机构等大量数据需要翻译时dict-filter设置为true，此时不会加载机构全量数据，只翻译页面指定的值
```
