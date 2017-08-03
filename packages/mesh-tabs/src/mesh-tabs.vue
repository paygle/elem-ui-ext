<template>
  <el-tabs
    :type="type"
    :closable="closable"
    v-model="activeTab"
    @tab-click="tabClick"
    @tab-remove="removeTab">
    <el-tab-pane 
      v-for="item in tabData"
      :key="item.name"
      :name="item.name"
      :label="item.label" 
      :disabled="item.disabled"
      :closable="item.closable">
      <span v-if="item.icon" slot="label"><i :class="item.icon"></i> {{item.label}}</span>
      <div :ref="item.name" v-bind:is="item.component" :args="item.args"></div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Vue from 'vue';
import ElTabs from 'element-ui/packages/tabs';
import ElTabPane from 'element-ui/packages/tab-pane';
import Emitter from 'element-ui/src/mixins/emitter';
import { TypeOf, JsonToObject } from 'element-ui/src/utils/funcs';

/* routeData 结构
  [
    {
      label:'用户',
      name: String,
      component: 'main',
      args:{},
      disabled: Boolean
    }
  ]
*/
export default {
  name: 'MeshTabs',
  components:{
    ElTabs,
    ElTabPane
  },
  mixins: [Emitter],
  props:{
    routeData:{
      type: Array,
      default(){
        return [];
      }
    },
    components:{},      // mesh-tabs 中需要使用到的组件
    type: String,
    activeName: String,
    closeCall: Function,    // 关闭 tab 时的回调函数
    closable: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      activeTab: this.activeName,
      tabData: []
    };
  },
  watch:{
    routeData(val){
      this.tabData = val;
      this.goLastActive();
    },
    activeName(val){
      this.activeTab = this.activeName;
    }
  },
  methods:{
    tabClick(panel, e){
      this.$emit('tab-click', panel, e);
      this.broadcast('Architecture', 'draw-update');
    },
    removeTab(targetName) {
      let tabs = this.tabData;
      let activeName = this.activeName;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.activeTab = activeName;
      // 删除处理
      if(typeof this.closeCall === 'function') {
        this.closeCall.call(null, JsonToObject(this.tabData), targetName);
      } else {
        this.tabData = tabs.filter(tab => tab.name !== targetName);
        this.$emit('tab-remove', JsonToObject(this.tabData), targetName);
      }
    },
    goLastActive() {

      this.$nextTick(function(){

        let last, hasTab = false, that = this;
        let disCloseTabs = [], closableTabs = [];
        let tabs = this.tabData || [];
 
        if(tabs.length){
          
          tabs.forEach(function(tab){
            if(tab.name === that.activeName){
              that.activeTab = tab.name;
              hasTab = true;
            }else if(tab.closable){
              closableTabs.push(tab);
            }else{
              disCloseTabs.push(tab);
            }
          });

          if(!hasTab){
            if(closableTabs.length){
              last = closableTabs[closableTabs.length-1];
              if(last.name) this.activeTab = last.name;
            }else if(disCloseTabs.length){
              last = disCloseTabs[disCloseTabs.length-1];
              if(last.name) this.activeTab = last.name;
            }
          }
        }
      });
    }
  },
  created(){
    this.tabData = this.routeData;
    for(let i in this.components){
      if(TypeOf(this.components[i]) === 'Object'){
        Vue.component(i, Vue.extend(this.components[i]));
      }
    }
  }
};
</script>
