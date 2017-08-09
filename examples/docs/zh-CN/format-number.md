<script>
  export default {
    data() {
      return {
        input: ''
      };
    }
  }
</script>
## FormatNumber 格式化输入框

通过鼠标或键盘输入字符

### 基础用法

::: demo
```html
<format-number 
  v-model="input" 
  placeholder="请输入数字">
</format-number>
 
```
:::


### FormatNumber Attributes
```
数字最大不能过16位，否则多余位数补零结果错误
```

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
|  placeholder    |  装饰符号           |   String     |      ——       |    ——  |
|   readonly      |  装饰符号颜色       |   Boolean     |     ——       |   false |
|   disabled      |  是否显示装饰符     |   Boolean    |       ——      |   false |
|    max          |    最大值           |   Number     |      ——       |    ——   |
|    min          |    最小值           |   Number     |      ——       |    ——   |
|    split        |  分隔位数           |   Number     |      ——       |    3 |
|    splitMark    |  分隔符号           |   String     |      ——       |    , |
|    precision    |   精度              |   Number     |      ——       |    2 |
 