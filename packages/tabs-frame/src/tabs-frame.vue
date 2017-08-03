<template>
  <el-tabs
    :type="type"
    :closable="closable"
    v-model="activeTab"
    @tab-click="tabClick"
    @tab-remove="removeTab">
    <el-tab-pane 
      v-for="item in _tabsData" 
      :key="item.name"
      :name="item.name"
      :label="item.label" 
      :disabled="item.disabled"
      :closable="item.closable">
      <span v-if="item.icon" slot="label"><i :class="item.icon"></i> {{item.label}}</span>
      <iframe :src="item.href" :ref="item.name" width="100%" scrolling="no" frameborder="0"></iframe>
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
    closable: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      activeTab: this.activeName,
      _tabsData: []
    };
  },
  watch:{
    tabsData(val){
      this._tabsData = val;
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
    removeTab(targetName) {
      let tabs = this._tabsData;
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
      this._tabsData = tabs.filter(tab => tab.name !== targetName);
      this.$emit('tab-remove', JsonToObject(this._tabsData), targetName);
    },
    goLastActive() {

      this.$nextTick(function(){

        let last, hasTab = false, that = this;
        let disCloseTabs = [], closableTabs = [];
        let tabs = this._tabsData || [];
 
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
    this._tabsData = this.tabsData;
    window.tabsFrameUpdateCall = function() { that.updateFrames(); };
  }
};
</script>
