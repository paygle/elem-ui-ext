import { TypeOf } from 'element-ui/src/utils/funcs';

const SideStore = function (sider, initState={}){

  if (!sider) {
    throw new Error('SideGuide is required.');
  }
  this.sider = sider;

  this.states = {
    isUpdateStyle : false , //用于side-guide暴露给业务组件刷新side-guide所有位置使用
    width: initState.width,              // 菜单宽度
    align: initState.align,              // 文字对齐   left | center | right
    displaySide: initState.displaySide,  // 菜单显示位置  left | right
    setGuider: initState.setGuider,      // 设置实例数据对象回调函数
    expand: initState.expand,            // 默认是否展开
    data: []
  };

  for (let prop in initState) {
    if (initState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
      this.states[prop] = initState[prop];
    }
  }
};

SideStore.prototype.mutations = {

  setData(states, o) {
    states.data = o.data;
    states.expand = typeof o.expand === 'undefined' ? true : o.expand; // 默认是否展开
    states.width = o.width || '90px';                // 菜单宽度
    states.align = o.align || 'center';              // 文字对齐   left | center | right
    states.displaySide = o.displaySide || 'right';   // 菜单显示位置  left | right
    states.setGuider = o.setGuider;                  // 设置实例数据对象回调函数
  },
  /**
   *  typeIndex 分类数据的 index 值
   *  listCell  需要增加的 数据
   */
  addCell(states, typeIndex, listCell) {
    if(states.data[typeIndex]) {
      let list = states.data[typeIndex]['list'];
      if(TypeOf(list) === 'Array') {
        list.push(listCell);
      }else{
        states.data[typeIndex]['list'] = [];
        states.data[typeIndex]['list'].push(listCell);
      }
    }
  },
  /**
   *  typeIndex 分类数据的 index 值
   *  listIndex 需要修改列表的 index 值
   *  listCell  需要修改数据
   */
  editCell(states, typeIndex, listIndex, listCell) {
    if(states.data[typeIndex]) {
      let list = states.data[typeIndex]['list'];
      if(TypeOf(list) === 'Array' && TypeOf(list[listIndex]) === 'Object') {
        states.data[typeIndex]['list'].splice(listIndex, 1, listCell);
      }
    }
  },
  /**
   *  typeIndex 分类数据的 index 值
   *  listIndex 需要修改列表的 index 值
   *  listCell  需要修改数据
   */
  deleteCell(states, typeIndex, listIndex) {
    if(states.data[typeIndex]) {
      let list = states.data[typeIndex]['list'];
      if(TypeOf(list) === 'Array' && TypeOf(list[listIndex]) === 'Object') {
        states.data[typeIndex]['list'].splice(listIndex, 1);
      }
    }
  },
  updateStyle(states, isUpdateStyle){
    states.isUpdateStyle = isUpdateStyle;
  }
};

SideStore.prototype.commit = function(action, ...args){
  const mutations = this.mutations;
  if (mutations[action]) {
    mutations[action].apply(this, [this.states].concat(args));
  } else {
    throw new Error(`Action not found: ${action}`);
  }
};

export default SideStore;
