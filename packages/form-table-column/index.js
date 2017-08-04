import FormTableColumn from '../form-table/src/table-column';

/* istanbul ignore next */
FormTableColumn.install = function(Vue) {
  Vue.component(FormTableColumn.name, FormTableColumn);
};

export default FormTableColumn;
