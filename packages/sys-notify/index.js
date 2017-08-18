import SysNotify from './src/sys-notify';

/* istanbul ignore next */
SysNotify.install = function(Vue) {
  Vue.component(SysNotify.name, SysNotify);
};

export default SysNotify;
