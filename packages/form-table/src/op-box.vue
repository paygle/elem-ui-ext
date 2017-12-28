<template>
  <div class="op-box" v-if="isShow">
    <el-button-group>
      <el-button
        v-if="deleteVisit"
        :plain="true"
        type="info"
        icon="delete2"
        size="mini"
        :disabled="disabled"
        v-on:click.stop="deleteHandle">
      </el-button>
      <el-button
        v-if="!iShwMorebtn && editVisit"
        :plain="true"
        type="info"
        size="mini"
        icon="pencil"
        :disabled="disabled"
        v-on:click.stop="editHandle">
      </el-button>
      <el-button
        ref="addbtn"
        v-if="iShwMorebtn && addVisit"
        :plain="true"
        type="info"
        size="mini"
        icon="document"
        :disabled="disabled"
        v-on:click.stop="addPreLoad">
      </el-button>
      <el-button
        v-if="iShwMorebtn && saveVisit"
        :plain="true"
        type="info"
        size="mini"
        icon="save"
        :disabled="disabled"
        v-on:click.stop="saveHandle">
      </el-button>
    </el-button-group>
    <span v-show="headerNoButton">操作</span>
  </div>
</template>
<script>
import ElButton from 'element-ui/packages/button';
import ElButtonGroup from 'element-ui/packages/button-group';
import MessageBox from 'element-ui/packages/message-box';
import Message from 'element-ui/packages/message';
import { TypeOf } from 'element-ui/src/utils/funcs';  //引入类型判断
import Promise from 'es6-promise';

// form-table 表单操作专用
// let $msgbox = MessageBox;
let $alert = MessageBox.alert;
let $confirm = MessageBox.confirm;
let $message = Message;

const getNewRow = function () {
  let currentStates = this.store ? (this.store.states ? this.store.states : {}) : {};
  let data = currentStates.data || [];
  let this$0 = this;

  function newObj(row, fill) {
    let obj = Object.create(null);
    for (let k in row) {
      if (k in row) {
        switch (TypeOf(row[k])) {
          case 'String':
            obj[k] = fill ? row[k] : '';
            break;
          case 'Boolean':
            obj[k] = fill ? row[k] : false;
            break;
          case 'Number':
            obj[k] = fill ? row[k] : 0;
            break;
          default: obj[k] = fill ? row[k] : null;
            break;
        }

      }
    }
    this$0.newRow = obj;
  }
  if (!currentStates.newRow && data.length > 0 && TypeOf(data[0]) === 'Object') {
    newObj(data[0]);
  } else if (currentStates.newRow) {
    newObj(currentStates.newRow, true);
  } else {
    console && console.error('The form-table has no "new-row" params.');
  }
};

export default {
  name: 'op-box',
  components: {
    ElButton,
    ElButtonGroup
  },
  props: {
    isheader: {
      type: Boolean,
      default: false
    },
    disabled: Boolean,
    store: Object,
    row: Object,
    column: Object,
    addVisit: {                 // 隐藏 添加按钮
      type: Boolean,
      default: true
    },
    deleteVisit: {              // 隐藏 删除按钮
      type: Boolean,
      default: true
    },
    saveVisit: {                // 隐藏 保存按钮
      type: Boolean,
      default: true
    },
    editVisit: {               // 隐藏 动作按钮
      type: Boolean,
      default: true
    },
    index: [String, Number],
    editRow: Function,
    deleteRow: Function,
    addRowPre: Function,
    addNewRow: Function,
    saveRow: Function
  },
  data() {
    return {
      isShow: true,
      newRow: {}
    };
  },
  computed: {
    iShwMorebtn() {
      if (!this.row) {
        return true;
      }
      return false;
    },
    headerNoButton() {
      let isHas = true;
      if (this.addVisit || this.saveVisit || this.deleteVisit) {
        isHas = false;
      }
      return isHas && this.isheader;
    },
    currentStates() {
      return this.store ? (this.store.states ? this.store.states : {}) : {};
    },
    selectionLen() {
      let selection = this.currentStates ? this.currentStates.selection : {};
      return selection.length ? selection.length : 0;
    }
  },
  methods: {
    deleteHandle() {
      let delInfo = "";
      let currentStates = this.currentStates;
      let len = this.selectionLen;
      let $this0 = this;

      if (!this.row) {
        if (len == 0) {
          $alert('请勾选数据项之后，再点删除...', undefined, { type: 'info' });
          return;
        } else {
          delInfo = '此操作总计删除' + len + '条数据, 是否继续?';
        }
      } else {
        delInfo = '此操作会删除第' + (this.index + 1) + '行数据, 是否继续?';
      }

      $confirm(delInfo, undefined, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!$this0.row) {
          if ($this0.deleteRow) $this0.deleteRow(currentStates.selection);
          $this0.store.commit('deleteSelection');
        } else {
          if ($this0.deleteRow) $this0.deleteRow([$this0.row]);
          $this0.store.commit('deleteRow', $this0.row);
        }
        $message({ type: 'success', message: '删除成功!' });
      }).catch((e) => {
        $message({ type: 'info', message: '已取消删除' });
        console && console.warn('Error is ', e);
      });
    },
    editHandle() {
      if (this.row && this.editRow) {
        this.editRow(this.row);
      }
    },
    addPreLoad() {
      if (TypeOf(this.addRowPre) === 'Function') {
        this.addRowPre.call(null, this);
      } else {
        this.addHandle();
      }
    },
    addHandle() {
      let this$0 = this;
      if (this$0.addNewRow) {
        let $Promise = new Promise(function (resolve, reject) {
          resolve(this$0.addNewRow());
        });

        $Promise.then(function (data) {
          if (TypeOf(data) === 'Object') {
            this$0.newRow = data;
            getNewRow.call(this$0);
            this$0.store.commit('addNewRow', this$0.newRow);
          }
        }).catch(function (e) {
          throw new Error('Add Row Error : ' + e);
        });
      }else{
        getNewRow.call(this);
        this$0.store.commit('addNewRow', this$0.newRow);
      }
    },

    saveHandle() {
      if (this.selectionLen == 0) {
        $alert('请勾选数据项之后，再点保存...', undefined, { type: 'info' });
        return;
      } else {
        $message({ type: 'success', message: '已有' + this.selectionLen + '条数据在保存中...' });
        if (this.saveRow) this.saveRow(this.store.states.selection);
      }
    }
  },
  created() {
    this.$on('addrow', this.addHandle);
  },
  mounted() {
    getNewRow.call(this);
  }
};
</script>
