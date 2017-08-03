<template>
  <div class="architecture-node"
    :nodelevel = "node.level"
    @click.stop="handleClick"
    v-show="node.visible"
    :class="{
      'is-expanded': childNodeRendered && expanded,
      'is-current': tree.store.currentNode === node,
      'is-hidden': !node.visible
    }">
    <div class="architecture__content">
      <span
        class="architecture__expand-icon"
        @click.stop="handleExpandIconClick"
        :class="{ 'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded }">
      </span>
      <span
        v-if="node.loading"
        class="architecture__loading-icon el-icon-loading">
      </span>
      <span
        v-if="node.data['iconClass']"
        :class="['self-icon', node.data['iconClass']]">
      </span>
      <node-content :node="node"></node-content>
    </div>

    <div
      class="architecture__children"
      v-show="expanded">
      <architecture-node
        :render-content="renderContent"
        v-for="child in node.childNodes"
        :key="getNodeKey(child)"
        :node="child">
      </architecture-node>
    </div>

  </div>
</template>
<script>
export default{
  name:'ArchitectureNode',
  components:{
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      render(h) {
        const parent = this.$parent;
        const node = this.node;
        const data = node.data;
        const store = node.store;
        return (
          parent.renderContent
            ? parent.renderContent.call(parent._renderProxy, h, { _self: parent.tree.$vnode.context, node, data, store })
            : <span class="architecture-node__label">{ this.node.label }</span>
        );
      }
    }
  },
  props:{
    node: {
        default() {
          return {};
        }
      },
    props: {},
    renderContent: Function
  },
  data(){
    return{
      tree: null,
      expanded: false,
      childNodeRendered: false
    };
  },
  watch: {
    'node.expanded'(val) {
      this.expanded = val;
      if (val) {
        this.childNodeRendered = true;
      }
    }
  },
  methods: {
    getNodeKey(node, index) {
      const nodeKey = this.tree.nodeKey;
      if (nodeKey && node) {
        return node.data[nodeKey];
      }
      return index;
    },

    handleClick() {
      const store = this.tree.store;
      store.setCurrentNode(this.node);
      this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
      this.tree.currentNode = this;
      if (this.tree.expandOnClickNode) {
        this.handleExpandIconClick();
      }
      this.tree.$emit('node-click', this.node.data, this.node, this);
      this.tree.$emit('draw-update');
    },

    handleExpandIconClick() {
      if (this.expanded) {
        this.node.collapse();
      } else {
        this.node.expand();
      }
    }
  },

  created() {  
    const parent = this.$parent;

    if (parent.isTree) {
      this.tree = parent;
    } else {
      this.tree = parent.tree;
    }

    const tree = this.tree;
    if (!tree) {
      console.warn('Can not find node\'s tree.');
    }
    
    const props = tree.props || {};
    const childrenKey = props['children'] || 'children';

    this.$watch(`node.data.${childrenKey}`, () => {
      this.node.updateChildren();
    });

    if (this.node.expanded) {
      this.expanded = true;
      this.childNodeRendered = true;
    }
  }
};
</script>