import RichRadioButton from '../rich-radio/src/radio-button.vue';

/* istanbul ignore next */
RichRadioButton.install = function(Vue) {
  Vue.component(RichRadioButton.name, RichRadioButton);
};

export default RichRadioButton;
