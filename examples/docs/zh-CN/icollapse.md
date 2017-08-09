<script>
  export default {
    data() {
      return {
        activeNames: ['1']
      };
    }
  }
</script>
## Icollapse 自定义折叠面板
```
与 el-collapse 组件主要区别： 没有自定义面板标题，只能使用 title 属性，其他都一样。
```

### 基础用法

::: demo
```html
<icollapse v-model="activeNames">
  <icollapse-item title="一致性标题" name="1">
    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
  </icollapse-item>
</icollapse>
```
:::


### Icollapse Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
|  right-icon   | 右侧图标是否显示   |  Boolean      |    true      |      —— |
 