import ValidItem from './src/valid-item';

ValidItem.install = function(Vue){
  Vue.component(ValidItem.name, ValidItem);
};

export default ValidItem;
