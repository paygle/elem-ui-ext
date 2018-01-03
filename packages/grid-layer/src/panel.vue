<template>
  <div class="grid-panel" :style="panelStyl">
    <el-popover
      ref="poplayer"
      popper-class="grid-layer-popover"
      :placement="placement"
      :title="kindName"
      :width="popWidth"
      :trigger="trigger">
      <div class="grid-pop-content">
        <a
          :style="linkStyl"
          v-for="(item, index) in child"
          :key="index"
          :href="getLinkurl(item[fields['cellNo']])"
          @click="cellClick(item[fields['cellNo']])">
          {{item[fields['cellNo']]}} &nbsp; {{item[fields['cellName']]}}
          <span class="favor-btn" v-on:click.stop="favoriteClick(item)">
            <i :class="[{'el-icon-star-off': item.favorite != 1},{'el-icon-star-on': item.favorite == 1}]"></i>
          </span>
        </a>
      </div>
    </el-popover>
    <h3 v-text="kindName"></h3>
    <div class="list-content" :style="{height: ctxHeight}">
      <a v-for="(item, index) in showData"
        :key="index"
        :href="getLinkurl(item[fields['cellNo']])"
        @click="cellClick(item[fields['cellNo']])">
        <span class="text">{{item[fields['cellNo']]}} &nbsp; {{item[fields['cellName']]}}</span>
        <span class="favor-btn" v-on:click.stop="favoriteClick(item)">
          <i :class="[{'el-icon-star-off': item.favorite != 1},{'el-icon-star-on': item.favorite == 1}]"></i>
        </span>
      </a>
    </div>
    <div class="panel-tool">
      <span v-show="anymore" @click="updateDom" v-popover:poplayer class="el-icon-circle-plus">&nbsp;更多</span>
    </div>
  </div>
</template>
<script>
import ElPopover from 'element-ui/packages/popover';

export default {

  name: 'GridPanel',

  components: {
    ElPopover
  },

  props: {
    numshow: Number,
    panelStyl: Array,
    placement: String,
    ctxHeight: String,
    trigger: String,
    urltmpl: Function,        // a 标签模板配置回调函数
    data: Object,
    store: Object
  },

  data() {
    return {
      popWidth: 368,
      linkStyl: {},
      anymore: false
    };
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
    },
    page() {
      return Math.ceil(this.child.length/this.numshow);
    },

    showData() {
      let len = this.child.length > this.numshow ? this.numshow : this.child.length;
      return this.child.slice(0, len);
    }
  },

  methods: {
    updateDom() {
      let bw = Number(getComputedStyle(this.store.GridLayer.$el).width.toString().replace('px', ''));
      let maxpage = Math.floor(bw /348);
      if (this.page < maxpage) {
        this.popWidth = bw / maxpage * this.page;
        this.linkStyl = { width: (100 / this.page) + '%' };
      } else {
        this.popWidth = bw - 40;
        this.linkStyl = { width: (100 / maxpage) + '%' };
      }
    },
    getLinkurl(code) {
      if (typeof this.urltmpl === 'function') {
        return this.urltmpl.call(null, code);
      } else {
        return "javascript:void(0);";
      }
    },
    favoriteClick(item) {
      this.store.GridLayer.$emit('favor-click', item);
    },
    cellClick(code) {
      this.store.GridLayer.$emit('cell-click', code, this.kindNo);
    }
  },
  mounted() {
    if (this.page > 1) this.anymore = true;
  }
};
</script>
