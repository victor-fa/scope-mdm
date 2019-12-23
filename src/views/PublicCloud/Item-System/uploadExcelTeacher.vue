<template>
  <div class="Publiccloud-home">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <span class="postion-befor-long">|</span>
        <span class="client-postion">{{$t('Breadcrumb.Fuction')}}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('Breadcrumb.SystemManagement')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ crumbs}}</el-breadcrumb-item>
    </el-breadcrumb> -->
       <the-breadcrumb>
       <el-breadcrumb-item>{{$t('Breadcrumb.SystemManagement')}}</el-breadcrumb-item>
    </the-breadcrumb>
    <upload-excel-component :on-success='selected' :before-upload="beforeUpload"></upload-excel-component>
    <el-table height="510px" :data="tableData" border highlight-current-row style="width: 100%;margin:5px auto;">
      <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
      </el-table-column>
    </el-table>
    <div style="margin:5px auto;text-align: right;">
    <el-button  type="primary" :disabled="isdisableButton"   @click="userRegistration">{{$t('table.OK')}}</el-button>
    <el-button  type="primary" @click="teacherExcelTemplate">{{$t('systemMg.Downloadtemplate')}}</el-button>
     <el-button  type="primary" @click="createDevice">{{$t('systemMg.Return')}}</el-button>
     </div>
  <!--显示注册结果-->
  <el-dialog width="58%" height="400px !important;" :title="$t('systemMg.Result')" :visible.sync="UserDialogShow" append-to-body>
   <el-table :data="Teacherlist" height="450" highlight-current-row style="width: 100%;" >
       <el-table-column  width="55">
          </el-table-column>
        <el-table-column prop="user_name" :label="$t('systemMg.Username')" width="200">
        </el-table-column>
        <el-table-column prop="password" :label="$t('systemMg.password')" width="200">
        </el-table-column>
        <el-table-column prop="email" :label="$t('systemMg.Email')" width="200">
        </el-table-column>
        <el-table-column prop="remark"  :label="$t('systemMg.Comments')" width="300">
           <template slot-scope="scope">
            <el-tag :type="scope.row.remark | RemrkFilter">{{scope.row.remark | formatRemark}}</el-tag>
          </template>
        </el-table-column>
   </el-table>
    <!--工具条-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="UserDialogShow = false">{{$t('userMg.close')}}</el-button>
        <el-button type="primary" class="client-buttom" @click="downloadImportAccount">{{$t('userMg.ExporttoExcel')}}</el-button>
      </span>
     </el-dialog>
   </div>
</template>
<script>
import { user_userRegistration_token_post } from '@/api/user/user'
import { replaceExcelZhToEn } from '@/utils/replace'// 替换excel里面的中文数据为英文
import { formatRemark } from '@/filters'
export default {
  name: 'uploadExcel',
  data() {
    return {
      UserDialogShow: false, // 显示注册结果弹出框属性

      isdisableButton: true, // 批量注册老师确定按钮是否禁用

      crumbs: this.$t('systemMg.Inportteachersinformations'),

      tableData: [], // 文件上传数据表格

      tableHeader: [], // 表格头部数据

      Teacherlist: [] // 注册成功之后显示数据表格

    }
  },
  watch: {
    // 管理员选中按钮事件
    tableData(curVal, oldVal) {
      if (curVal.length > 0) {
        this.isdisableButton = false
      } else if (curVal.length < 0) {
        this.isdisableButton = true
      }
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      // const isExcel = /\.(xlsx|xls)$/.test(file.name)
      // if (!isExcel) {
      //   this.$message.warning(
      //     '只能上传Excel格式文件'
      //   )
      // }
      if (!isLt1M) {
        this.$message.warning(this.$t('message.Pleasedonotuploadfileslargerthan1minsize'))
      }
      return isLt1M
    },
    // 替换excel里面的中文数据为英文
    replaceExcelZhToEn,

    // 导出老师账号模板
    teacherExcelTemplate() {
      window.open(
        'mdm/file/download/teacherExcelTemplate/' + this.$store.getters.token
      )
    },
    selected({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    },

    // 跳转
    createDevice() {
      this.$router.push({
        path: '/system-management',
        query: { client_activeName: 'first' }
      })
    },

    // 循环向老师数组每个老师对象里面添加 roleCode
    iterationAddRoleCode(data) {
      for (var j = 0; j < data.length; j++) {
        data[j].role_codes = [4]
      }
    },

    // 批量注册老师
    userRegistration() {
      // if (this.multipleSelection.length === 0) {
      //   return
      // }
      this.iterationAddRoleCode(this.tableData)
      var newDataArray = this.replaceExcelZhToEn(this.tableData)
      // 替换邮箱为email
      var replaceemail = JSON.parse(
        JSON.stringify(newDataArray).replace(/邮箱/g, 'email')
      )
      console.log(this.tableData)
      user_userRegistration_token_post(replaceemail).then(response => {
        this.Teacherlist = response.result
        if (response.errorCode === 0) {
          // this.$message.success(this.$t('message.SuccessfulImport'))
        } else {
          this.$message.error(response.errorMessage)
        }
        this.UserDialogShow = true
      })
    },

    formatRemark, //  格式化表格备注列

    // 下载导入老师账号的结果
    downloadImportAccount() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [this.$t('systemMg.Username'), this.$t('systemMg.password'), this.$t('systemMg.Email'), this.$t('systemMg.Result')]
        const filterVal = ['user_name', 'password', 'email', 'remark']
        const list = this.Teacherlist
        const data = this.formatImportAccountJson(filterVal, list)
        excel.export_json_to_excel(tHeader, data, this.$t('userMg.Theresultofimportaccounts'))
      })
    },
    formatImportAccountJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'remark') {
            console.log('remark' + v[j])
            return formatRemark(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
<style lang="scss">
.float-right {
  float: right;
  margin-left: 30px;
}


</style>

