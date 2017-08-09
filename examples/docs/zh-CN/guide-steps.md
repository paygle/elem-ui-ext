<script>
  export default {
    data() {
      return {
        active: 1
      };
    },
    methods: {
      currentStep(step){ 
        console.log('Step:', step)
      }
    }
  }
</script>
## GuideSteps 步骤条

通过鼠标或键盘输入字符

### 基础用法

::: demo
```html
<guide-steps 
  :active="active"
  line-styl="dotline"
  :current-step="currentStep" 
  finish-status="success">
    <guide-step title="步骤 1" description="这是一段描述性文字这是一段描述性文字"></guide-step>
    <guide-step title="步骤 2" description="这是一段描述性文字这是一段描述性文字"></guide-step>
    <guide-step title="步骤 3" description="这是一段描述性文字这是一段描述性文字"></guide-step>
</guide-steps>

<guide-steps 
  :active="2" 
  line-styl="dotline" 
  direction="vertical" 
  :current-step="currentStep" 
  finish-status="success">
  <guide-step title="步骤 1" description="这是一段很长很长很长的描述性文字"></guide-step>
  <guide-step title="步骤 2" description="这是一段很长很长很长的描述性文字"></guide-step>
  <guide-step title="步骤 3" description="这是一段很长很长很长的描述性文字"></guide-step>
</guide-steps>

<script>
  export default {
    data() {
      return {
        active: 1
      };
    },
    methods: {
      currentStep(step){ 
        console.log('Step:', step)
      }
    }
  }
</script>
```
:::


### GuideSteps Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| current-step   | 当前激活回调函数  |  Function     |    ——     |   参数(step)|
| line-styl      | 线条样式         |  String       |  default  |  支持 default | dotline 两种样条|

```
其他参数参考 el-steps
```

### GuideSteps Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
|@node-click | 节点点击事件 | 参数(index)|
