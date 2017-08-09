<script>
  export default {
    data() {
      return {};
    }
  }
</script>
## Freeze 冻结窗格

通过鼠标或键盘输入字符

### 基础用法

::: demo
```html
<freeze pos="top" mode="max">
 这是你的代码区
</freeze>
 
```
:::


### Freeze Attributes

| 参数     | 说明            | 类型            | 可选值                 | 默认值   |
|-----------|---------------- |---------------- |---------------------- |-------- |
|    pos  |  冻结区位置    |   String | top/bottom/left/right   |   'top' |
|   mode  |  浮框展开模式  |   String |max/parent|  'max'; 冻结区为top/bottom时有效 |
|   width |  浮框宽|   String| ——   |—— |
|  height |浮框高  |   String| ——   |——  |
|   styl  |  自定义浮框样式 |Object| ——   |   可以覆盖 width/height 属性 |
 