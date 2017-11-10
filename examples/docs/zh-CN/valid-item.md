<script>
  var emitter = require('../../../lib/mixins/emitter.js').default;
  export default {
    mixins: [emitter],
    data() {
      return {
        obj: {},
        vaItems:{
          name: '这是一段很长很长很长的描述性文字',
          number: ''
        },
        inputRule:{
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          number: [
            { required: true, type: 'number', max: 100, message: '请输入数字', trigger: 'blur' }
          ]
        },
      };
    },
    methods: {
      validateTest(valid){
        console.log('validateTest', valid.state, valid.msg, valid.prop)
      },
      submitValidItems(e){
        this.broadcast('ValidItem', 'valid.item.change')
      },
      resetValidItems(e){
        this.broadcast('ValidItem', 'valid.item.reset')
        this.$message({ message: '重置提示消息', type:'warning'});
      },
    }
  }
</script>

## ValidItem 单个表单组件验证


### 基础用法

::: demo
```html
<div class="valid-items" style="width: 94%; margin: 0 auto">
  <valid-item label="测试1" 
    :model="vaItems.name" 
    @validate="validateTest" 
    prop="name" 
    :rules="inputRule" 
    item-width="200px" 
    label-width="60px">
    <el-input v-model="vaItems.name" placeholder="名字验证"></el-input>
  </valid-item>
  <valid-item label="测试2" 
    :model="vaItems.number" 
    @validate="validateTest" 
    prop="number" 
    :rules="inputRule" 
    item-width="200px"  
    label-width="60px">
    <el-input v-model="vaItems.number" histype='number' precision="2" placeholder="数字验证"></el-input>
  </valid-item>
  <el-button @click="submitValidItems">验证</el-button>
  <el-button @click="resetValidItems">重置</el-button>
</div>

<script>
  export default {
    mixins: [emitter],
    data() {
      return {
        obj: {},
        vaItems:{
          name: '这是一段很长很长很长的描述性文字',
          number: ''
        },
        inputRule:{
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          number: [
            { required: true, type: 'number', max: 100, message: '请输入数字', trigger: 'blur' }
          ]
        },
      };
    },
    methods: {
      validateTest(valid){
        console.log('validateTest', valid.state, valid.msg, valid.prop)
      },
      submitValidItems(e){
        this.broadcast('ValidItem', 'valid.item.change')
      },
      resetValidItems(e){
        this.broadcast('ValidItem', 'valid.item.reset')
        this.$message({ message: '重置提示消息', type:'warning'});
      },
    }
  }
</script>
```
:::

### ValidItem Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| compo-name     | 组件名称   |  String  |    ——  | ValidItem 同名为同一个表单域 |
| model          | 需要验证的绑定对象     | Object |   ——  |    ——   |
| prop           | 需要验证的字段名称   |  String           |     ——      |     ——   |
| rules          | 验证规则            |  Object           |     ——      |    ——   |
| item-width     | 组件宽度            |  String           |     ——      |    ——    |
| label          | 标签字符串          |  String           |     ——      |   ——  |
| label-width    | 标签宽度            |  String           |     ——      |    ——    |
| gap-width      | 标签与输入框间隔     |  String           |     ——      |    0px    |
| label-align    | 标签对齐            |  String           | left/center/right   | right |
| required       | 是否必填            |  Boolean          | true/false  |   false |
| trigger        | 触发函数类型         |  String          |  blur/change |   blur |
| callback       | 验证后回调           |  Function        |      ——      | 参数(message) |
| error          | 错误提示内容         |  String          |      ——      |    ——   |
| show-message   | 是否显示验证消息     |  Boolean         | true/false   |   true |
| display        | 项目默认显示模式     |  String    | inline-block/block  |  inline-block |
| err-styl    | 错误样式设置      |  Object     |   ——    |  ——   |
| valid-trigger  | 触发外部验证函数  |  Function     |   ——    |  ——   |
| compare-styl   | 比较字段设置样式  |  Array     |   ——    |   ——   |

### ValidForm Attributes （仅需要 err-styl、 compare-styl 功能时使用这个组件）

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| model        | 需要验证的绑定对象   |  Object  |   ——  |    ——   |
| rules          | 验证规则            |  Object           |     ——      |    ——   |
| label-width    | 标签宽度            |  String           |     ——      |    ——    |
| show-message   | 是否显示验证消息     |  Boolean         | true/false   |   true |
| err-styl    | 错误样式设置      |  Object     |   ——    |  ——   |
| valid-trigger  | 触发外部验证函数  |  Function     |   ——    |  ——   |
| compare-styl   | 比较字段设置样式  |  Array     |   ——    |   ——   |

### ValidItem Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
|@validate|验证回调事件|({state:'状态', msg:'消息', prop:'字段名'})， state状态 success 或 error|
