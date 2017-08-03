import Indicator from './src/indicator';

Indicator.install = function(Vue){
  Vue.component(Indicator.name, Indicator);
};

export default Indicator;
