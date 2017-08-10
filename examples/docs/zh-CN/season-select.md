<script>
  export default {
    data() {
      return {
        fieldset:{  
          kindCode: 'kindCode',
          periodType: 'periodType',
          season: 'season',
          startMonth: 'startMonth',
          endMonth: 'endMonth'
        },
        seasonResult: [ 
          {
            kindCode: 'kind_code',
            periodType: '2',
            season: '1',
            startMonth: '10',
            endMonth: '12'
          },{
            kindCode: 'kind_code',
            periodType: '2',
            season: '2',
            startMonth: '13',
            endMonth: '15'
          },{
            kindCode: 'kind_code',
            periodType: '2',
            season: '3',
            startMonth: '16',
            endMonth: '18'
          },{
            kindCode: 'kind_code',
            periodType: '2',
            season: '4',
            startMonth: '19',
            endMonth: '21'
          }
        ],
        reasonChose: 1
      };
    },
    methods:{

      typeChange(val){
        this.reasonChose = parseInt(val)
        console.log('reasonChose Result:', this.reasonChose)
      },

      validateSeason(isValid){
        console.log('validateSeason:', isValid)
      },

      submitSeason(){
        this.$refs.seasonRef.validateSelected()
        console.log('Season submit Valid:', this.seasonResult)
      },

      resetSeason(){
        this.$refs.seasonRef.resetSelected()
      }
    }
  }
</script>
## SeasonSelect 季度选择图


### 基础用法

::: demo
```html
<rich-radio-group v-model="reasonChose">
  <rich-radio :label="1">自然季</rich-radio>
  <rich-radio :label="2">非自然季-跨年</rich-radio>
  <rich-radio :label="3">非自然季-不跨年</rich-radio>
</rich-radio-group>
<season-select
  ref="seasonRef"
  :fields="fieldset"
  v-model="seasonResult"
  :validate="validateSeason"
  kind-code="thisKind"
  @type-change="typeChange"
  :period-type="reasonChose">
</season-select>
<el-button class="confirm-btn" type="primary" @click="submitSeason">确认</el-button>
<el-button class="confirm-btn" type="primary" @click="resetSeason">清除</el-button>

<script>
  export default {
    data() {
      return {
        fieldset:{  
          kindCode: 'kindCode',
          periodType: 'periodType',
          season: 'season',
          startMonth: 'startMonth',
          endMonth: 'endMonth'
        },
        seasonResult: [ 
          {
            kindCode: 'kind_code',
            periodType: '2',
            season: '1',
            startMonth: '10',
            endMonth: '12'
          },{
            kindCode: 'kind_code',
            periodType: '2',
            season: '2',
            startMonth: '13',
            endMonth: '15'
          },{
            kindCode: 'kind_code',
            periodType: '2',
            season: '3',
            startMonth: '16',
            endMonth: '18'
          },{
            kindCode: 'kind_code',
            periodType: '2',
            season: '4',
            startMonth: '19',
            endMonth: '21'
          }
        ],
        reasonChose: 1
      };
    },
    methods:{

      typeChange(val){
        this.reasonChose = parseInt(val)
        console.log('reasonChose Result:', this.reasonChose)
      },

      validateSeason(isValid){
        console.log('validateSeason:', isValid)
      },

      submitSeason(){
        this.$refs.seasonRef.validateSelected()
        console.log('Season submit Valid:', this.seasonResult)
      },

      resetSeason(){
        this.$refs.seasonRef.resetSelected()
      }
    }
  }
</script>
```
:::
### 返回字段名称与属性映射关系
```
  fields:{ 
    kindCode: 'kind_code',
    periodType: 'period_type',
    season: 'season',                 // 值 从 1开始
    startMonth: 'start_month',        // 值 从 1开始
    endMonth: 'end_month'
  }
```

### SeasonSelect Attributes

| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
|   total-months  |  最多月份数总和       |   Number   |    ————      |     12   |
|   total-less    |  最低月份数总和       |   Number   |    ————      |     12   |
|   season-months |  每季最多月份数       |   Number   |    ————      |      3  |
|   season-less   |  每季最少月份数       |   Number   |    ————      |      1  |
|   junction      |  是否月份是连续的     |   Boolean   |    ————     |    true   |
|   validate      |  验证选择是否通过回调 |  Function   |    ————      |   参数(isValid) Boolean |
|   label-width   |  季序号标识宽度       |   String   |    ————      |     '60px' |
|   kind-code     |  类型代称字段值       |   String   |    ————      |    ————  |
|   period-type   |   季周期类型          |   Number   | 1：自然季， 2：非自然季-跨年， 3：非自然季-不跨年 |
|   fields        |  返回字段名称设置     |   String    |    ————      |    ————  |

 