import Node from './node';
import { getNodeKey } from './util';

export default class ArchitectureStore {

  constructor(options){
    this.currentNode = null;
    this.currentNodeKey = null;

    for (let option in options) {
      if (options.hasOwnProperty(option)) {
        this[option] = options[option];
      }
    }

    this.nodesMap = {};

    this.root = new Node({
      data: this.data,
      store: this
    });

  }

  filter(value) {
    const filterNodeMethod = this.filterNodeMethod;
    const traverse = function(node) {
      const childNodes = node.root ? node.root.childNodes : node.childNodes;

      childNodes.forEach((child) => {
        child.visible = filterNodeMethod.call(child, value, child.data, child);

        traverse(child);
      });

      if (!node.visible && childNodes.length) {
        let allHidden = true; 

        childNodes.forEach((child) => {
          if (child.visible) allHidden = false;
        });

        if (node.root) {
          node.root.visible = allHidden === false;
        } else {
          node.visible = allHidden === false;
        }
      }

      if (node.visible && !node.isLeaf) node.expand();
    };

    traverse(this);
  }

  setData(newVal) {
    this.root.setData(newVal);
  }

  getNode(data) {
    const key = typeof data !== 'object' ? data : getNodeKey(this.key, data);
    return this.nodesMap[key];
  }

  insertBefore(data, refData) {
    const refNode = this.getNode(refData);
    refNode.parent.insertBefore({ data }, refNode);
  }

  insertAfter(data, refData) {
    const refNode = this.getNode(refData);
    refNode.parent.insertAfter({ data }, refNode);
  }

  remove(data) {
    const node = this.getNode(data);
    if (node) {
      node.parent.removeChild(node);
    }
  }

  append(data, parentData) {
    const parentNode = parentData ? this.getNode(parentData) : this.root;

    if (parentNode) {
      parentNode.insertChild({ data });
    }
  }

  registerNode(node) {
    const key = this.key;
    if (!key || !node || !node.data) return;

    const nodeKey = node.key;
    if (nodeKey) this.nodesMap[node.key] = node;
  }

  deregisterNode(node) {
    const key = this.key;
    if (!key || !node || !node.data) return;

    delete this.nodesMap[node.key];
  }

  _getAllNodes() {
    const allNodes = [];
    const nodesMap = this.nodesMap;
    for (let nodeKey in nodesMap) {
      if (nodesMap.hasOwnProperty(nodeKey)) {
        allNodes.push(nodesMap[nodeKey]);
      }
    }

    return allNodes;
  }

  setDefaultExpandedKeys(keys) {
    keys = keys || [];
    this.defaultExpandedKeys = keys; 

    keys.forEach((key) => {
      const node = this.getNode(key);
      if (node) node.expand(null, this.autoExpandParent);
    });
  }

  getCurrentNode() {
    return this.currentNode;
  }

  setCurrentNode(node) {
    this.currentNode = node;
  }

  setCurrentNodeKey(key) {
    const node = this.getNode(key);
    if (node) {
      this.currentNode = node;
    }
  }
};
