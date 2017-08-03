<template>
  <div class="water-fall" :style="boxStyl">
    <div 
      class="water-lane"
      v-for="(lane, index) in orderData" 
      :style="laneStyl"
      :key="index">
      <water-panel
        :panel-styl="[panelStyl]"
        v-for="(item, idx) in lane"
        :key="idx"
        :data="item"
        :urltmpl="urltmpl"
        :store="store">
      </water-panel>
    </div>
  </div>
</template>
<script>
import Store from './store';
import WaterPanel from './panel';
import { cssUnitsCalc } from 'element-ui/src/utils/funcs';

export default {

  name: "WaterFall",

  components:{
    WaterPanel
  },

  props: {
    gap: {                   // 间隙宽度
      type: String,
      default: '20px'
    },
    colnum: {                 // 列数
      type: Number,
      default: 4
    },
    urltmpl: Function,        // a 标签模板配置回调函数
    data: Array,              // 列表数据
    fields: Object            // 字段名定义  
  },

  data(){
    const store = new Store(this, {
      colnum: this.colnum,
      fields: {
        kindNo: 'c_kind_no',
        kindName:'c_kind_name',
        child:'child',
        cellNo: 'c_prod_no',
        cellName: 'c_prod_name'
      }
    });

    return {
      store
    };
  },

  watch:{

    fields(n, o){
      this.store.commit('setFields', n);
    },

    data:{
      immediate: true,
      handler(val){
        this.store.commit('setData', val);
      }
    }

  },

  computed: {

    gapc(){
      return cssUnitsCalc('/', this.gap, 2);
    },

    orderData() {
      return this.store.states.orderData;
    },

    panelStyl(){
      return { 
        marginLeft: this.gapc, 
        marginRight: this.gapc, 
        marginTop: cssUnitsCalc('*', this.gapc, 2)
      };
    },

    laneStyl(){
      return { width: (100/ this.colnum) + '%'};
    },

    boxStyl(){
      return { paddingLeft: this.gapc, paddingRight: this.gapc};
    }

  }
};
</script>