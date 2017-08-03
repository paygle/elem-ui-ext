import TableTotal from './src/table-total';
import directive from './src/directive';

/* istanbul ignore next */
TableTotal.install = function(Vue) {
  Vue.component(TableTotal.name, TableTotal);
};

TableTotal.directive = directive;

export default TableTotal;
