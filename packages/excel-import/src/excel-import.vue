<template>
  <section v-loading.fullscreen.lock="loading" :element-loading-text="loadingText">
      <div class="row  form-group col-md-12" style="padding-left:0">
        <el-button type="primary" icon="send-back" @click="search">加载</el-button>
        <el-button type="primary" icon="plus" @click="addRow">新增</el-button>
        <el-button type="primary" icon="upload2" @click="handleImport">导入</el-button>
        <el-button type="primary" icon="upload" @click="handleImportAppend">增量导入</el-button>
        <el-button type="primary" icon="export" :disabled="dataFail.length==0" 
          @click="handleExport">导出错误数据</el-button>
        <el-button type="primary" icon="save" @click="handleSave" :disabled="!saveAble">保存</el-button>
        <el-button  :plain="true" type="danger" icon="delete"
          :disabled="dataFail.length==0 && dataSuccess.length==0" @click="handleDeleteAll">清空</el-button>
        <el-input v-model="keyword" class="excel-imp-keyword" placeholder="关键字过滤"
          @keyup.enter.native="localFilter"></el-input>
      </div>
      <el-table :data="rows">
        <el-table-column v-for="(value,key) in fieldMap" :prop="key" :label="value" :key="key"></el-table-column>
        <el-table-column inline-template :context="_self" label="操作" width="80">
          <div>
            <el-button @click="editRow($index,row)" icon="pencil" size="mini" type="info" plain title="编辑"></el-button>
            <el-button @click="delRow($index,row)" icon="delete2" size="mini" type="info" plain title="删除"></el-button>
          </div>
        </el-table-column>
      </el-table>

      <el-pagination style="text-align: right;" @size-change="handleSizeChange"
                      @current-change="handleCurrentChange" :current-page="pager.pageNo"
                      :page-sizes="[10, 20, 30, 50, 100]" :page-size="pager.pageSize"
                      layout="slot,total, sizes, prev, pager, next, jumper"
                      :total="pager.total">
          <slot><span class="excel-imp-msg">{{tableMsg}}</span></slot>
      </el-pagination>

      <el-dialog :title="uploadAppend ? '增量导入Excel':'导入Excel'" :close-on-click-modal="false" :visible.sync="uploadDialogVisible">
        <el-upload
          class="upload-demo"
          ref="upload"  drag
          :action="updloadUrl" :data="uploadParam"
          :multiple="false" :with-credentials="true"
          :on-change="handleFileChange" :file-list="fileList" 
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-progress="handleUploadPropress"
          accept=".xls,.xlsx">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
        </el-upload>
      </el-dialog>  

      <el-dialog :title="edit ? '编辑数据':'新增数据'" :close-on-click-modal="false" :visible.sync="editorVisible"  >
        <el-form label-position="right" ref="editForm" label-width="80px" :model="editForm" :rules="rules">
          <el-row>
            <el-col :span="12" v-for="(value,key) in fieldMap" :key="key" >
              <el-form-item :label="value"  :prop="key">
                <el-input v-model="editForm[key]"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          
        </el-form>
        <div slot="footer" class="editor-dialog-footer">
          <el-button @click="editorVisible = false">取 消</el-button>
          <el-button type="primary" @click="editorConfirm">确 定</el-button>
        </div>
      </el-dialog> 
      
  </section>
</template>

<script>
import ElButton from "element-ui/packages/button";
import ElTable from "element-ui/packages/table";
import ElMessage from "element-ui/packages/message";
import ElMessageBox from "element-ui/packages/message-box";
import ElTableColumn from "element-ui/packages/table-column";
import ElPagination from "element-ui/packages/pagination";
import ElInput from "element-ui/packages/input";
import ElDialog from "element-ui/packages/dialog";
import ElUpload from "element-ui/packages/upload";
import ElForm from 'element-ui/packages/form';
import ElFormItem from 'element-ui/packages/form-item';
import ElRow from 'element-ui/packages/row';
import ElCol from 'element-ui/packages/col';
import Loading from 'element-ui/packages/loading';
import util from 'element-ui/src/utils/util-ext';
import Vue from 'vue';

Vue.use(Loading.directive);

export default {
  name: "ExcelImport",
  props: {
      pageSize:{               //表格分页条数
        type:Number,
        default:10
      },
      fieldMap:Object,         //字段映射
      bizId:String,            //业务ID
      //模板excel路径
      templateExcel:{  
        type: String,
        required: true
      }, 
      //模板配置文件路径
      templateProp:{
        type: String,
        required: true
      },     
      validator:String,        //后台校验器类名
      expire:{                 //保存天数 默认30天
         type:Number,
         default:30
      },
      rules:{                 //前台校验规则
        type:Object,
        default:{}
      }
  },

  data() {
    return {
      updloadUrl: window.API_URL+'/core/upload?type=simpleExcelImport',
      tableMsg:'',
      keyword:'',
      loading:false,
      loadingText:'加载中',
      uploadDialogVisible:false,
      uploadAppend:false,
      editorVisible:false,
      edit:false,
      saveAble:false,
      editIndex:-1,
      pager:{
          pageNo:1,
          pageSize:10,
          total:0
      },
      fileList:[],
      rows:[],
      dataSuccess:[],
      dataFail:[],
      filterData:[],
      editForm:{},
      dataDeleted:[]
    };
  },
  created(){
    this.pager.pageSize=this.pageSize;
    this.search();
    this.$watch('filterData.length',function(val){
      this.pager.total=val;
    });
  },
  components: {
    ElButton,
    ElTable,
    ElMessage,
    ElMessageBox,
    ElTableColumn,
    ElPagination,
    ElInput,
    ElDialog,
    ElUpload,
    ElForm,
    ElFormItem,
    ElRow,
    ElCol
  },
  methods: {
    handleImport() {
      if(this.dataSuccess.length == 0 && this.dataFail.length == 0){
        this.uploadAppend=false;
        this.fileList=[];
        this.uploadDialogVisible=true;
        return ;
      }
      ElMessageBox.confirm('此操作覆盖之前导入的清单内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal:false,
        type: 'warning'
      }).then(() => {
        this.uploadAppend=false;
        this.fileList=[];
        this.uploadDialogVisible=true;
      });
    },
    handleDeleteAll(){
      let that=this;
      ElMessageBox.confirm('此操作清空之前导入的清单内容, 是否继续?', '提示', {
        confirmButtonText: '清空',
        cancelButtonText: '取消',
        closeOnClickModal:false,
        type: 'warning'
      }).then(() => {
        util.request({
          model: { bizId: that.bizId },
          serviceId: "SYS00005",
          tranCode: "SYS0000005",
          onSuccess: function (jqXHR, textStatus, data) {
              that.dataSuccess=[];
              that.dataFail=[];
              that.filterData=[];
              that.rows = []; 
              that.pager.pageNo = 1;
               ElMessage.success({
                  message: '清除成功',
                  showClose: true
              });
          },
          onError: function (jqXHR, textStatus, data) {
              ElMessage.error({
                  duration: 0,
                  message: data.message,
                  showClose: true
              });
          }
        });
      });
    },
    handleImportAppend() {
      this.uploadAppend=true;
      this.fileList=[];
      this.uploadDialogVisible=true;
    },
    editRow(idx,row) {
      this.edit=true;
      this.editIndex=idx;
      this.editForm=util.getOriginalData(row);
      this.editorVisible=true;
    },
    handleFileChange(file, fileList){
      this.fileList = fileList.slice(-1);
    },
    //上传成功
    handleUploadSuccess(response, file, fileList){
      if(response.files[0] && response.files[0].error){
        this.loading=false;
        ElMessage.error({
            duration: 0,
            message: response.files[0].error,
            showClose: true
        });
        return ;
      }
      let result=response.files[0].extObj;
      for(let i=0;i<result.dataSuccess.length;i++){
        result.dataSuccess[i].status__='';//附加一个空状态
      }
      let dataSuccess=result.dataSuccess;
      let dataFail=result.dataFail;
      this.dataSuccess=dataSuccess;
      this.dataFail=dataFail;

      let total=dataSuccess.length+dataFail.length;

      if(dataFail.length>0){
        ElMessage.warning({
            duration: 0,
            showClose: true,
            message: '共导入【'+total+'】条数据，成功【'+dataSuccess.length+'】条，校验错误【'+dataFail.length+'】条'
        });
      }else{
        ElMessage.success({
            showClose: true,
            message: '共导入【'+total+'】条数据，成功【'+dataSuccess.length+'】条'
        });
      }
      this.uploadDialogVisible=false;
      this.keyword='';
      this.doFilter();
      this.renderRowData();
      this.loading=false;
    },
    handleUploadError(err, file, fileList){
      this.loading=false;
      if (err) console && console.log(err.stack);
      ElMessage.error({
          duration: 0,
          message: '文件上传失败',
          showClose: true
      });
    },
    delRow(idx,row) {
      this.rows.splice(idx,1);
      if(row.uid__){ //新增数据没有uid，直接删除
        this.dataDeleted.push(row.uid__);
      }
      this.saveAble=true;
      for(let i=0;i<this.dataSuccess.length;i++){
        if(this.dataSuccess[i].uid__==row.uid__){
          this.dataSuccess.splice(i,1);
          break;
        }
      }
      for(let i=0;i<this.filterData.length;i++){
        if(this.filterData[i].uid__==row.uid__){
          this.filterData.splice(i,1);
          break;
        }
      }
    },
    handleSizeChange(val) {
      this.pager.pageSize=val;
      this.pager.pageNo=1;
      this.renderRowData();
    },
    handleCurrentChange(val) {
      this.pager.pageNo=val;
      this.renderRowData();
    },
    //导出错误数据
    handleExport(){
      let href = window.API_URL + "core/download?type=simpleExcelExport&bizId="+ this.bizId;
      window.open(href);
    },
    localFilter(){
      //关键字查询时直接本地过滤
      this.doFilter();
      this.renderRowData();
    },
    search(){
      let that=this;
      this.loadingText='加载中';
      this.loading=true;
      util.request({
          model: { bizId: that.bizId },
          serviceId: "SYS00004",
          tranCode: "SYS0000004",
          onSuccess: function (jqXHR, textStatus, data) {
              for(let i=0;i<data.model.dataSuccess.length;i++){
                data.model.dataSuccess[i].status__='';//附加一个空状态
              }
              that.dataSuccess=data.model.dataSuccess;
              that.dataFail=data.model.dataFail;
              that.dataDeleted=[];
              that.doFilter();
              that.renderRowData();
              that.loading=false;
              that.saveAble=false;
          },
          onError: function (jqXHR, textStatus, data) {
              that.loading=false;
              ElMessage.error({
                  duration: 0,
                  message: data.message,
                  showClose: true
              });
          }
      });
    },
    //数据过滤
    doFilter(){
      let keyword=this.keyword;
      this.filterData=[];
      if(!keyword){
        this.filterData=this.dataSuccess.slice(0,this.dataSuccess.length);
        return;
      }
      for(let i=0;i<this.dataSuccess.length;i++){
        let obj=this.dataSuccess[i];
        for(let key in obj){
          if(key !='uid__' && key !='status__' && obj[key].indexOf(keyword)!=-1){
            this.filterData.push(this.dataSuccess[i]);
            break;
          }
        }
      }
    },
    //数据内存分页渲染
    renderRowData(){
      if(this.pager.total<this.pager.pageSize){
        this.pager.pageNo=1;
      }
      let pageNo=this.pager.pageNo, pageSize=this.pager.pageSize;
      let start=(pageNo-1)*pageSize;
      let ent=pageNo*pageSize;
      this.rows=this.filterData.slice(start,ent);
    },
    handleSave(){
      let that=this;
      this.loading=true;
      this.loadingText='处理中';
      let input={
        meta:this.uploadParam,
        dataDelete:this.dataDeleted,
        dataInsert:[],
        dataUpdate:[]
      };
      for(let i=0;i<this.dataSuccess.length;i++){
        let obj=util.getOriginalData(this.dataSuccess[i]);
        delete obj.status__;
        if(this.dataSuccess[i].status__=='add'){
          input.dataInsert.push(obj);
        }else if(this.dataSuccess[i].status__=='modify'){
          input.dataUpdate.push(obj);
        }
      }
      util.request({
          model: input,
          serviceId: "SYS00006",
          tranCode: "SYS0000006",
          onSuccess: function (jqXHR, textStatus, data) {
              that.dataDeleted=[];
              that.saveAble=false;
              that.search();
              ElMessage.success({
                  showClose: true,
                  message: '提交成功'
              });
              this.loading=false;
          },
          onError: function (jqXHR, textStatus, data) {
              this.loading=false;
              ElMessage.error({
                  duration: 0,
                  message: data.message,
                  showClose: true
              });
          }
      });
    },
    initEditForm(){
      let obj={};
      for(let key in this.fieldMap){
        obj[key]='';
      }
      this.editForm=obj;
    },
    addRow(){
      this.edit=false;
      this.initEditForm();
      this.editorVisible=true;
      if(this.$refs.editForm){
        this.$refs.editForm.resetFields();
      }
    },
    editorConfirm(){
      this.$refs.editForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          let obj=util.getOriginalData(this.editForm);
          if(this.edit){ //编辑
            for(let key in obj){
              this.rows[this.editIndex][key]=obj[key];
            }
            if(this.rows[this.editIndex].status__!='add'){
              this.rows[this.editIndex].status__='modify';
            }
          }else{ //新增
            obj.status__='add';
            this.rows.push(obj);
            this.filterData.push(obj);
            this.dataSuccess.push(obj);
          }
          this.editorVisible=false;
          this.saveAble=true;
        });

    },
    handleUploadPropress(event, file, fileList){
      this.loading=true;
      this.loadingText='正在上传 '+event.percent+'%';
      if(event.percent==100){
        this.loadingText='上传完毕，正在处理数据';
      }
    }
  },
  computed:{
    uploadParam(){
      return {
        bizId:this.bizId,
        templateExcel:this.templateExcel,
        templateProp:this.templateProp,
        validator:this.validator,
        expire:this.expire,
        append:this.uploadAppend
      };
    }
  }
};
</script>
