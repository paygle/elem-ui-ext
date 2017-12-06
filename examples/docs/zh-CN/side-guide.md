<script>
  export default {
    data() {
      return {
        sideData:{
          width: '90px',              
          align: 'center',            
          displaySide: 'right',       
          setGuider: this.setGuider,   
          sideStore: this.siderStore,  
          data: [{
            anchor: 'vehicle',
            index: 123,
            text: '车',
            icon: 'el-icon-car-back',
            hidden: true,                
            list: [
              {
               anchor: 'vehicle',
               index: 3324,
               text: '粤B123545',
               icon: 'el-icon-car-back',
              }
            ],
            operations:[
            {
              action: this.actionSiderVeh,
              index: 6444,
              text: '新增',
              icon: 'el-icon-circle-plus'
            }
            ]
          },
          {
            anchor: 'human',
            index: 6555,
            text: '人',
            icon: 'el-icon-somebody',
            list: [
            {
              anchor: 'human',
              index: 76433,
              text: '李四',
              icon: 'el-icon-somebody'
            }
            ],
            operations:[
            {
              action: this.actionSiderMan,
              index: 64433,
              text: '新增',
              icon: 'el-icon-circle-plus'
            },
            {
              action: this.editSiderMan,
              index: 963,
              text: '修改',
              icon: 'el-icon-vwedit'
            },
            {
              action: this.deleteSiderMan,
              index: 65444,
              text: '删除',
              icon: 'el-icon-circle-cross'
            }
            ]
          }
        ]}
      };
    },
    methods:{
      setGuider(store){
        this.sideGuideStore = store
      },
      siderStore(store){
        console.log('siderStore:', store)
      },
      actionSiderVeh(store, index){
         const newVeh = {
                anchor: 'vehicle',
                text: '粤B123545',
                icon: 'el-icon-car-back'
              }
        this.vehicle = 'vehicle'
        console.log('clicked', index);
        store.commit('addCell', 0, newVeh)      
      },
      actionSiderMan(store, index){
        const newMan = {
                anchor: 'human',
                text: '张三',
                icon: 'el-icon-somebody'
              }
        this.human = 'human'
        console.log('clicked', index);
        store.commit('addCell', 1, newMan);   
      }, 
      editSiderMan(store, index){
        const newMan = {
                anchor: 'human',
                text: '张三丰',
                icon: 'el-icon-somebody'
              }
        this.human = 'human'
        console.log('clicked', index);
        store.commit('editCell', 1,0, newMan);   
      }, 
      deleteSiderMan(store, index){
        console.log('clicked', index);
        store.commit('deleteCell', 1, 0);    
      },
    }
  }
</script>

## SideGuide 侧边菜单导航
 

### 基础用法

::: demo
```html
<div class="fwidth" v-side-guide="sideData">

    ... 你的HTML或组件内容 ...

</div>

<script>
  export default {
    data() {
      return {
        sideData:{
          width: '90px',              
          align: 'center',            
          displaySide: 'right',       
          setGuider: this.setGuider,   
          sideStore: this.siderStore,  
          data: [{
            anchor: 'vehicle',
            index: 123,
            text: '车',
            icon: 'el-icon-car-back',
            hidden: true,                
            list: [
              {
               anchor: 'vehicle',
               index: 3324,
               text: '粤B123545',
               icon: 'el-icon-car-back',
              }
            ],
            operations:[
            {
              action: this.actionSiderVeh,
              index: 6444,
              text: '新增',
              icon: 'el-icon-circle-plus'
            }
            ]
          },
          {
            anchor: 'human',
            index: 6555,
            text: '人',
            icon: 'el-icon-somebody',
            list: [
            {
              anchor: 'human',
              index: 76433,
              text: '李四',
              icon: 'el-icon-somebody'
            }
            ],
            operations:[
            {
              action: this.actionSiderMan,
              index: 64433,
              text: '新增',
              icon: 'el-icon-circle-plus'
            },
            {
              action: this.editSiderMan,
              index: 963,
              text: '修改',
              icon: 'el-icon-vwedit'
            },
            {
              action: this.deleteSiderMan,
              index: 65444,
              text: '删除',
              icon: 'el-icon-circle-cross'
            }
            ]
          }
        ]}
      };
    },
    methods:{
      setGuider(store){
        this.sideGuideStore = store
      },
      siderStore(store){
        console.log('siderStore:', store)
      },
      actionSiderVeh(store, index){
         const newVeh = {
                anchor: 'vehicle',
                text: '粤B123545',
                icon: 'el-icon-car-back'
              }
        this.vehicle = 'vehicle'
        store.commit('addCell', 0, newVeh)      
      },
      actionSiderMan(store, index){
        const newMan = {
                anchor: 'human',
                text: '张三',
                icon: 'el-icon-somebody'
              }
        this.human = 'human'
        store.commit('addCell', 1, newMan);   
      }, 
      editSiderMan(store, index){
        const newMan = {
                anchor: 'human',
                text: '张三丰',
                icon: 'el-icon-somebody'
              }
        this.human = 'human'
        store.commit('editCell', 1,0, newMan);   
      }, 
      deleteSiderMan(store, index){
        store.commit('deleteCell', 1, 0);    
      },
    }
  }
</script>
```
:::

#### 指令 sideData 数据类型详解
```
{

    width: '90px',                     // 菜单宽度

    align: 'left',                     // 文字对齐       left  |  center  |  right

    displaySide: 'left',               // 菜单显示位置   left  |  right

    setGuider: [Function],             // 获取side-guide实例数据对象回调函数 参数(store) 用于暂存对象

    data: [{

      action: actionSider,             // 分类单点击事件回调函数
      anchor: 'vehicle',               // 分类锚点ID，页面中不能有相同的锚点ID
      text: '车',                      // 分类菜单文字
      icon: 'el-icon-car-back',        // 分类菜单字体图标
      hidden: [Boolean],               // 是否隐藏节点 默认 false  仅一级菜单有本属性

      list: [{                         // 子菜单列表数据
        action: actionSider,           // 子菜单点击事件回调函数
        anchor: 'vehicle',             // 子菜单锚点ID，页面中不能有相同的锚点ID
        text: '粤B123545',             // 子菜单文字
        icon: 'el-icon-car-back',      // 子菜单字体图标
      }],

      operations:[{                    // 操作菜单列表数据
        action: actionSiderVeh,        // 操作菜单点击事件回调函数
        text: '新增',                  // 操作菜单文字
        icon: 'el-icon-circle-plus',   // 操作菜单字体图标
      }]

    }]
}
```
 