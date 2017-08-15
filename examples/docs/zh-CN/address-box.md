<script>
  const addrdata = require('../../../examples/assets/data/address-data.json');
  export default {
    data() {
      return {
        address: '',
        addrdata: addrdata
      };
    },
    methods: {
      addressChanged(cn){
        console.log('地址改变，返回文字：', cn)
      }
    }
  }
</script>
<style>
  .demo-address {
    width: 180px;
  }
</style>
## AddressBox 地址选择器

通过鼠标或键盘输入字符

### 基础用法

::: demo
```html
 <div class="demo-address">
  <address-box  
      :resdata="addrdata"
      @address-change="addressChanged" 
      v-model="address">
  </address-box>
 </div>
 <script>
  export default {
    data() {
      return {
        address: ''
      };
    },
    methods: {
      addressChanged(cn){
        console.log('地址改变，返回文字：', cn)
      }
    }
  }
</script>
```
:::


### AddressBox Attributes
全局配置对象：window.COMPONENTS_CONFIG.ADDRESS_DATA_URL
| 参数          | 说明            | 类型            | 可选值    | 默认值   |
|------------- |---------------- |---------------- |---------- |---------------- |
|   data-url  | JSON数据URL          |  String    |   ——     |  在全局对象中配置 ADDRESS_DATA_URL 
|   resdata   | JSON地址数据         |  Array      |   ——    |    []
|   disabled  | 禁用组件             |  Boolean    |   ——    |   false
|   params    | change事件自定义参数  |  任何值     |  任何值  |   null
| placeholder | 	占位符             |  String     |   ——    |  请选择
| translated  | 	是否为翻译         |  Boolean     |   ——    |  false
| city-end    | 是否选择到市级结束    |  Boolean     |   ——    |  false

### AddressBox Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
|address-change|当值改变时返回数值对应的中文和参数|{cn:'中文地址', param: '自定义参数'}