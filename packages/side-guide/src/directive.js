import Vue from 'vue';
let SideGuide = Vue.extend(require('./side-guide.vue'));

exports.install = Vue => {
  if (Vue.prototype.$isServer) return;

  Vue.directive('SideGuide', {
    bind: function(el, binding) {
      let hookdiv = el.appendChild(document.createElement('div'));
      let sideGuide = new SideGuide({
        el: hookdiv,
        data: {
          parentEl: el,
          data: binding.value
        }
      });
      el.sideGuide = sideGuide;
      el.elSider = hookdiv;
    },

    update: function(el, binding) {
      if (binding.oldValue !== binding.value) {
        el.sideGuide.data = binding.value;
      }
    },

    unbind: function(el, binding) {
      if(el.sideGuide){
        el.sideGuide.doDestroy();
        el.sideGuide = null;
      }
      el.elSider &&
      el.elSider.parentNode &&
      el.elSider.parentNode.removeChild(el.elSider);
    }
  });
};
