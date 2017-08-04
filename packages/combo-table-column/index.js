import ComboTableColumn from './src/table-column';

/* istanbul ignore next */
ComboTableColumn.install = function(Vue) {
  Vue.component(ComboTableColumn.name, ComboTableColumn);
};

export default ComboTableColumn;
