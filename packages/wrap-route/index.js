import WrapRoute from './src/wrap-route';

/* istanbul ignore next */
WrapRoute.install = function(Vue) {
  Vue.component(WrapRoute.name, WrapRoute);
};

export default WrapRoute;
