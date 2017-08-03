import SideGuide from './src/side-guide';
import directive from './src/directive';

/* istanbul ignore next */
SideGuide.install = function(Vue) {
  Vue.component(SideGuide.name, SideGuide);
};

SideGuide.directive = directive;

export default SideGuide;
