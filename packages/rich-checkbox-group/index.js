import RichCheckboxGroup from '../rich-checkbox/src/checkbox-group.vue';

/* istanbul ignore next */
RichCheckboxGroup.install = function(Vue) {
  Vue.component(RichCheckboxGroup.name, RichCheckboxGroup);
};

export default RichCheckboxGroup;
