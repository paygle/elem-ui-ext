import MainNav from './src/main-nav';

/* istanbul ignore next */
MainNav.install = function(Vue) {
  Vue.component(MainNav.name, MainNav);
};

export default MainNav;
