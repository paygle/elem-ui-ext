<script>
  export default {
    data() {
      return {
        menusDatas:[    
          { "label" : "案例效果",
            "url" : "/",    
            "icon" : "",
            "subMenu" : [
              {
                "label" : "分类",
                "url": "home/cat",
                "icon" : "el-icon-circle-rmb",  
                "subMenu" : [ 
                  {
                    "label" : "子首页面",
                    'url': "home/page",
                    "icon" : "el-icon-circle-rmb",
                    "subMenu" : []
                  }
                ]
              }
            ]
          }
        ]
      };
    }
  }
</script>
## NavMenus 多页面跳转主菜单

通过鼠标或键盘输入字符

### 基础用法

::: demo
```html
<nav-menus :menus-data="menusDatas" ></nav-menus>

<script>
  export default {
    data() {
      return {
        menusDatas:[    
          { "label" : "案例效果",
            "url" : "/",    
            "icon" : "",
            "subMenu" : [
              {
                "label" : "分类",
                "url": "home/cat",
                "icon" : "el-icon-circle-rmb",  
                "subMenu" : [ 
                  {
                    "label" : "子首页面",
                    'url': "home/page",
                    "icon" : "el-icon-circle-rmb",
                    "subMenu" : []
                  }
                ]
              }
            ]
          }
        ]
      };
    }
  }
</script>
```
:::

### NavMenus Attributes

```
全局配置对象 window.COMPONENTS_CONFIG.MAIN_MENUS 
```

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
|  menusData  |  菜单列表数据 |   Array |   ——     | MAIN_MENUS 配置 |
|  clicked  |  是否启用菜单点击事件|  Boolean |   ——    |  false  默认不触发点击事件 |

### NavMenus Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
|@menu-click|菜单点击事件| (url,label)|