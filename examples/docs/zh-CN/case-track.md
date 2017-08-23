<script>
  import Vue from 'vue';
  const myItem = Vue.component('my-item', {
    functional: true,
    render: function(h){
      return '显示内容';
    }
  });
 
  export default {
    data() {
      return {
        templComponents:{
          myItem
        },
        mapData: [
          {
            shapeIcon: 'el-icon-fixed-pos',
            nextLevel: 1,
            title: '报案',
            placement: 'left',
            status: 'unreceived'
          },{
            lanes: [
              {
                args: {name:"我的参数"},
                title: '单证收集',
                label: '标的车车损 粤K00001',
                nextLevel: 1,
                placement: 'top',
                status: 'processing',
                nodes: [
                  {
                    args: {name:"我的参数"},
                    title: '定损派工',
                    nextLevel: 1,
                    status: 'processing'
                  }
                ]
              },
              {
                args: {name:"我的参数"},
                title: '单证收集',
                label: '标的车车损 粤K00001',
                nextLevel: 1,
                placement: 'top',
                status: 'processing',
                nodes: [
                  {
                    args: {name:"我的参数"},
                    title: '车辆定损',
                    status: 'complete'
                  }
                ]
              }
            ]
          },
          {
            args: {name:"我的参数"},
            title: '归档',
            status: 'complete'
          }
        ]
      };
    },
    methods:{
      loadingData(){
        this.mapData  = this.caseMapData
      },
      itemClick(data){
        console.log('Item click:', data)
      },
      iconClick(data){
        console.log('icon click:', data)
      },
      getComponetName(args){
        console.log('getComponetName', args)
        return "myItem"
      },
      getComponetData(args){
        console.log('getComponetData', args)
        let yy = [{cop:'AA', dat: 'BB'}, {cop:'xx', dat: 'yy'}]
        if(Math.random()> 0.5){
          return yy[0]
        }
        return yy[1]
      }
    }
  }
</script>
## CaseTrack 案件跟踪图

通过鼠标或键盘输入字符

### 基础用法

::: demo
```html
 <case-track 
  :get-componet-name="getComponetName"
  :get-componet-data="getComponetData"
  :map-data="mapData" 
  @item-click="itemClick" 
  @icon-click="iconClick"
  :components="templComponents">
</case-track>

```
:::


### CaseTrack Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
|  status-icons |  状态图标指定对象                  |   Object   |   ——       |  —— 
|  relative-dom |  图形宽度自动调整关联节点           |   String   |   ——       |  body|
|  components   |  需要使用到的弹窗模板组件            |   Object   |    ——      |  ——  |
|  get-componet-name |  获取弹出窗口当前的模板名称    |  Function  |   ——       |  必需返回 String| 
|  get-componet-data |  获取弹出窗口当前初始化数据    |  Function  |    ——      |  返回，根据模板需要|
|  map-data    |  流程图数据                         |   Array    |   ——       |  30|
|  item-width   |  节点内容宽度                       |   Number   |   ——       |  128|
|  line-color  |  流程图线条颜色                     |   String   |   ——       |  #ccc|
|  right-panel-width |  右侧固定面板宽度             |   Number    |   ——       |  80|
|  has-more-icon  |   拥有二级页面时的提示图标        |  String     |   ——       |  el-icon-menu|
|  lane-pop-disabled  |  禁用lane弹出面板            |  Boolean    |    ——      |  false|
|  item-pop-disabled  |  禁用节点弹出面板            |   Boolean   |    ——      |  false|
|  placement  |  弹出框出现位置全局设置  | String |  默认值left | 可选值 top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end|

#### statusIcons 状态图标数据格式
```
{
  unreceived: "el-icon-circle-hook",      // 未接收状态图标
  untriggered: "el-icon-circle-hook",     // 未触发状态图标 
  processing: "el-icon-cir-caution",      // 处理中状态图标
  complete: "el-icon-timex",              // 已完成状态图标
  terminated: "el-icon-circle-l-arrow"    // 已终结状态图标
}
```

#### mapData 数据元描述

| 参数          | 类型            |  说明                 | 
|-------------  |---------------- |---------------------- |
| shapeIcon| [String] | 节点转化的图标表示字符串|
| args| [任意值] | 结点弹出模板参数对象|
| title| [String] |节点中文名称： 可以在文字中添加 <br> 标签表示换行|
|status| [String] |结点状态:  已处理 complete  处理中 processing  未接收 unreceived  已终止 terminated  未触发 untriggered|
|nextLevel| [0,1] |  是否显示二级点击图标|
|lanes| [Array] |组分支集合： 内部包括N个 lane|

### CaseTrack Events

| 事件名         |	说明	         | 返回值          |
|-------------  |----------------|-----------------|
| @item-click   |  节点点击事件   |  { node:node, event:e }|
| @icon-click   |  节点点击事件   |  { node:node, event:e }|
 