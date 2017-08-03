import WaterFall from './src/water-fall';

WaterFall.install = function(Vue) {
  Vue.component(WaterFall.name, WaterFall);
};

export default WaterFall;
