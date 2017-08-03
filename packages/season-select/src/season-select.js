import Message from 'element-ui/packages/message';
import Season from './season';
import SeasonStore from './season-store';

/**
  数据格式：
  [
    {
      kindCode: 'kind_code',
      periodType: '1',
      season: '1',           //从1开始
      startMonth: '1',       //从1开始
      endMonth: '2'
    },
    ......
  ]

*/

export default {

  name: 'SeasonSelect',

  componentName: 'SeasonSelect',

  components: {
    Season
  },

  props: {

    value: {},

    totalMonths: {         // 最多月份数总和
      type: Number,
      default: 12
    },

    totalLess: {           // 最低月份数总和
      type: Number,
      default: 12
    },

    seasonMonths: {       // 每季最多月份数
      type: Number,
      default: 3
    },
    seasonLess: {         // 每季最少月份数
      type: Number,
      default: 1
    },
    junction: {          // 是否要求月分是连续的
      type: Boolean,
      default: true
    },

    validate: Function,   // 验证用户选择是否通过回调

    labelWidth: {
      type: String,
      default: '60px'
    },

    kindCode: String,      // 类型代称

    periodType: {           // 季周期类型    1：自然季， 2：非自然季-跨年， 3：非自然季-不跨年
      type: [String, Number],
      default: 1
    },

    fields: {               // 返回字段名称设置
      type: Object,
      default() {
        return {
          kindCode: 'kind_code',
          periodType: 'period_type',
          season: 'season',
          startMonth: 'start_month',
          endMonth: 'end_month'
        };
      }
    }
  },

  data() {

    const store = new SeasonStore(this, {
      junction: this.junction,
      periodType: this.periodType,
      kindCode: this.kindCode,
      fields: this.fields,
      seasonMonths: this.seasonMonths,
      seasonLess: this.seasonLess,
      totalMin: this.totalMin,
      totalLess: this.totalLess,
      totalMonths: this.totalMonths
    });

    return {
      store,
      periodTypeNum: 1
    };
  },

  computed: {

    seasons: {
      get() {
        return this.store.states.seasons;
      },
      set(val) {
        this.store.states.seasons = val;
      }
    }
  },

  watch: {

    periodType(n) {
      this.periodTypeNum = n;
      this.store.states.periodType = n;
    },

    kindCode(n) {
      this.store.states.kindCode = n;
    },

    periodTypeNum(n, o) {
      let states = this.store.states;
      this.periodTypeNum = n;

      if (n == 1) {
        this.store.commit('initNatural');
      } else if (n == 2) {
        this.store.setPeriodSeason(states.selectedSeasons, o, true);
        //设置已经存储的值
        this.store.setPeriodSeason(states.selectedSpanSeasons, n);
        this.store.commit('initSeasons', 2);
      } else if (n == 3) {
        // 保存当前值
        this.store.setPeriodSeason(states.selectedSeasons, o, true);
        //设置已经存储的值
        this.store.setPeriodSeason(states.selectedNonSeasons, n);
        // 初始化
        this.store.commit('initSeasons', 3);
      }

    },

    "store.states.periodType"(n) {
      this.periodTypeNum = n;
    },

    value: {
      immediate: true,
      handler(val) {
        this.store.commit('setValue', val);
      }
    },

    fields(n) {
      this.store.commit('setFields', n);
    }
  },

  methods: {

    // 点击月份更新数据
    updateMonthChange(seasons) {
      this.seasons = seasons;
      this.getSelectedValue();
    },

    getSelectedValue() {
      this.$nextTick(function () {
        this.$emit('input', this.store.getSelectedValue());
      });
    },

    // 更新已经选择内容
    updateSelectedValue(val) {
      this.$emit('input', val);
    },

    // 触发验证用户选择是否通过
    validateSelected() {
      this.store.getSelectedValue(true);
    },

    updateSeasonType(typeNum) {
      this.periodTypeNum = typeNum;
      this.$emit('type-change', typeNum);
    },

    // 清除已经选择的月份数据，除自然季
    resetSelected() {
      this.store.commit('reset');
    },

    // 操作提示
    notifyMsg(msg, title, type) {
      Message({ message: msg, type: type || 'warning' });
    }
  },

  mounted() {
    this.store.commit('setFields', this.fields);
  },

  render(h){
    return (
      <div class="season-select">
        {
          this._l(this.seasons, (item, $index)=>[
            <season
              label-width={ this.labelWidth }
              season-index={ $index }
              months={ item }
              store={ this.store }
              period-type={ this.periodTypeNum }>
            </season>
          ])
        }
      </div>
    );
  }
};
