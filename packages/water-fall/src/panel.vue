<template>
  <div class="water-panel" :style="panelStyl">
    <h3 v-text="kindName"></h3>
    <a v-for="(item, index) in child"
      :key="index"
      :href="getLinkurl(item[fields['cellNo']])"
      @click="cellClick(item[fields['cellNo']])">
      {{item[fields['cellNo']]}} &nbsp; {{item[fields['cellName']]}}
    </a>
  </div>
</template>
<script>
export default {

  name: 'WaterPanel',

  props: {
    panelStyl: Array,
    urltmpl: Function,        // a 标签模板配置回调函数
    data: Object,
    store: Object
  },

  computed: {

    fields() {
      return this.store.states.fields;
    },

    kindNo() {
      return this.data[this.fields['kindNo']];
    },

    kindName() {
      return this.data[this.fields['kindName']];
    },

    child() {
      return this.data[this.fields['child']];
    }

  },

  methods: {
    getLinkurl(code) {
      if (typeof this.urltmpl === 'function') {
        return this.urltmpl.call(null, code);
      } else {
        return "javascript:void(0);";
      }
    },
    cellClick(code) {
      this.store.WaterFall.$emit('cell-click', code, this.kindNo);
    }
  }
};
</script>
