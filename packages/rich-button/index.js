import RichButton from './src/button';

/* istanbul ignore next */
RichButton.install = function(Vue) {
  Vue.component(RichButton.name, RichButton);
};

export default RichButton;
