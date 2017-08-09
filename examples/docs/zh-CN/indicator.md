<script>
  export default {
    data() {
      return {
        pathData:{
          'zh-CN': { 
            label:'主页',
            children: {
              'component': {
                label:'组件',
                children: {
                  'indicator': {
                    label:'路由指示器'
                  }
                }
              }
            }
          },
          other: {
            label:'主页'
          }
        }
      };
    }
  }
</script>

## Indicator 路由导航路径指示器
```
URL地址必须类似于： http://www.demo.com/index.html#/home/page 格式才能使用
```

### 基础用法

::: demo
```html
<indicator :path-data="pathData"></indicator>

<script>
  export default {
    data() {
      return {
        pathData:{
          'zh-CN': { 
            label:'主页',
            children: {
              'component': {
                label:'组件',
                children: {
                  'indicator': {
                    label:'路由指示器'
                  }
                }
              }
            }
          },
          other: {
            label:'主页'
          }
        }
      };
    }
  }
</script>
```
:::


### Indicator Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
|  path-data  |  路径结构数据      |   Object    |         ——        |     ——  |

 