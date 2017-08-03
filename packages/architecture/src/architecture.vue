<template>
  <div class="architecture-tree">
    <canvas class="architecture-canvas"></canvas>
    <architecture-node
      v-for="child in root.childNodes"
      :node="child"
      :props="props"
      :key="getNodeKey(child)"
      :render-content="renderContent">
    </architecture-node>
    <div class="architecture__empty-block" v-if="!root.childNodes || root.childNodes.length === 0">
      <span class="architecture__empty-text">{{ emptyText }}</span>
    </div>
  </div>
</template>
<script>
import ArchitectureNode from './architecture-node';
import ArchitectureStore from './model/architecture-store';
import Adapter from './adapter';
import {t} from 'element-ui/src/locale';

export default{
  name:'Architecture',
  componentName: 'Architecture',
  components:{
     ArchitectureNode
  },
  props:{
    data: {
      type: Array
    },
    props: {
      default() {
        return {
          children: 'children',
          label: 'label',
          icon: 'icon',
          iconClass: 'iconClass'
        };
      }
    },
    emptyText: {
      type: String,
      default() {
        return t('el.tree.emptyText');
      }
    },
    nodeKey: String,
    defaultExpandAll:  {
      type: Boolean,
      default: true
    },
    expandOnClickNode: {
      type: Boolean,
      default: false
    },
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    defaultExpandedKeys: Array,
    renderContent: Function,
    lazy: {
      type: Boolean,
      default: false
    },
    highlightCurrent: Boolean,
    currentNodeKey: [String, Number],
    load: Function,
    filterNodeMethod: Function
  },
  data(){
    return{
      store: null,
      root: null,
      currentNode: null,
      adapter: null
    };
  },
  watch: {
    defaultExpandedKeys(newVal) {
      this.store.defaultExpandedKeys = newVal;
      this.store.setDefaultExpandedKeys(newVal);
    },
    currentNodeKey(newVal) {
      this.store.setCurrentNodeKey(newVal);
    },
    data(newVal) {
      this.store.setData(newVal);
      this.adapter.update();
    }
  },
  methods:{
    filter(value) {
      if (!this.filterNodeMethod) throw new Error('[Tree] filterNodeMethod is required when filter');
      this.store.filter(value);
    },
    getNodeKey(node, index) {
      const nodeKey = this.nodeKey;
      if (nodeKey && node) {
        return node.data[nodeKey];
      }
      return index;
    } 
  },
  created(){
    this.isTree = true;
    this.store = new ArchitectureStore({
        key: this.nodeKey,
        data: this.data,
        props: this.props,
        lazy: this.lazy,
        load: this.load,
        currentNodeKey: this.currentNodeKey,
        defaultExpandedKeys: this.defaultExpandedKeys,
        autoExpandParent: this.autoExpandParent,
        defaultExpandAll: this.defaultExpandAll,
        filterNodeMethod: this.filterNodeMethod
    });
    this.root = this.store.root;
  },
  mounted(){
    this.adapter = new Adapter({el:this.$el});
    this.$on('draw-update', ()=> this.$nextTick(()=>this.adapter.update()));
    this.$nextTick(function(){ this.adapter.update(); });
  }
};
</script>