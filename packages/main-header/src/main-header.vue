<template>
<header class="main-header container">
  <div class="fr-w header-box">
    <div class="header-left">
      <img :src="logolink">
    </div>
    <div class="header-right">
      <span>欢迎您 :<el-dropdown @command="handleCommand">
          <span class="el-dropdown-link nor-btn">
            {{nowdept}}<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item 
              v-for="(item, index) in depts" 
              :key="index"
              :command="item.c_oper_dept_code">
              {{item.c_oper_dept_code}}-{{item.c_oper_dept_name}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
      <span class="nor-btn" @click="clickUser" v-text="nowuser">匿名</span>
      <span>现在是：</span>
      <span v-text="nowdate"> 0000-000-000</span>
      <span class="nor-btn" @click="editpwd">修改密码</span>
      <span class="nor-btn" @click="logout">退出</span>   
    </div>
  </div>
</header>
</template>
<script>
import ElDropdown from 'element-ui/packages/dropdown';
import ElDropdownMenu from 'element-ui/packages/dropdown-menu';
import ElDropdownItem from 'element-ui/packages/dropdown-item';
import utilExt from 'element-ui/src/utils/util-ext';
export default {
  name: 'MainHeader',
  components: {
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem
  },
  props: {
    nowuser: String,
    nowdate: String,
    nowdept: String,
    nowdeptCode: String,
    depts: {
      type: Array,
      default: function () {
        return [];
      }
    },
    editpwd: {
      type: Function,
      default: function () {
        let fn = new Function();
        return fn;
      }
    },
    logout: {
      type: Function,
      default: function () {
        let fn = new Function();
        return fn;
      }
    },
    clickUser: {
      type: Function,
      default: function () {
        let fn = new Function();
        return fn;
      }
    }
  },
  data() {
    return {
      logolink: 'static/img/logo.png'
    };
  },
  methods: {
    handleCommand(command, instance) {
      if (command != this.nowdeptCode) {
        // this.$emit('deptchange', command, instance);
        utilExt.changeDept(command);
      }
    }
  }
};
</script>