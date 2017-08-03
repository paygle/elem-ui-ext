import RichRadio from './src/radio';

/* istanbul ignore next */
RichRadio.install = function(Vue) {
  Vue.component(RichRadio.name, RichRadio);
};

export default RichRadio;
