import Vue from 'vue';
let TableTotal = Vue.extend(require('./table-total.vue'));

exports.install = Vue => {
  if (Vue.prototype.$isServer) return;

  Vue.directive('TableTotal', {
    bind: function(el, binding, vnode) {
      let hookdiv = el.appendChild(document.createElement('div'));
      let tabTotal = new TableTotal({
        el: hookdiv,
        data: {
          parentEl: el,
          totalData: binding.value,
          store : vnode.componentInstance.store 
        }
      });
      el.tabTotal = tabTotal;
      el.elTotal = hookdiv;
    },

    update: function(el, binding) {
      if (binding.oldValue !== binding.value) {
        el.tabTotal.totalData = binding.value;
      }
    },

    unbind: function(el, binding) {
      if(el.tabTotal){
        el.tabTotal = null;
      }
      el.elTotal &&
      el.elTotal.parentNode &&
      el.elTotal.parentNode.removeChild(el.elTotal);
    }
  });
};
