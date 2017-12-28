<script>
  import Vue from 'vue';
  const Pane = Vue.component('Pane', {
    functional: true,
    props:{
      args: null
    },
    render:function(h, ctx){
      let args = ctx.props.args;
      return h('div', ctx.data, ['wrap-route 内容', args]);
    }
  });

  export default {
    data() {
      return {
        activeName: 'Pane',
        RouterComponents:{
          Pane
        }
      };
    }
  }
</script>

## WrapRoute 组件选项卡

### 基础用法

::: demo
```html
<wrap-route
  :components="RouterComponents"
  params="yourParams"
  :active-name="activeName">
</wrap-route>

<script>
  export default {
    data() {
      return {
        activeName: 'Pane',
        RouterComponents:{
          Pane
        }
      };
    }
  }
</script>
```
:::

重点：在使用 WrapRoute 时引入需要切换的组件

### WrapRoute Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| components  |  需要切换时的组件       |   Object      |      ——          |   ——   |
| active-name	|  激活的组件名称  	     |   string	     |      ——          |  ——   |
|  params     |可选参数，可以是函数也可以是具体值	|  ——   |      ——          |   ——   |
