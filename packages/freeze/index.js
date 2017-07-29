import freeze from './src/freeze';

/* istanbul ignore next */
freeze.install = function(Vue) {
  Vue.component(freeze.name, freeze);
};

export default freeze;
