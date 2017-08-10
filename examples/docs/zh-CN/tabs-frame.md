<script>
  export default {
    data() {
      return {
        activeName: 'home',
        tabsData:[
          {
            label:'首页',
            name: 'home',
            href: '/#/zh-CN/',
            disabled: false
          },{
            label:'指南',
            name: 'design',
            href: '/#/zh-CN/guide/design',
            disabled: false
          }
        ]
      };
    }
  }
</script>
## TabsFrame (iframe) 选项卡
```
tabsData 格式：
[
  {
    label: String,                // [必填值]选项卡标题
    name: String,                 // [必填值] 与选项卡 activeName 对应的标识符，表示选项卡别名
    icon: 'el-icon-circle-plus',  // [可选值] tab标签上加图标
    href: String,                 // 选项卡对应的组件名称, 请使用url传递简单参数
    closable: Boolean,            // [可选值] 当前选项卡可否关闭
    disabled: Boolean             // [可选值] 当前选项卡状态
  }
]

标签显示优先顺序 activeName -> 可关闭tabs（最后一个） -> 不可关闭（最后一个）
```

### 基础用法

::: demo
```html
<tabs-frame 
  type="card" 
  :tabs-data="tabsData" 
  :active-name="activeName">
</tabs-frame>

<script>
  export default {
    data() {
      return {
        activeName: 'home',
        tabsData:[
          {
            label:'首页',
            name: 'home',
            href: '/#/zh-CN/',
            disabled: false
          },{
            label:'指南',
            name: 'design',
            href: '/#/zh-CN/guide/design',
            disabled: false
          }
        ]
      };
    }
  }
</script>
```
:::

### TabsFrame Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| tabs-data   |  选项卡初始化数据   |    Array     |        ——          |   —— |
|    type   	|      风格类型     	|   string	   | card/strip/border-card | — |
|    href 	  |  iframe 链接地址    |   string	  |      —	      |    -  可添加简单参数 |
|   closable	|   标签是否可关闭    |   boolean	  |      —	|    false |
| active-name	| 选中选项卡的 name 	|   string	   |      —	 |   第一个选项卡的 name |
|  tab-click	| tab 被选中的钩子	  |   Function   |  被选中的标签 tab 实例 参数（panel, event） |
| tab-remove	| tab 被删除的钩子	  |   Function   |  被删除的标签 tab 实例 参数 (tabData, name) |


### 在嵌入进iframe里面的html页面添加如下代码，否则无法自适应高度：
```
<script type="text/javascript">
  /* Tabs-frame 组件中的 iframe 页面内嵌代码仅适用于相同域名下有效，请不要引入跨域链接 */
  function loadUpdate(){
    window.parent && 
    window.parent.parent && 
    window.parent.parent.tabsFrameUpdateCall &&
    window.parent.parent.tabsFrameUpdateCall();
  }
  if (window.attachEvent){ 
    window.attachEvent("onload", loadUpdate); 
  } else { 
    window.onload = loadUpdate; 
  } 
</script>
```