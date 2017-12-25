<script>
  export default {
    data() {
      return {
        input: '',
        radioGVal: ''
      };
    }
  }
</script>
<style>
 .sp {
   margin-top: 20px;
 }
</style>
## RichRadio 增强样式 Radio
```
其他参数参考 Radio 文档
```

### 基础用法

::: demo
```html
<div class="sp">单个RichRadio</div>
<rich-radio v-model="input" label="11">RichRadio</rich-radio>
<div class="sp">RichRadioGroup</div>
<rich-radio-group v-model="radioGVal">
  <rich-radio canceled icon="edit" label="43">组选项A</rich-radio>
  <rich-radio canceled label="54" disabled>组选项B</rich-radio>
  <rich-radio canceled label="72">组选项C</rich-radio>
  <rich-radio canceled label="76">组选项C</rich-radio>
</rich-radio-group>

<script>
  export default {
    data() {
      return {
        input: '',
        radioGVal: ''
      };
    }
  }
</script>
```
:::


### RichRadio Attributes （请注意，本工程vue2.3,使该组件取消功能失效，请升级）

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
|  tabindex   | Tab键切换次序值    |   Number    |         ——        |      ——     |
| icon          |   图标样式类名  | String | — | — |
| canceled     | 是否允许取消选择 | Boolean | — | — |  
| valid-item-name  | valid-item组件域名  |  String     |   ——    |  ValidItem  |

 