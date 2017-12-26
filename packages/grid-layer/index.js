import GridLayer from './src/grid-layer';

GridLayer.install = function(Vue) {
  Vue.component(GridLayer.name, GridLayer);
};

export default GridLayer;
