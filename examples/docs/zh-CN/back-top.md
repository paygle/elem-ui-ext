<script>
  export default {
    data() {
      return {
        input: ''
      };
    },
    methods: {
      backclick(){
        console.log('back top click');
      }
    }
  }
</script>
<style>
  .bk-to-top{
    position: relative;
    background-color: #5d9cec;
    color: white;
    padding: 5px;
    border-radius: 5px;

    &:before{
      content: '';
      position: absolute;
      top: -41px;
      left: 9px;
      width: 0;
      height: 0;
      display: block;
      border: 20px solid transparent;
      border-bottom: 20px solid #5d9cec;
    }
  }
</style>
## BackTop 回顶部

通过鼠标或键盘输入字符

### 基础用法

::: demo
```html
<h3>返回顶部</h3>
<back-top :height="100" :bottom="100" :right="40" @click="backclick">
    <div class="bk-to-top">返回顶端</div>
</back-top>
```
:::


### BackTop Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
|  height   |  页面滚动高度达到该值时才显示BackTop组件 |   Number  | ——       |  100
|  bottom   |  组件距离底部的距离                     |   Number  | ——       |  30
|  right    | 组件距离右部的距离                      |   Number  | ——       |  30
|  duration |  滚动动画持续时间，单位 毫秒             |   Number  | ——       |  500

### BackTop Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| click	 | 点击按钮时触发  |	无