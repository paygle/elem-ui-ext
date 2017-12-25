<script>
  export default {
    data() {
      return {
        input: '',
        checklist: []
      };
    }
  }
</script>
<style>
 .sp {
   margin-top: 20px;
 }
</style>
## RichCheckbox 增强样式Checkbox
```
其他参数参考 Checkbox 文档
```

### 基础用法

::: demo
```html
<div class="sp">单个RichCheckbox</div>
<rich-checkbox v-model="input" icon="hammer">啥都没有</rich-checkbox>
<div class="sp">RichCheckboxGroup组合</div>
<rich-checkbox-group v-model="checklist">
  <rich-checkbox label="你选择了我" disabled></rich-checkbox>
  <rich-checkbox label="啥都没有" icon="hammer"></rich-checkbox>
  <rich-checkbox label="你选了我"></rich-checkbox>
  <rich-checkbox label="啥没有"></rich-checkbox>
</rich-checkbox-group>

<script>
  export default {
    data() {
      return {
        input: '',
        checklist: []
      };
    }
  }
</script>
```
:::


### RichCheckbox Attributes

| 参数          | 说明                    | 类型            | 可选值                 | 默认值   |
|-------------  |------------------------|---------------- |---------------------- |-------- |
|  tabindex   | Tab键切换次序值    |   Number    |         ——        |      ——     |
| icon          |   图标样式类名  | String | — | — |
| valid-item-name  | valid-item组件域名  |  String     |   ——    |  ValidItem  |

 