<template>
  <div class="grid-layer" :style="boxStyl">
    <el-row>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(item, idx) in orgData" :key="idx">
        <grid-panel
          :panel-styl="[panelStyl]"
          :data="item"
          :numshow="numshow"
          :trigger="trigger"
          :placement="placement"
          :ctx-height="ctxHeight"
          :urltmpl="urltmpl"
          :store="store">
        </grid-panel>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Store from './store';
import GridPanel from './panel';
import ElRow from 'element-ui/packages/row';
import ElCol from 'element-ui/packages/col';
import { cssUnitsCalc } from 'element-ui/src/utils/funcs';

export default {

  name: "GridLayer",

  components:{
    GridPanel,
    ElRow,
    ElCol
  },

  props: {
    gap: {                   // 间隙宽度
      type: String,
      default: '20px'
    },
    numshow: {                // 默认显示条数
      type: Number,
      default: 5
    },
    trigger: {                // 弹框触发方式
      type: String,
      default:'click'
    },
    placement: {                // 默认位置
      type: String,
      default:'top-start'
    },
    ctxHeight: {             // panel 内容的高度
      type: String,
      default:'138px'
    },
    height: {                // panel 的高度
      type: String,
      default:'208px'
    },
    urltmpl: Function,        // a 标签模板配置回调函数
    data: Array,              // 列表数据
    fields: Object            // 字段名定义
  },

  data(){
    const store = new Store(this, {
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

    orgData() {
      return this.store.states.data;
    },

    panelStyl(){
      return {
        height: this.height,
        marginLeft: this.gapc,
        marginRight: this.gapc,
        marginTop: cssUnitsCalc('*', this.gapc, 2)
      };
    },

    boxStyl(){
      return { paddingLeft: this.gapc, paddingRight: this.gapc};
    }
  }
};
</script>
