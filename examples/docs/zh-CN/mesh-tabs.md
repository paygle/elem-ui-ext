<script>
  import Vue from 'vue';
  const Pane = Vue.component('Pane', {
    functional: true,
    props:{
      args: null
    },
    render:function(h, ctx){
      let args = ctx.props.args;
      return h('div', ctx.data, ['内容', args]);
    }
  });

  export default {
    data() {
      return {
        activeName: 'pan31',
        tabsComponents:{
          Pane              
        },
        meshTabsData:[           
          {
            label:'第1个',
            icon: 'el-icon-circle-plus',
            name: 'pan1',
            component: 'Pane',
            args:'参数A'
          },{
            label:'第2个',
            name: 'pan2',
            closable: true,
            component: 'Pane',
            args:'参数B'
          },{
            label:'第3--个',
            name: 'pan31',
            
            component: 'Pane',
            args:'参数C'
           }
        ]
      };
    },
    methods: {
      addNewTabs(){                               
        this.meshTabsData.push({
            label:'第3个',
            name: 'pan3',
            component: 'Pane',
            args:'参数QQQ'
          });
          this.activeName = 'pan3'
      },
      tabClick(tab, event){
        console.log('tabClick', tab, event)
      },
      closeCall(delTarget, targetName, filterData){ 
        delTarget(targetName);                     
        this.meshTabsData = filterData             
        console.log('tabRemoveCall', filterData, targetName);
      },
      tabRemove(tabData, name){                  
        this.meshTabsData = tabData             
        this.activeName = "pan1"
        console.log('tabRemove', tabData, name)
      }
    }
  }
</script>
## MeshTabs 组件选项卡


### 基础用法

::: demo
```html
<mesh-tabs
  type="card"
  ref="meshTab"
  :components="tabsComponents"
  @tab-click="tabClick"
  :close-call="closeCall"
  @tab-remove="tabRemove"
  :showLast="false"
  :route-data="meshTabsData"
  :active-name="activeName"></mesh-tabs>
<el-button @click="addNewTabs">增加一个tab</el-button>

<script>
  export default {
    data() {
      return {
        activeName: 'pan31',
        tabsComponents:{
          Pane              
        },
        meshTabsData:[           
          {
            label:'第1个',
            icon: 'el-icon-circle-plus',
            name: 'pan1',
            component: 'Pane',
            args:'参数'
          },{
            label:'第2个',
            name: 'pan2',
            closable: true,
            component: 'Pane',
            args:'参数'
          },{
            label:'第3--个',
            name: 'pan31',
            
            component: 'Pane',
            args:'参数'
           }
        ]
      };
    },
    methods: {
      addNewTabs(){                               
        this.meshTabsData.push({
            label:'第3个',
            name: 'pan3',
            component: 'Pane',
            args:'参数QQQ'
          });
          this.activeName = 'pan3'
      },
      tabClick(tab, event){
        console.log('tabClick', tab, event)
      },
      closeCall(delTarget, targetName, filterData){ // 注意下面两条语句的顺序不能颠倒
        delTarget(targetName);                      // 顺序1. 必须删除对应的tab
        this.meshTabsData = filterData              // 顺序2. tabs 删除功能必须配置这条语句
        console.log('tabRemoveCall', filterData, targetName);
      },
      tabRemove(filterData, name){      // closeCall 和 tabRemove 同时只能选用一个，closeCall优先
        this.meshTabsData = filterData  // tabs 删除功能必须配置这条语句
        this.activeName = "pan1"
        console.log('tabRemove', filterData, name)
      }
    }
  }
</script>
```
:::

```
routeData 格式：
[
  {
    label: String,                // [必填值]选项卡标题
    name: String,                 // [必填值] 与选项卡 activeName 对应的标识符，表示选项卡别名
    icon: 'el-icon-circle-plus',  // [可选值] tab标签上加图标
    component: String,            // 选项卡对应的组件名称
    args:{...},                   // [可选值] 传给对应 component 组件的 props 参数类型根据组件需求设置
    closable: Boolean,            // [可选值] 当前选项卡可否关闭
    disabled: Boolean             // [可选值] 当前选项卡状态
  }
]

重点：在使用<mesh-tabs>的页面中必需引入对应选项卡对应的组件

标签显示优先顺序 activeName -> 可关闭tabs（最后一个） -> 不可关闭（最后一个）
```

### MeshTabs Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| route-data  |  选项卡初始化数据   |    Array     |        ——          |   —— |
| components  |  需要的tabs页组件   |   Object     |        ——          |   —— |
|    type   	|      风格类型     	|  string	    | card/strip/border-card | — |
|   closable	|   标签是否可关闭    |   boolean	  |      —	|    false |
| active-name	| 选中选项卡的 name 	|   string	   |      —	 |   第一个选项卡的 name |
| close-call	| tab关闭前回调函数，用于自定义关闭	|   Function | —	 | (delTarget, targetName, filterData)|

### 事件
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| tab-click	| tab 被选中的钩子	  | 被选中的标签 tab 实例 参数（panel, event） |
| tab-remove	| tab 被删除的钩子，close-call优先本事件	|  参数 (filterData, name) |
