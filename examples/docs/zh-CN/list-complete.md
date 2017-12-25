<script>
  export default {
    data() {
      return {
        restaurants: [], 
        state: '',     
        timeout:  null,
      };
    },
    methods:{

      loadAll() {
        return [
          { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
          { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
          { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" },
          { "value": "新麦甜四季甜品炸鸡", "address": "嘉定区曹安公路2383弄55号" },
          { "value": "Monica摩托主题咖啡店", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F" },
          { "value": "浮生若茶（凌空soho店）", "address": "上海长宁区金钟路968号9号楼地下一层" },
          { "value": "NONO JUICE  鲜榨果汁", "address": "上海市长宁区天山西路119号" },
          { "value": "CoCo都可(北新泾店）", "address": "上海市长宁区仙霞西路" },
          { "value": "快乐柠檬（神州智慧店）", "address": "上海市长宁区天山西路567号1层R117号店铺" },
          { "value": "Merci Paul cafe", "address": "上海市普陀区光复西路丹巴路28弄6号楼819" },
          { "value": "猫山王（西郊百联店）", "address": "上海市长宁区仙霞西路88号第一层G05-F01-1-306" },
          { "value": "枪会山", "address": "上海市普陀区棕榈路" },
          { "value": "纵食", "address": "元丰天山花园(东门) 双流路267号" },
          { "value": "钱记", "address": "上海市长宁区天山西路" },
          { "value": "壹杯加", "address": "上海市长宁区通协路" }
        ];
      },

      listRowClick(row){
        this.$refs.listComplete.$emit('item-click', row)
      },

      createStateFilter(queryString) { 
        return (state) => {
          return (state.address.indexOf(queryString.toLowerCase()) === 0);
        };
      },

      querySearchAsync(queryString, callback) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          callback(results);
        }, 1000 * Math.random());
      },

      handleSelect(item) {
        console.log(item);
      }
    },

    mounted(){
      this.restaurants = this.loadAll(); 
    }
  }
</script>
## ListComplete 下拉列表完成

通过鼠标或键盘输入字符

### 基础用法

::: demo
```html
<list-complete
  ref="listComplete"
  v-model="state"
  pop-width="420px"
  prop-name="address"
  :fetch-suggestions="querySearchAsync"
  placeholder="请输入内容，自动建议提示"
  @select="handleSelect">
    <template scope="props">

      <el-table :data="props.data" @row-click="listRowClick">
        <el-table-column prop="value" label="数值"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
      
    </template>
</list-complete>
 
```
:::

```
自定义 template 的数据传值 scope="props", 的建议数据是 props.data
使用 prop-name 属性时筛选过滤方法必须使用（ state.自定义属性名 ）
```

### ListComplete Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
|  tabindex   | Tab键切换次序值    |   Number    |         ——        |      ——     |
|  pop-width     |   建议列表宽度	     |   string      | 	   —        | 	 125px |
|  prop-name     | 自定义筛选字段名称  |    string      |     —       |    value |
| placeholder  |  输入框占位文本	   |   string     |    	—	         |    — |
| disabled	   |     禁用	         |    boolean   |     	—		     |   false |
|  value	     |  必填值输入绑定值  |   string	   |      	—		    |   — |
| fetch-suggestions |  返回输入建议的方法 |  Function(queryString, callback)  | 	—  | 仅当你的输入建议数据 resolve 时，通过调用 callback(data:[]) 来返回它 |
| popper-class |	Autocomplete 下拉列表的类名  |   	string	   |   	—	  |   — |
| trigger-on-focus |  是否在输入框 focus 时显示建议列表	|  boolean	|	—		 |   true |
| on-icon-click	 |  点击图标的回调函数 |   function	  |    —	     	|  — |
|   icon	       |  输入框尾部图标	    |   string      | 	  —        | 	— |
| valid-item-name  | valid-item组件域名  |  String     |   ——    |  ValidItem  |
| get-fill-styl   | 获取自定义组件配色  |  Function     |   ——    |   ——   |

 