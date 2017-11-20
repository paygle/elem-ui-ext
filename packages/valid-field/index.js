import ValidField from '../valid-item/src/valid-field.vue';

/* istanbul ignore next */
ValidField.install = function(Vue) {
  Vue.component(ValidField.name, ValidField);
};

export default ValidField;
