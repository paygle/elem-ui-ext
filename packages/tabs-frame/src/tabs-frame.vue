<template>
  <el-tabs
    :type="type"
    :closable="closable"
    v-model="activeTab"
    @tab-click="tabClick"
    @tab-remove="removeTab">
    <el-tab-pane 
      v-for="item in inTabsData" 
      :key="item.name"
      :name="item.name"
      :label="item.label" 
      :disabled="item.disabled"
      :ref="'pane'+item.name"
      :closable="item.closable">
      <span v-if="item.icon" slot="label"><i :class="item.icon"></i> {{item.label}}</span>
      <iframe :ref="item.name" :src="item.href" width="100%" scrolling="no" frameborder="0"></iframe>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import ElTabs from 'element-ui/packages/tabs';
import ElTabPane from 'element-ui/packages/tab-pane';
import Emitter from 'element-ui/src/mixins/emitter';
import { JsonToObject } from 'element-ui/src/utils/funcs';

/* tabsData 结构
  [
    {
      label:'用户',
      name: String,
      href: 'main.html',
      disabled: Boolean
    }
  ]
*/
export default {
  name: 'TabsFrame',
  components:{
    ElTabs,
    ElTabPane
  },
  mixins: [Emitter],
  props:{
    tabsData:{
      type: Array,
      default(){
        return [];
      }
    },
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
      inTabsData: []
    };
  },
  watch:{
    tabsData(val){
      this.inTabsData = val;
      this.goLastActive();
    },
    activeName(val){
      this.activeTab = this.activeName;
    },
    activeTab(val){
      this.$nextTick(function(){ this.updateFrames(); });
    }
  },
  methods:{
    updateFrames(){
      let iframe = this.$refs[this.activeTab] ? this.$refs[this.activeTab][0] : null;
      let body = iframe ? iframe.contentWindow.document.body : null;
      if(iframe && body) {
        iframe.style.height = Math.max(body.scrollHeight, body.clientHeight) + 20 + 'px';
      }
    },
    tabClick(panel, e){
      this.$emit('tab-click', panel, e);
      this.broadcast('Architecture', 'draw-update');
    },
    delTarget(targetName) {
      // 删除目标对象
      if(this.$refs[targetName]) {
        if(this.$refs[targetName][0] && this.$refs[targetName][0].$destroy) {
          this.$refs[targetName][0].$destroy() ;
          this.$refs[targetName][0] = null;
        } 
        if(this.$refs['pane'+targetName][0]){
          this.$refs['pane'+targetName][0].$destroy();
          this.$refs['pane'+targetName] = null;
        } 
      }
    },
    removeTab(targetName) {
      let tabs = this.inTabsData;
      let activeName = this.activeName;
      let filterData = JsonToObject(tabs.filter(tab => tab.name !== targetName));
  
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
        this.closeCall.call(null, this.delTarget, targetName, filterData);
      } else {
        this.delTarget(targetName);
        this.$emit('tab-remove', filterData, targetName);
      }
    },
    goLastActive() {

      this.$nextTick(function(){

        let last, hasTab = false, that = this;
        let disCloseTabs = [], closableTabs = [];
        let tabs = this.inTabsData || [];
 
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

  beforeDestroy(){
    delete window.tabsFrameUpdateCall;
  },

  created(){
    let that = this;
    this.inTabsData = this.tabsData;
    window.tabsFrameUpdateCall = function() { that.updateFrames(); };
  }
};
</script>
