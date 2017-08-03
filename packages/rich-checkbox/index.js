import RichCheckbox from './src/checkbox';

/* istanbul ignore next */
RichCheckbox.install = function(Vue) {
  Vue.component(RichCheckbox.name, RichCheckbox);
};

export default RichCheckbox;
