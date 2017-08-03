const CaseTrackStore = function(CaseTrack, initialState = {}) {
  if (!CaseTrack) {
    throw new Error('CaseTrack is required.');
  }
  this.CaseTrack = CaseTrack;

  this.states = {
    components: null,    // 模板组件
    mapData: null,       // Array 类型
    itemWidth: null      // Number 类型
  };

  for (let prop in initialState) {
    if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
      this.states[prop] = initialState[prop];
    }
  }
};

CaseTrackStore.prototype.mutations = {
  setMapData(states, data) {
    states.mapData = data;
  }
};
 
CaseTrackStore.prototype.commit = function(name, ...args) {
  const mutations = this.mutations;
  if (mutations[name]) {
    mutations[name].apply(this, [this.states].concat(args));
  } else {
    throw new Error(`Action not found: ${name}`);
  }
};

export default CaseTrackStore;
