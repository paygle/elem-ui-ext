<script>
  export default {
    data() {
      return { 
      };
    }
  }
</script>
## MainHeader 页首

通过鼠标或键盘输入字符

### 基础用法

::: demo
```html

 
```
:::


### MainHeader Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| logo-link  |  logo链接地址         |  String     |   ——     |  static/img/logo.png
|   nowuser  |  当前用户名称         |  String     |   ——     |   匿名 |
|   nowdate  |  当前系统时间         |  Array      |   ——     |   0000-000-000 |
|   editpwd  |  点击修改密码         |  Function   |   ——     |   —— |
|   logout   | 	点击退出             |  Function   |   ——     |   —— |
| click-user | 	点击用户名           |  Function   |   ——     |   —— |
 