import Icollapse from './src/collapse';

/* istanbul ignore next */
Icollapse.install = function(Vue) {
  Vue.component(Icollapse.name, Icollapse);
};

export default Icollapse;

