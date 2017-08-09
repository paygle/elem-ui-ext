<script>
  export default {
    data() {
      return {
        menusDatas:[    
          { "label" : "案例效果",
            "url" : "index.html",    
            "icon" : "",
            "subMenu" : [
              {
                "label" : "分类",
                "url": "index.html/",
                "icon" : "el-icon-circle-rmb",  
                "subMenu" : [ 
                  {
                    "label" : "子首页面",
                    'url': "index.html/home",
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
## MainNav 多页面路由主菜单

通过鼠标或键盘输入字符

### 基础用法

::: demo
```html
<main-nav :menus-data="menusDatas" ></main-nav>

<script>
  export default {
    data() {
      return {
        menusDatas:[    
          { "label" : "案例效果",
            "url" : "index.html",    
            "icon" : "",
            "subMenu" : [
              {
                "label" : "分类",
                "url": "index.html/",
                "icon" : "el-icon-circle-rmb",  
                "subMenu" : [ 
                  {
                    "label" : "子首页面",
                    'url': "index.html/home",
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


### MainNav Attributes
```
全局配置对象 window.ComponentsConfig.MAIN_MENUS 
```

| 参数          | 说明            | 类型         | 可选值                 | 默认值   |
|-------------  |---------------- |-------------|---------------------- |-------- |
|  menusData |  菜单列表数据        |   Array   |   ——    | MAIN_MENUS 配置|
|  homeHide  |  指示器第一页面隐藏  |   Boolean |   true 或 false    |  false|
 