import MeshTabs from './src/mesh-tabs';

/* istanbul ignore next */
MeshTabs.install = function(Vue) {
  Vue.component(MeshTabs.name, MeshTabs);
};

export default MeshTabs;
