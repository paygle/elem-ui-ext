/**
 * 数据格式
[
  {
    c_kind_no: '01',
    c_kind_name: '车险',
    child: [
      {
        c_prod_no: '01001',
        c_prod_name: '2010车型',
        favorite: '0'
      }
    ]
  }
]
 */
const Store = function (GridLayer, initState = {}) {

  if (!GridLayer) {
    throw new Error('GridLayer is required.');
  }
  this.GridLayer = GridLayer;

  this.states = {
    fields: initState.fields,
    data: []
  };

  for (let prop in initState) {
    if (initState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
      this.states[prop] = initState[prop];
    }
  }
};

Store.prototype.mutations = {

  setFields(states, data) {
    states.fields !== data ? states.fields = data : '';
  },

  setData(states, data) {
    const dataChanged = states.data !== data;
    if (dataChanged) {
      states.data = data;
    }
  }
};

Store.prototype.commit = function (action, ...args) {
  const mutations = this.mutations;
  if (mutations[action]) {
    mutations[action].apply(this, [this.states].concat(args));
  } else {
    throw new Error(`Action not found: ${action}`);
  }
};

export default Store;
