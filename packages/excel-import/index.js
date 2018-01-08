import ExcelImport from './src/excel-import';

/* istanbul ignore next */
ExcelImport.install = function(Vue) {
  Vue.component(ExcelImport.name, ExcelImport);
};

export default ExcelImport;
