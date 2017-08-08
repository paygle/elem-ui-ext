<script>
  export default {
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        archData:[{
          label: '根节点',
          value: 'A0',
          iconClass: '',
          children: [
            {
              label: '子结点1',
              value: 'A1',
              iconClass: 'el-icon-note-list',
              children: [
                {
                  label: '叶子AAA',
                  value: 'AA1',
                  iconClass: 'el-icon-note-list'
                }
              ]
            },{
              label: '子结点2',
              value: 'B1',
              iconClass: 'el-icon-note-list',
              children: [
                {
                  label: '叶子BB',
                  value: 'BB1',
                  iconClass: 'el-icon-note-list',
                },{
                  label: '批改',
                  value: 'BB2',
                  iconClass: 'el-icon-note-list',
                }
              ]
            },{
              label: '子结点3',
              value: 'C1',
              iconClass: 'el-icon-note-list',
              children: [
                {
                  label: '叶子CC',
                  value: 'CC1',
                  iconClass: 'el-icon-note-list'
                }
              ]
            },{
              label: '子结点4',
              value: 'E1',
              iconClass: 'el-icon-note-list',
              children: [
                {
                  label: '叶子EE',
                  value: 'ee1',
                  iconClass: 'el-icon-note-list',
                }
              ]
            }
          ]
        }]
      };
    },
    methods: {
      handleNodeClick(node) {
        console.log('Architecture点击：', node);
      }
    }
  }
</script>
## Architecture 组织架构图

通过鼠标或键盘输入字符

### 基础用法

::: demo
```html
<architecture
  :data="archData"
  :props="defaultProps"
  @node-click="handleNodeClick">
</architecture>
<script>
  export default {
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        archData:[{
          label: '根节点',
          value: 'A0',
          iconClass: '',
          children: [
            {
              label: '子结点1',
              value: 'A1',
              iconClass: 'el-icon-note-list',
              children: [
                {
                  label: '叶子AAA',
                  value: 'AA1',
                  iconClass: 'el-icon-note-list'
                }
              ]
            },{
              label: '子结点2',
              value: 'B1',
              iconClass: 'el-icon-note-list',
              children: [
                {
                  label: '叶子BB',
                  value: 'BB1',
                  iconClass: 'el-icon-note-list',
                },{
                  label: '批改',
                  value: 'BB2',
                  iconClass: 'el-icon-note-list',
                }
              ]
            },{
              label: '子结点3',
              value: 'C1',
              iconClass: 'el-icon-note-list',
              children: [
                {
                  label: '叶子CC',
                  value: 'CC1',
                  iconClass: 'el-icon-note-list'
                }
              ]
            },{
              label: '子结点4',
              value: 'E1',
              iconClass: 'el-icon-note-list',
              children: [
                {
                  label: '叶子EE',
                  value: 'ee1',
                  iconClass: 'el-icon-note-list',
                }
              ]
            }
          ]
        }]
      };
    },
    methods: {
      handleNodeClick(node) {
        console.log('Architecture点击：', node);
      }
    }
  }
</script>
```
:::


### Architecture Attributes

| 参数          | 说明            | 类型                   | 可选值        | 默认值   |
|-------------  |---------------- |------------------------ |------------ |-------- |
|data	|展示数据|	array|	—|	—
|empty-text|	内容为空的时候展示的文本|	String|	—|	—
|node-key|每个树节点用来作为唯一标识的属性，整颗树应该是唯一的|	String|—|—
|props|配置选项，具体看下表|object|—|—
|load|加载子树数据的方法|function|参数(node, resolve)|—
|render-content|树节点的内容区的渲染函数|Function(h, { node }|—|-
|current-node-key|当前选中节点的 key，只写属性string, number|—|—
|default-expand-all|是否默认展开所有节点|boolean|—|false
|expand-on-click-node|是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点|boolean|—|true
|auto-expand-parent|展开子节点的时候是否自动展开父节点|boolean|—|true
|default-expanded-keys|默认展开的节点的 key 的数组|array|—|—
|filter-node-method|对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏|Function(value, data, node)|—|— 

### props

| 参数          | 说明            | 类型                   | 可选值        | 默认值   |
|-------------  |---------------- |------------------------ |------------ |-------- |
|label|	指定节点标签为节点对象的某个属性值	|string|	—|	—
|children|	指定子树为节点对象的某个属性值|	string|	—|	—

### 方法
| 方法名          | 说明            | 参数                   | 
|-------------  |---------------- |------------------------ |
|filter|对树节点进行筛选操作	接收一个任意类型的参数，该参数会在 filter-node-method 中作为第一个参数|-

### Events

|事件名称|	说明|	回调参数|
|-------------  |---------------- |------------------------ |
|node-click|	节点被点击时的回调	|共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。|

 