<template>
  <div class="check-all-box">
    <el-checkbox 
      v-if="headerChecked" 
      v-model="checked"
      @change="toggleCheckbox"></el-checkbox>
    <span v-text="headerLabel" v-else></span>
  </div>
</template>
<script>
import ElCheckbox from 'element-ui/packages/checkbox';

export default {
  name: 'CheckAllBox',
  componentName: 'CheckAllBox',
  components: {
    ElCheckbox
  },
  props: {
    headerChecked: {
      type: Boolean,
      default: false
    },
    value: {},
    column: Object,
    store: Object
  },
  data() {
    return {
      checked: false
    };
  },
  computed: {
    headerLabel() {
      if (this.column) {
        return this.column.label || '';
      }
      return '';
    },
    property() {
      if (this.column) {
        return this.column['property'] || '';
      }
      return '';
    }
  },
  watch: {
    value(n, o) {
      if (n && this.property) {
        this.checked = n[this.property] || false;
      } else {
        this.checked = false;
      }
    }
  },
  methods: {
    checkboxHeaderChange(param) {
      if (this.property === param.property) {
        this.checked = param.value;
      }
    },
    toggleCheckbox() {
      this.store.commit('toggleCheckSelection', this.column);
    }
  },
  mounted() {
    this.$on('checkbox-header-change', this.checkboxHeaderChange);
  }
};
</script>
