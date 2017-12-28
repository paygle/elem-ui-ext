<template>
  <div class="wrap-route">
    <slot name="before"></slot>
    <div v-bind:is="activeName" :wrap-route="$props"></div>
    <slot name="after"></slot>
  </div>
</template>
<script>
import Vue from 'vue';
import { TypeOf } from 'element-ui/src/utils/funcs';

export default {
  name: 'WrapRoute',
  props:{
    components:{},      // WrapRoute 中使用到的组件
    activeName: String,
    params: null        // 可以是函数也可以是具体值
  },
  created(){
    let type, comp = this.components || {};
    for(let i in comp){
      type = TypeOf(comp[i]);
      if(type === 'Object' || type === 'Function'){
        Vue.component(i, Vue.extend(comp[i]));
      }
    }
  }
};
</script>
