import CustomSwitch from './src/component';

/* istanbul ignore next */
CustomSwitch.install = function(Vue) {
  Vue.component(CustomSwitch.name, CustomSwitch);
};

export default CustomSwitch;

