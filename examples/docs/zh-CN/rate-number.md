<script>
  export default {
    data() {
      return {
        input: 0
      };
    }
  }
</script>
## RateNumber 比率（百分比/千分比）
```
其他参数参见 el-input
```

### 基础用法

::: demo
```html
<div style="margin-bottom: 20px;">实际值：<span v-text="input"></span></div>
<rate-number v-model="input" rate="permillage"></rate-number>

<script>
  export default {
    data() {
      return {
        input: 0
      };
    }
  }
</script>
```
:::


### RateNumber Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
|    rate    |    比率类型     |   String     |  percent 或 permillage   |  percent |
|    is-empty     | 是否接收空值，清除为0 |   Boolean    |      ——       |  false  |
| valid-item-name  | valid-item组件域名  |  String     |   ——    |  ValidItem  |
| get-fill-styl   | 获取自定义组件配色  |  Function     |   ——    |   ——   |

### 注意事项
```
  你选择比率类型为percent 时，输入 100实际得到的值是 1， 因此在写验证规则时，应该写 0到1之间的值
```
