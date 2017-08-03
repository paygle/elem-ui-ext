<template>
  <div class="el-collapse-item" :class="{'is-active': isActive}">
    <div class="el-collapse-item__header icollapse-item__header" @click="handleHeaderClick">
      <h3 class="col-header">
        <span class="bottom" :style="bottomLeft"></span>
        <span class="line"></span>
        <span class="label-angle" :style="angleLeft"></span>
        <span class="label"  :style="labelWidth">{{title}}</span>
      </h3>
      <i v-if="$parent.rightIcon" class="el-collapse-item__header__arrow el-icon-circle-xl-angle"></i>
    </div>
    <el-collapse-transition>
      <div class="el-collapse-item__wrap" v-show="isActive">
        <div class="el-collapse-item__content">
          <slot></slot>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
import Emitter from 'element-ui/src/mixins/emitter';
import ElCollapseTransition from 'element-ui/src/transitions/collapse-transition';

export default {
  name: 'IcollapseItem',

  componentName: 'IcollapseItem',

  mixins: [Emitter],

  components: {
    ElCollapseTransition
  },

  data() {
    return {
      contentWrapStyle: {
        height: 'auto',
        display: 'block'
      },
      contentHeight: 0,
      bottomLeft: {},
      orginBottomLeft: '',
      angleLeft: {},
      orginAngleLeft: '',
      labelWidth: {},
      orginLabelWidth: ''
    };
  },

  props: {
    title: String,
    name: {
      type: [String, Number],
      default() {
        return this._uid;
      }
    }
  },

  computed: {
    isActive() {
      return this.$parent.activeNames.indexOf(this.name) > -1;
    }
  },

  watch: {
    title(val) {
      this.computedStyle();
    }
  },

  methods: {
    handleHeaderClick() {
      this.dispatch('Icollapse', 'item-click', this);
    },
    getNumberValue(node, prop) {
      let style, val;
      if (node) {
        style = getComputedStyle(node);
        val = style.getPropertyValue(prop);
        val = typeof val === 'string' ? val.replace('px', '') : 0;
        return isNaN(val) ? 0 : Number(val);
      } else {
        return 0;
      }
    },
    computedStyle() {
      this.$nextTick(function () {
        let regxCn = /\W/ig;
        let regxEn = /\w/ig;
        let bottomNode = this.$el.querySelector('.col-header .bottom');
        let angleNode = this.$el.querySelector('.col-header .label-angle');
        let labelNode = this.$el.querySelector('.col-header .label');
        let text = labelNode.innerText;
        let CnText = text.match(regxCn), Cnlen = CnText ? CnText.length : 0;
        let EnText = text.match(regxEn), Enlen = EnText ? EnText.length : 0;
        let fontSize = this.getNumberValue(labelNode, 'font-size') + 1;
        let cw, cpWidth = fontSize * Cnlen + fontSize * Enlen / 2;
        let BottomLeft = this.getNumberValue(bottomNode, 'left');
        let AngleLeft = this.getNumberValue(angleNode, 'left');
        let LabelWidth = this.getNumberValue(labelNode, 'width');

        if (cpWidth > this.orginLabelWidth) {

          this.labelWidth = { width: cpWidth + 'px' };
          if (cpWidth > LabelWidth) {
            cw = cpWidth - LabelWidth;
            this.bottomLeft = { left: (cw + BottomLeft) + 'px' };
            this.angleLeft = { left: (cw + AngleLeft) + 'px' };
          } else {
            cw = LabelWidth - cpWidth;
            this.bottomLeft = { left: (BottomLeft - cw) + 'px' };
            this.angleLeft = { left: (AngleLeft - cw) + 'px' };
          }
        } else {
          this.labelWidth = { width: this.orginLabelWidth + 'px' };
          this.bottomLeft = { left: this.orginBottomLeft + 'px' };
          this.angleLeft = { left: this.orginAngleLeft + 'px' };
        }
      });
    }
  },

  mounted() {
    this.$nextTick(function () {
      let bottomNode = this.$el.querySelector('.col-header .bottom');
      let angleNode = this.$el.querySelector('.col-header .label-angle');
      let labelNode = this.$el.querySelector('.col-header .label');
      this.orginBottomLeft = this.getNumberValue(bottomNode, 'left');
      this.orginAngleLeft = this.getNumberValue(angleNode, 'left');
      this.orginLabelWidth = this.getNumberValue(labelNode, 'width');
      this.computedStyle();
    });
  }
};
</script>
