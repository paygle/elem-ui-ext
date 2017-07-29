import AddressBox from './src/address-box';

AddressBox.install = function install(Vue) {
  Vue.component(AddressBox.name, AddressBox);
};

export default AddressBox;
