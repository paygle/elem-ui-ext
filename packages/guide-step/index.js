import GuideStep from '../guide-steps/src/guide-step';

/* istanbul ignore next */
GuideStep.install = function(Vue) {
  Vue.component(GuideStep.name, GuideStep);
};

export default GuideStep;
