<script>
  export default {
    data() {
      return {
        tableTotalData: [ 
            {
              align: 'center',
              hide: false,
              pos: 1,
              colspan: 2, 
              label: '统计：', 
              value: 20 
            }
        ],
        tableData: [
          {
            date1: '2017-05-03',
            name: '霄爱',
            date2: '2017-1-1',
            region: '加湿器肖霄爱不释手汪珠后年的',
            strnumber: '0001234566.23546',
            addressDetail: '上海市普陀区金沙江路 1518 弄',
            schecked: '空空的',
            choose: '1624'
          },
          {
            date1: '2018-05-03',
            name: '霄爱',
            date2: '2017-1-3',
            region: '不为来后 挑逗粗枝大叶为',
            strnumber: '94566.23546',
            addressDetail: '普陀区金沙江路 ',
            schecked: '空空的',
            choose: '54657'
          }
        ]
      };
    }
  }
</script>
## TableTotal 表格统计
```
仅用于以下组件

<form-table v-table-total="tableTotalData"></form-table>

<el-table v-table-total="tableTotalData"></el-table>

```

### 基础用法

::: demo
```html
<el-table
  v-table-total="tableTotalData"
  :data="tableData"
  border>
  <el-table-column
    prop="date1"
    label="日期1"
    width="120">
  </el-table-column>
  <el-table-column
    prop="name"
    label="姓名">
  </el-table-column>
  <el-table-column
    prop="choose"
    label="选项">
  </el-table-column>
  <el-table-column
    prop="date2"
    label="日期2"
    width="120">
  </el-table-column>
  <el-table-column
    prop="region"
    label="区域">
  </el-table-column>
</el-table>

<script>
  export default {
    data() {
      return {
        tableTotalData: [ 
            {
              align: 'center',
              hide: false,
              pos: 1,
              colspan: 2, 
              label: '统计：', 
              value: 20 
            }
        ],
        tableData: [
          {
            date1: '2017-05-03',
            name: '霄爱',
            date2: '2017-1-1',
            region: '加湿器肖霄爱不释手汪珠后年的',
            strnumber: '0001234566.23546',
            addressDetail: '上海市普陀区金沙江路 1518 弄',
            schecked: '空空的',
            choose: '1624'
          },
          {
            date1: '2018-05-03',
            name: '霄爱',
            date2: '2017-1-3',
            region: '不为来后 挑逗粗枝大叶为',
            strnumber: '94566.23546',
            addressDetail: '普陀区金沙江路 ',
            schecked: '空空的',
            choose: '54657'
          }
        ]
      };
    }
  }
</script>
```
:::

### v-table-total 指令数据结构：tableTotalData
```
  [  
    {
      align: 'center',    // 对齐方式（ left | center | right ）       
      hide: false,        // 是否隐藏这个统计
      pos: 2,             // 统计框所在位置   （从左到右计算列的个数， 默认从1开始）
      colspan: 2,         // 统计框所跨单元格 （以pos起始列开始加上colspan列的个数， 默认从1开始）
      label: '统计',      // 统计框显示名称
      value: 20           // 统计框对应值
    }
    ......                // 统计框个数最多不可超过表的列数
  ]
```