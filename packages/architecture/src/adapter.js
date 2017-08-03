/* Architecture 样式自适应 */
import {
  setStyle
} from 'element-ui/src/utils/dom';
//请用全局组件配置对象 ComponentsConfig
const COLOR_THEME = window.ComponentsConfig ? window.ComponentsConfig.COLOR_THEME : null;

export default class Adapter {

  constructor(options) {
    this.el = {};
    // 主题切换
    switch (COLOR_THEME) {
      case "green":
        this.lineStyle = '#63BF5C';
        break;
      case "violet":
        this.lineStyle = '#34C0E2';
        break;
      default:
        this.lineStyle = '#5d9cec';
    }

    for (let name in options) {
      if (options.hasOwnProperty(name)) {
        this[name] = options[name];
      }
    }
    this.init();
    this.update();
  }
  //初始化
  init() {
    if (!this.el.querySelectorAll) return;
    this.rootDoms = this.el.querySelectorAll('.architecture-tree>.architecture-node');
    this.canvas = this.el.querySelector('.architecture-tree>.architecture-canvas');
    this.canvasPos = this.el.getBoundingClientRect();
    this.allNodes = this.el.querySelectorAll('.architecture-node');
    this.levelNodes = [];
  }
  // 更新样式
  update() {
    let tmpLabel, content, $this0 = this;
    setTimeout(function () {
      $this0.init();
      let i, item, length = $this0.allNodes.length || 0;

      for (i = 0; i < length; i++) {
        item = $this0.allNodes[i];
        tmpLabel = item.querySelector('.architecture-node__label');
        content = item.querySelector('.architecture__content');
        setStyle(content, 'width', (content.innerText.replace(/\s/g, '').length + 4) + 'em');
        setStyle(tmpLabel, 'width', tmpLabel.innerText.replace(/\s/g, '').length + 'em');
      }
      $this0.draw();
    });
  }
  computePos() {
    let levelNodes = this.levelNodes = [];
    this.canvasPos = this.el.getBoundingClientRect();
    this.canvas.width = this.canvasPos.width;
    this.canvas.height = this.canvasPos.height;

    // 获取DOM结构
    function NodesChildren(node) {
      let archNode = node.querySelector('.architecture__children>.architecture-node');

      if (archNode) {
        let nodelevel = archNode.attributes['nodelevel'].value;
        let archNodes = node.querySelectorAll('div[nodelevel="' + nodelevel + '"]');
        let nodeLabels = [];
        let i, item, length = archNodes.length;

        for (i = 0; i < length; i++) {
          item = archNodes[i];
          let node = {}, children;
          node.el = item.querySelector('.architecture-node__label');
          node.pos = node.el.getBoundingClientRect();
          children = item.querySelector('.architecture__children');
          if (children) {
            node.children = NodesChildren(children);
          }
          nodeLabels.push(node);
        }

        return nodeLabels;
      } else {
        return null;
      }
    }

    let k, cell, klength = this.rootDoms.length || 0;
    for (k = 0; k < klength; k++) {
      cell = this.rootDoms[k];
      let knode = {}, kchildren;
      knode.el = cell.querySelector('.architecture-node__label');
      knode.pos = knode.el.getBoundingClientRect();
      kchildren = cell.querySelector('.architecture__children');
      if (kchildren) {
        knode.children = NodesChildren(kchildren);
      }
      levelNodes.push(knode);
    }

  }
  // 路径绘制
  draw() {
    this.computePos();
    let self = this;
    let lineToEnd = this.lineToEnd;
    let ctx = this.canvas.getContext('2d');
    let canvasPos = this.canvasPos;
    let pos0, pos1;

    // 获取相对位置
    function getPos(rect) {
      let pos = {
        bottom: 0,
        width: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0
      };
      if (rect.left > 0 && rect.top > 0) {
        pos.left = rect.left - canvasPos.left + (rect.width / 2);
        pos.top = rect.top - canvasPos.top + (rect.height / 2);
        pos.right = rect.right;
        pos.bottom = rect.bottom;
        pos.width = rect.width;
        pos.height = rect.height;
      }
      return pos;
    }
    // 每个节点画线
    function DrawPos(start, node) {
      let i, item, length = node.length || 0;

      if (start && node) {
        for (i = 0; i < length; i++) {
          item = node[i];
          pos0 = getPos(start);
          pos1 = getPos(item.pos);

          if (pos1.left > 0 && pos1.top > 0) {
            lineToEnd.call(self, ctx, pos0.left, pos0.top, pos1.left, pos1.top);
          }
          if (item.children) {
            DrawPos(item.pos, item.children);
          }
        }
      }
    }

    if (this.levelNodes) {
      let h, hitem, hlength = this.levelNodes.length || 0;
      for (h = 0; h < hlength; h++) {
        hitem = this.levelNodes[h];
        if (hitem.children) {
          DrawPos(hitem.pos, hitem.children);
        }
      }
    }

  }
  // 画线
  lineToEnd(ctx, startX, startY, endX, endY) {
    if (ctx) {
      ctx.strokeStyle = this.lineStyle;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX, startY + (endY - startY) / 2);
      ctx.lineTo(endX, startY + (endY - startY) / 2);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }
};
