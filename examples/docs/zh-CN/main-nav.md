<script>
  export default {
    data() {
      return {
        menusDatas:[    
          { "label" : "案例效果",
            "url" : "index.html",
            "query": '{"id":"3254"}',
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
            "query": '{"id":"3254"}',  
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
  全局配置对象 window.COMPONENTS_CONFIG.MAIN_MENUS

  url属性使用 ~/index.html/#/ 模式可以直接访问网站根目录

  url属性使用 @/index.html/#/ 模式可以在浏览器上打开一个新的页面
```

| 参数          | 说明            | 类型         | 可选值                 | 默认值   |
|-------------  |---------------- |-------------|---------------------- |-------- |
|  menusData |  菜单列表数据        |   Array   |   ——    | MAIN_MENUS 配置|
|  homeHide  |  指示器第一页面隐藏  |   Boolean |   true 或 false    |  false|
 