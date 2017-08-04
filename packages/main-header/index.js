import MainHeader from './src/main-header';

/* istanbul ignore next */
MainHeader.install = function(Vue) {
  Vue.component(MainHeader.name, MainHeader);
};

export default MainHeader;
