<template>
  <div class="sys-notify" :style="{lineHeight: msgHeight + 'px'}">
    <el-popover
      ref="notifyPoper"
      :placement="placement"
      :width="popWidth"
      :trigger="trigger">
     <ul class="sys-notify-list">
       <li 
        v-for="(item, index) in msgList" 
        :key="index">
        <div class="msg">
          <span :class="[readClass(item.c_status)]">{{ translateRead(item.c_status) }}</span>
          <a 
            class="content" 
            @click="linkClick(item)"
            v-text="item.c_msg_text">
          </a>
        </div>
        <div class="opt">
          <span class="date" v-text="item.d_msg_date"></span>
          <span class="btn el-icon-delete" @click="delMsg(item)"></span>
        </div>
       </li>
       <li class="list-bottom" v-if="unShowTotal>0">
         <a @click="moreClick">未读数&nbsp;
           <span class="total" v-text="unreadTotal"></span> &nbsp条，&nbsp;未显示&nbsp;
           <span class="total" v-text="unShowTotal"></span> &nbsp;条，查看更多
           <i class="el-icon-d-arrow-right"></i>
          </a>
       </li>
     </ul>
    </el-popover>
    <div class="notify-box" :style="tipbellStyl">
      <div :class="['notify', icon]" v-popover:notifyPoper>
        <span v-if="unreadTotal>0" v-show="shwCount" class="count" v-text="msgTotal"></span>
      </div>
      <div 
        class="scroll-box"
        v-if="scroller"
        @mouseenter="msgMouseEnter"
        @mouseleave="msgMouseLeave"
        :style="scrollBoxStyl">
        <marquee 
          ref="marquee"
          direction="left" 
          :width="msgWidth" 
          :scrollamount="step"
          :scrolldelay="time"
          :height="msgHeight">
          <a class="scroll-link"
            v-for="(item, index) in msgList" 
            :ref="'key'+index"
            :key="index"
            @click="linkClick(item)"
            v-text="item.c_msg_text">
          </a>
        </marquee>
      </div>
      <span v-if="separate" class="separate">|</span>
    </div>
  </div>
</template>
<script>
import ElPopover from 'element-ui/packages/popover';

export default {
  name: 'SysNotify',
  components: {
    ElPopover
  },
  props: {
    msgData: Array,    // 消息数据
    msgCount: {        // 未读消息总数
      type: Number,
      default: 0
    },
    msgExist: {        // 消息总数
      type: Number,
      default: 0
    },
    more: String,      // 点击更多链接
    icon: {            // 提示图标
      type: String,
      default: 'el-icon-msgbell'
    },
    step: {            // 每步跨度
      type: Number,
      default: 6
    },
    time: {            // 滚动反应时间
      type: Number,
      default: 100
    },
    actDefault: {        // 点击链接时默认动作
      type: Boolean,
      default: false
    },
    separate: {          // 是否显示右侧分隔竖线
      type: Boolean,
      default: false
    },
    scroller: {          // 是否显示滚动条消息
      type: Boolean,
      default: false
    },
    target: {
      type: String,
      default: 'blank'  // 可选 _blank 或 _self 
    },
    msgWidth: {        // 滚动窗口宽度
      type: Number,
      default: 200
    },
    msgHeight: {        // 滚动窗口高度
      type: Number,
      default: 38
    },
    popWidth: {         // 弹出窗口宽度
      type: Number,
      default: 380
    },
    placement: {        // 弹出窗口位置
      type: String,
      default: 'bottom'
    },
    trigger: {          // 弹出窗口触发事件
      type: String,
      default: 'hover'
    }
  },
  data() {
    return {
      msgList: [],
      shwCount: false,
      msgTotal: 0
    };
  },
  watch: {
    'msgData'(n, o) {
      if(n !==o) {
        this.msgList = n;
      }
    },
    'msgCount'(n, o) {
      this.msgTotal = n;
    }
  },
  computed: {
    unreadTotal(){
      return this.msgTotal; 
    },
    unShowTotal(){
      return this.msgExist - this.msgList.length; 
    },
    innerBoxStyl(){
      return {left: this.msgWidth + 'px', height: this.msgHeight + 'px'};
    },
    scrollBoxStyl(){
      let styl = {
        lineHeight: this.msgHeight + 'px', 
        height: this.msgHeight + 'px'
      };
      if(this.scroller){
        styl.width = this.msgWidth + 'px';
      }
      return styl;
    },
    tipbellStyl(){
      if(this.msgList.length<1){
        return {display: 'none'};
      }
      if(this.scroller){
        return {width: (this.msgWidth + 38)+'px'};
      }
      return {};
    }
  },
  methods: {
    readClass(val){
      if(val == 0){
        return 'unread';
      }else if(val == 1){
        return 'read';
      }
    },
    translateRead(val){
      if(val == 0){
        return '[未读]';
      }else if(val == 1){
        return '[已读]';
      }else if(val == 2){
        return '[清除]';
      }
    },
    msgMouseEnter(e){
      this.$refs.marquee.stop();
    },
    msgMouseLeave(e){
      this.$refs.marquee.start();
    },
    linkClick(item){
      if(this.actDefault){
        if(this.target === 'blank') {
          window.open(item.c_doc_url);
        }else{
          location.href = item.c_doc_url;
        }
      }else{
        this.$emit('link-click', item);
      }
    },
    moreClick(){
      if(this.actDefault && this.more){
        if(this.target === 'blank') {
          window.open(this.more);
        }else{
          location.href = this.more;
        }
      }else{
        this.$emit('more-click', this.more);
      }
    },
    delMsg(item){
      this.$emit('del-msg', item);
    }
  },
  updated(){
    if(this.$refs.notifyPoper){
      this.$refs.notifyPoper.$refs.popper.style.padding = 0;
      this.$refs.notifyPoper.$refs.popper.style.borderRadius = '5px';
    }
    setTimeout(()=>{
      this.shwCount =  true;
    }, 500);
  },
  beforeDestroy(){
    if(this.$refs.notifyPoper) {
      this.$refs.notifyPoper.doDestroy();
    }
  },
  mounted() {
    this.msgList = this.msgData;
    this.msgTotal = this.msgCount;
  }
};
</script>