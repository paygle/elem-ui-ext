import DictLabel from './src/dict-label';

/* istanbul ignore next */
DictLabel.install = function(Vue) {
  Vue.component(DictLabel.name, DictLabel);
};

export default DictLabel;
