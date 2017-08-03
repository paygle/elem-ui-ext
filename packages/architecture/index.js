import Architecture from './src/architecture';

Architecture.install = function(Vue){
  Vue.component(Architecture.name, Architecture);
};

export default Architecture;
