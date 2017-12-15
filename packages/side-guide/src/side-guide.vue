<template>
  <div class="side-guide" ref="sideGuide" :style="guideStyl">
     <ul v-show="zoom"
      class="side-box"
      v-for="(item, key) in guideData"
      :key="'item' + key">
       <side-cell
        v-show="!item.hidden"
        :icon="item.icon"
        :index="item.index"
        :anchor="item.anchor"
        :action="item.action"
        :text="item.text"
        :store="store"></side-cell>
       <side-cell
        v-for="(cell, index) in item.list"
        :key="'cell' + index"
        :index="cell.index"
        :icon="cell.icon"
        :anchor="cell.anchor"
        :action="cell.action"
        :text="cell.text"
        :store="store"></side-cell>
       <side-cell
        v-for="(op, index) in item.operations"
        :key="'op' + index"
        :index="op.index"
        :icon="op.icon"
        :anchor="op.anchor"
        :action="op.action"
        :text="op.text"
        :store="store"></side-cell>
     </ul>
     <transition name="fade" mode="out-in" appear>
      <div class="el-icon-menu" @click="toggleMenu" style="cursor: pointer"></div>
     </transition>
  </div>
</template>
<script>
import SideStore from './side-store';
import SideCell from './side-cell';
import { on, off } from 'element-ui/src/utils/dom';

export default {
  name: 'SideGuide',
  componentName: 'SideGuide',
  components:{
    SideCell
  },
  data() {
    const store = new SideStore(this,{
      width: '90px',           // 菜单宽度
      align: 'center',         // 文字对齐   left | center | right
      displaySide: 'right',    // 菜单显示位置  left | right
      setGuider: null          // 设置实例数据对象回调函数
    });
    return {
      store,
      parentEl: null,
      data: {},        // 数据
      guideStyl: {},
      zoom: true
    };
  },
  computed:{
    guideData () {
      return this.store.states.data;
    },
    mWidth () {
      return this.store.states.width;
    },
    mAlign () {
      return this.store.states.align;
    },
    displaySide () {
      return this.store.states.displaySide;
    }
  },
  watch:{
    data: {
      immediate: true,
      handler(val) {
        this.store.commit('setData', val);
      }
    }
  },
  methods:{

    getInnerHeigth(){
      if(!this.$el) return;
      let InnerHeight = 30;
      let boxHeight = this.$el.getBoundingClientRect().height;
      let InnerObj = this.$el.querySelectorAll('.side-box');
      for(let i=0; i<InnerObj.length; i++){
        if(InnerObj[i]){
          InnerHeight += InnerObj[i].getBoundingClientRect().height;
        }
      }
      return boxHeight > InnerHeight ? InnerHeight : boxHeight;
    },

    updateStyle() {

      this.$nextTick(() => {

        let styl = { width: this.mWidth, textAlign: this.mAlign, overflow: 'auto'};
        let bHeight = this.getInnerHeigth();
        let sH = document.documentElement.clientHeight;
        styl[this.displaySide] = '5px';

        if( (sH - 30) > bHeight ) {
          styl['top'] = ((sH - bHeight)/2 - 30) + 'px';
        } else {
          styl['top'] = '1%';
          styl['height'] = '96%';
        }

        this.guideStyl = styl;
      });
      if(typeof this.data['sideStore'] === 'function') {
        this.data['sideStore'].call(null, this.store);
      }
      if(typeof this.store.states.setGuider === 'function'){
        this.store.states.setGuider.call(null, this.store);
      }
    },

    toggleMenu(){
      this.zoom = !this.zoom;
      if(!this.zoom) {
        this.guideStyl['width'] = '30px';
      }else {
        this.guideStyl['width'] = this.mWidth;
      }
    },
    doDestroy(){
      if (this.$el && this.updateStyle) off(window, 'resize', this.updateStyle);
      this.$destroy();
    }
  },

  mounted(){
    setTimeout(()=>{ this.updateStyle(); }, 300);
    this.$on('updateStyle', this.updateStyle);
    on(window, 'resize', this.updateStyle);
  },
  beforDestroy(){
    off(window, 'resize', this.updateStyle);
  }
};
</script>
