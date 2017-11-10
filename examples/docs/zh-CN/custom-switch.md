<script>
  export default {
    data() {
      return {
        input: ''
      };
    }
  }
</script>
## CustomSwitch 开关

通过鼠标或键盘输入字符

### 基础用法

::: demo
```html
<custom-switch 
  v-model="input" 
  on-value="Y" 
  off-value="N" 
  on-text="Y" 
  off-text="N">
</custom-switch>
```
:::


### 与 el-switch 文档一致，仅用于 form-table 组件中代替 el-switch
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| validItem-name  | valid-item组件域名 |  String   |   ——    |  ValidItem |
