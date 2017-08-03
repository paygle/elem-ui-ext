import GuideSteps from './src/guide-steps';

/* istanbul ignore next */
GuideSteps.install = function(Vue) {
  Vue.component(GuideSteps.name, GuideSteps);
};

export default GuideSteps;
