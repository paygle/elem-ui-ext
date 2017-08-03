import RichRadioGroup from '../rich-radio/src/radio-group.vue';

/* istanbul ignore next */
RichRadioGroup.install = function(Vue) {
  Vue.component(RichRadioGroup.name, RichRadioGroup);
};

export default RichRadioGroup;
