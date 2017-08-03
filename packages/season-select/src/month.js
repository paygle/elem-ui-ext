// Month 
export default {

  name: 'Month',

  componentName: 'Month',

  props: {
    store: Object,
    index: Number,
    seasonIndex: Number,
    status: {        // 状态值： 0 未选中， 1 已选中， -1 禁用
      type: Number,
      default: 0
    }
  },

  computed: {

    statusClass() {
      let className;
      switch (this.status) {
        case 1:
          className = 'actived';
          break;
        case -1:
          className = 'disabled';
          break;
        default:
          className = '';
      }
      return className;
    }

  },

  methods: {
    monthClick(e) {
      this.store.commit('monthClick', this.seasonIndex, this.index, this.status);
    }
  },

  mounted() {
    this.$on('month.change', this.monthStatusChange);
  },

  render(h){
    return (
      <button
        class={ 'month-button ' + this.statusClass }
        on-click={ this.monthClick }>
        { this.$slots.default }
      </button>
    );
  }
};
