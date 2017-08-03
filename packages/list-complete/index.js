import ListComplete from './src/list-complete';

/* istanbul ignore next */
ListComplete.install = function(Vue) {
  Vue.component(ListComplete.name, ListComplete);
};

export default ListComplete;
