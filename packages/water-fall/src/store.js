/**
 * 数据格式
[
  {
    c_kind_no: '01',
    c_kind_name: '车险',
    child: [
      {
        c_prod_no: '01001',
        c_prod_name: '2010车型'
      }
    ]
  }
]
 */
import {
  TypeOf
} from 'element-ui/src/utils/funcs';

const convertToLane = function (data, colnum, fields) {

  let col = colnum || 4;
  let lanesCount = [];
  let laneData = [];
  // let kindNo = fields['kindNo'];
  // let kindName = fields['kindName'];
  let child = fields['child'];
  // let cellNo = fields['cellNo'];
  // let cellName = fields['cellName'];

  const convert = function (item) {
    let minIdex = 0,
      minNum = lanesCount[0];
    for (let x = 0; x < lanesCount.length; x++) {
      if (minNum > lanesCount[x]) {
        minIdex = x;
        minNum = lanesCount[x];
      }
    }
    if (TypeOf(laneData[minIdex]) === 'Array') {
      laneData[minIdex].push(item);
      lanesCount[minIdex] = lanesCount[minIdex] + item[child].length + 2;
    }
  };

  if (data && data.length) {

    for (let i = 0; i < col; i++) {
      lanesCount[i] = 0;
      laneData.push([]);
    }

    for (let j = 0; j < data.length; j++) {
      convert(data[j]);
    }
  }
  return laneData;
};

const Store = function (WaterFall, initState = {}) {

  if (!WaterFall) {
    throw new Error('WaterFall is required.');
  }
  this.WaterFall = WaterFall;

  this.states = {
    colnum: initState.colnum,
    fields: initState.fields,
    data: [],
    orderData: []
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
      states.orderData = convertToLane(data, states.colnum, states.fields);
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
