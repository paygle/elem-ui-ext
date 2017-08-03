import NavMenus from './src/nav-menus';

NavMenus.install = function(Vue) {
  Vue.component(NavMenus.name, NavMenus);
};

export default NavMenus;
