<template>
  <div class="Publiccloud-home">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <span class="postion-befor-long">|</span>
        <span class="client-postion">{{$t('Breadcrumb.Fuction')}}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('Breadcrumb.UserManagement')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ crumbs}}</el-breadcrumb-item>
    </el-breadcrumb> -->
    <the-breadcrumb>
       <el-breadcrumb-item>{{$t('Breadcrumb.UserManagement')}}</el-breadcrumb-item>
    </the-breadcrumb>

    <el-container>
      <el-aside width="20%">
        <div class="Group-title top-commonborder">
          <div class="common-title">{{$t('userMg.Usergroup')}}</div>
          <el-scrollbar class="commonScrollbar" style="height: 620px;">
            <div class="expand">
              <div>

                <el-tree ref="expandMenuList" class="expand-tree" v-if="isLoadingTree" :data="setTree" node-key="user_group_id" highlight-current :props="defaultProps" :expand-on-click-node="false" :render-content="renderContent" :default-expanded-keys="defaultExpandKeys" @node-click="handleNodeClick" accordion></el-tree>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </el-aside>
      <el-main>
        <div class="SelectedGroup-title top-commonborder">
          <div class="common-title">{{$t('userMg.Selectedgroup')}}
            <span>{{ theCurrentlySelectedGroup }}</span>
          </div>
        </div>
        <el-tabs v-model="client_activeName" @tab-click="handleClick" highlight-current-row style="min-height:600px;">
          <!--用户面板-->
          <el-tab-pane :label="$t('Breadcrumb.UserLists')" name="first">
            <el-form :inline="true">

              <el-form-item>
                <el-input class="client-input" :placeholder="$t('userMg.NameAccount')" v-model="UserlistQuery.user_name" @keyup.enter.native="searchUserinfo"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="searchUserinfo">
                  {{$t('table.Search')}}</el-button>
              </el-form-item>

              <el-form-item>
                <el-button class="client-buttom" type="primary" :disabled="isdisableButton" @click="UserMigrationDialogShowOrHide = true">{{$t('userMg.Migrateuser')}}</el-button>
              </el-form-item>

              <el-form-item v-if="this.role_code.includes(1) || this.role_code.includes(6)">
                <input type="file" @change="importExcelFile(this)" id="imFile" style="display: none" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                <el-button class="client-buttom" type="primary" @click="uploadExcelFile">{{$t('userMg.ImportStudents')}}</el-button>
              </el-form-item>

              <el-form-item>
                <a id="downlink"></a>
                <el-button class="client-buttom" type="primary" @click="downloadExportUserList">{{$t('userMg.ExportedLists')}}</el-button>
              </el-form-item>

              <el-form-item>
                <el-button type="danger" :disabled="isdisableButton" @click="deleteIds" icon="el-icon-delete">{{$t('table.Deleteselected')}}</el-button>
              </el-form-item>

            </el-form>
            <el-scrollbar class="commonScrollbar" style="height: 450px;">
              <!--列表-->
              <el-table :data="Userlist" highlight-current-row style="" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="user_name" :label="$t('userMg.Name')" width="150">
                </el-table-column>
                <el-table-column prop="login_account" :label="$t('userMg.Account')" width="120">
                </el-table-column>
                <el-table-column prop="online_equipment_code" :label="$t('equipmentMg.Isitonline')" width="120" align="center">
                  <template slot-scope="scope">
                    {{scope.row.online_equipment_code | formatBindDeviceonlie}}
                  </template>
                </el-table-column>
                <el-table-column prop="equipment_code" :label="$t('userMg.Bindeddevices')" width="170" align="center">
                  <template slot-scope="scope">
                    {{scope.row.equipment_code | formatBindDeviceNum}}
                  </template>
                </el-table-column>

                <el-table-column :label="$t('table.Operation')" width="300" align="center">
                  <template slot-scope="scope">
                    <el-button size="small" type="primary" icon="el-icon-edit-outline" @click="userHandleEdit(scope.$index, scope.row)">{{$t('table.Edit')}}</el-button>

                    <!-- <el-button size="small" type="danger" icon="el-icon-delete" @click="selectUserDelete(scope.row)">{{$t('table.delete')}}</el-button> -->

                    <el-button v-if="(scope.row.equipment_code === undefined ||scope.row.equipment_code === '') || scope.row.equipment_code.length === 0" size="small" type="danger" icon="el-icon-delete" @click="selectUserDelete(scope.row)">{{$t('table.Delete')}}</el-button>
                    <el-button :disabled="true" v-else size="small" type="danger" icon="el-icon-delete">{{$t('table.Delete')}}</el-button>


                    <el-button size="small" type="primary" icon="el-icon-more" @click="userDetails(scope.$index, scope.row)">{{$t('table.Details')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
            <!--工具条-->
            <div class="block">
              <el-pagination @size-change="userHandleSizeChange" @current-change="userHandleCurrentChange" :current-page="UserlistQuery.page_no" :page-sizes="[7, 10, 20, 30]" :page-size="UserlistQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="Usertotal_count">

              </el-pagination>
            </div>

          </el-tab-pane>

        </el-tabs>

      </el-main>
    </el-container>
    <!--用户迁移弹出框-->
    <el-dialog width="30%" height="50%" :title="$t('userMg.Pleaseselectthemigrationgroup')" :visible.sync="UserMigrationDialogShowOrHide" append-to-body>
      <div class="SelectedGroup-title top-commonborder">
        <div class="common-title">{{$t('userMg.Selectedgroup')}}
          <span>{{ removtheCurrentlySelectedGroup }}</span>
        </div>
      </div>
      <!-- <el-scrollbar style="height: 620px;"> -->
      <div class="expand">
        <div>
          <el-tree ref="expandMenuList" class="expand-tree" v-if="isLoadingTree" :data="selectedSetTree" node-key="user_group_id" highlight-current :props="defaultProps" :expand-on-click-node="false" :default-expanded-keys="defaultExpandKeys" @node-click="removalHandleNodeClick" accordion></el-tree>
        </div>
      </div>
      <!-- </el-scrollbar> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="UserMigrationDialogShowOrHide = false">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary" @click="migratingUserGroups">{{$t('table.OK')}}</el-button>
      </span>
    </el-dialog>

    <!--导入学生账号弹出框-->
    <el-dialog width="58%" height="400px !important;" :title="$t('userMg.ImportStudentss')" :visible.sync="StudentAccountDialogShow" append-to-body>
      <el-form :inline="true">
        <el-form-item>
          <el-input class="client-input" :placeholder="$t('clientMg.Privatecloudname')" v-model="privatelistQuery.private_cloud_name"></el-input>
          <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="privateCloudList">{{$t('table.Search')}}</el-button>
        </el-form-item>
        <el-form-item>
          <template slot-scope="scope">
            <el-button type="primary" class="client-input" @click="studentExcelTemplate">{{$t('userMg.ExporttoExceltemplate')}}</el-button>
          </template>
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-scrollbar class="commonScrollbar" style="height:560px;">
      <el-table :data="prvitelist"  highlight-current-row style @selection-change="updateMenthandleSelectionChange">
        <el-table-column type="" width="55">
        </el-table-column>
        <el-table-column prop="private_cloud_name" :label="$t('clientMg.Privatecloudname')" width="190">
        </el-table-column>
        <el-table-column :label="$t('table.Operation')" width="190" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="batchImportAccount(scope.$index,scope.row)">{{$t('userMg.Batchimports')}}</el-button>
          </template>

        </el-table-column>
      </el-table>
      </el-scrollbar>
      <!--工具条-->
      <div class="block">

        <el-pagination @size-change="privateHandleSizeChange" @current-change="privateHandleCurrentChange" :current-page="privatelistQuery.page_no" :page-sizes="[9, 15, 20, 30]" :page-size="privatelistQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="PrivteTotal">

        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="StudentAccountDialogShow = false">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary" @click="StudentAccountDialogShow=false">{{$t('table.OK')}}</el-button>
      </span>

    </el-dialog>

    <!--导入成功后弹出框-->
    <el-dialog width="58%" height="400px !important;" :title="$t('userMg.Searchimporteddata')" :visible.sync="ImportUserDialogShow" append-to-body>
      <!--列表-->
      <el-table :data="importlist" class="el-table-common-height" highlight-current-row style="width: 100%;">
        <el-table-column prop="user_name" :label="$t('userMg.Name')" width="120">
        </el-table-column>
        <el-table-column prop="login_account" :label="$t('userMg.Account')" width="120">
        </el-table-column>
        <el-table-column prop="password" :label="$t('userMg.password')" width="120">
        </el-table-column>
        <el-table-column prop="remark" :label="$t('userMg.Comments')" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.remark | RemrkFilter">{{scope.row.remark | formatRemark}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="ImportUserDialogShow = false">{{$t('userMg.close')}}</el-button>
        <el-button type="primary" class="client-buttom" @click="downLoadImportAccount">{{$t('userMg.ExporttoExcel')}}</el-button>
      </span>

    </el-dialog>
    <!--用户编辑查看详情-->
    <el-dialog width="50%" height="400px !important;" :title="textMap[UserDialogStstus]" :visible.sync="UserDialogShow" append-to-body>
      <el-form :inline="true" :model="UsereditForm" label-position="left" label-width="130px" style='width: 400px; margin-left:50px;' :rules="editFormRules" ref="UsereditForm" class="demo-form-inline">
        <el-form-item :label="$t('userMg.StudentID')" prop="student_code" v-if="UserlistQuery.role_code ===3 || this.UserDialogStstus=='update'">
          <el-input :disabled="true" class="client-input" name="email" v-model="UsereditForm.student_code"></el-input>
        </el-form-item>
        <el-form-item :label="$t('userMg.Name')">
          <el-input name="user_name" v-model="UsereditForm.user_name" class="client-input" :readonly="UserInfoisReadOnly"></el-input>
        </el-form-item>
        <el-form-item :label="$t('userMg.Account')" v-if="UserDialogStstus=='detail'">
          <el-input name="login_account" v-model="UsereditForm.login_account" class="client-input" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.Date')" prop="create_time" v-if="UserDialogStstus=='detail'">
          <el-date-picker style="width:200px;" v-model="UsereditForm.create_time" type="date" :placeholder="$t('table.Date')" :readonly="true">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('userMg.Comments')" prop="remark">
          <el-input class="client-input" name="remark" v-model="UsereditForm.remark" :readonly="UserInfoisReadOnly"></el-input>
        </el-form-item>
        <el-form-item :label="$t('userMg.UserID')" prop="user_id" v-if="UserDialogStstus=='detail'">
          <el-input name="user_id" v-model="UsereditForm.user_id" class="client-input" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('userMg.Emails')" prop="email">
          <el-input class="client-input" name="email" v-model="UsereditForm.email" :readonly="UserInfoisReadOnly"></el-input>
        </el-form-item>
        <el-form-item :label="$t('userMg.cellnumber')" prop="mobile">
          <el-input name="mobile" v-model="UsereditForm.mobile" class="client-input" :readonly="UserInfoisReadOnly"></el-input>
        </el-form-item>
        <el-form-item :label="$t('userMg.UsergroupID')" prop="user_group_id" v-if="UserDialogStstus=='detail'">
          <el-input name="user_group_id" v-model="UsereditForm.user_group_id" class="client-input" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('userMg.Usergroupname')" prop="user_group_name" v-if="UserDialogStstus=='detail'">
          <el-input name="user_group_name" v-model="UsereditForm.user_group_name" class="client-input" :readonly="true"></el-input>
        </el-form-item>
        <div>
          <img :src="png_path" :alt="png_pathAlt" style="vertical-align: middle;" /></div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="UserDialogStstus=='detail'" type="primary" @click="UserDialogShow = false">{{$t('table.OK')}}</el-button>
        <el-button v-if="UserDialogStstus=='update'" type="primary" @click="UserDialogShow = false">{{$t('table.Cancel')}}</el-button>
        <el-button v-if="UserDialogStstus=='update'" type="primary" @click="updateUser()">{{$t('table.OK')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
require('file-saver')
require('@/vendor/Blob')
import { formatRemark } from '@/filters'
import {
  getUserinfo,
  userGroup_queryPublicCloud_token_get,
  userGroup_deletePublicCloud_user_group_id_token_get,
  userGroup_deletePrivatecloud_user_group_id_token_get,
  userGroup_insertPublicCloud_token_post,
  userGroup_queryPrivatecloud_token_get,
  userGroup_insertPrivatecloud_type_token_post,
  userGroup_migratoryUser_token_get,
  user_update_user_id_token_post,
  user_delete_token,
  user_registrationStudent_private_cloud_id_user_group_id_token_post,
  file_download_studentExcelTemplate_token,
  user_getBindingEquipmentQRCode_user_id_token
} from '@/api/user/user'
import { replaceExcelZhToEn } from '@/utils/replace' // 替换excel里面的中文数据为英文
import { privateCloud_pagedQuery_page_no_page_size_token_get } from '@/api/privateCloud/privateCloud'
import treeRender from '@/components/common/treerender'
var XLSX = require('xlsx')
export default {
  name: 'UserManagement',
  data() {
    return {
      UserDialogStstus: '', // 编辑用户和查看属性

      UserInfoisReadOnly: false, // 用户信息是否只读

      textMap: {
        update: this.$t('table.Edit'),
        detail: this.$t('table.Details')
      },

      // 所有分组
      allOfTheGroup: {
        user_group_id: '',
        user_group_name: this.$t('userMg.Allgroups'),
        parent_group_id: 0,
        sub_user_group: []
      },

      UserDialogShow: false, // 用户弹出框显示属性

      // 查看用户form元素
      UsereditForm: {
        user_name: '',
        user_id: '',
        student_code: '',
        mobile: '',
        remark: '',
        user_group_id: '',
        user_group_name: '',
        parent_user_id: '',
        password: ''
      },

      editFormRules: {}, // 用户非空验证属性

      ImportUserDialogShow: false, // 导入成功后弹出框显示属性

      importlist: [], // 导入成功数据表格

      batchImportAccountParams: {}, // 批量导入学生账号参数

      fullscreenLoading: false, // 加载中

      StudentAccountDialogShow: false, // 导入学生数据弹出框

      imFile: '', // 导入文件el

      PrivteTotal: null, // 私有分页属性

      excelStudentData: [], // excel批量导入学生账号数据

      user_ids: [], // 批量操作用户ID

      png_path: '', // 二维码图片路径

      png_pathAlt: '', // 二维码图片路径提示

      prvitelist: [], // 私有云导出数据表格

      UserappliactionList: [], // 应用面板数据表格

      theCurrentlySelectedUserGroup_id: '', // 当前选中的用户分组id

      removaltheCurrentlySelectedUserGroup_id: '', // 当前选中要迁移的用户分组id

      deleteUserids: [], // 批量删除用户数组

      theCurrentlySelectedGroup: this.$t('userMg.Allgroups'), // 当前选中的分组名称

      removtheCurrentlySelectedGroup: this.$t('userMg.Null'), // 迁移当前选中分组名称

      isdisableButton: true, // 按钮是否禁用

      role_code: '', // 权限id

      multipleSelection: [], // 用户多选数组

      UserListByUserGroupId: [], // 用户分组表格根据用户分组id得到

      UserMigrationDialogShowOrHide: false, // 用户迁移弹出框

      client_activeName: 'first',

      Userlist: [], // 用户数据表格

      Usertotal_count: null, // 用户分页

      user_id: '', // 用户ID

      // 用户分页参数
      UserlistQuery: {
        page_no: 1,
        page_size: 7,
        user_name: '',
        role_code: 3,
        user_group_id: '',
        user_id: ''
      },

      // 私有云分页参数
      privatelistQuery: {
        page_no: 1,
        page_size: 9,
        private_cloud_name: '' // 私有云名称
      },

      crumbs: this.$t('Breadcrumb.UserLists'), // 面包屑 当前所在位置

      updatementmultipleSelection: [], // 批量导出学生信息多选数组

      // 下面的是 tree 配置
      isLoadingTree: false, // 是否加载节点树

      setTree: [], // 节点树数据

      selectedSetTree: [], // 要迁移的节点树数据

      // 用户树形参数
      defaultProps: {
        children: 'sub_user_group',
        label: 'user_group_name'
      },

      defaultExpandKeys: [] // 默认展开节点列表
    }
  },
  created() {
    // 查询用户信息
    this.getUserList()
    this.role_code = this.$store.getters.roles
    if (this.role_code.includes(1)) {
      this.userGroup_queryPublicCloud_token_get()
    } else if (this.role_code.includes(2)) {
      this.userGroup_queryPrivatecloud_token_get()
    } else if (this.role_code.includes(6)) {
      this.userGroup_queryPublicCloud_token_get()
    }
  },
  watch: {
    multipleSelection(curVal, oldVal) {
      if (curVal.length === 0) {
        this.isdisableButton = true
      } else if (curVal.length !== 0) {
        this.isdisableButton = false
      }
    }
  },

  mounted() {
    this.initExpand()
    this.imFile = document.getElementById('imFile')
  },
  methods: {
    // 获取指定用户绑定设备的二维码
    userGetBindingEquipmentQRCode() {
      const token = this.$store.getters.token
      user_getBindingEquipmentQRCode_user_id_token(
        this.user_id + '/' + token
      ).then(response => {
        if (response.errorCode === 0) {
          this.png_path = response.png_path
        } else {
          this.png_pathAlt = this.$t('userMg.QRcodewillsupportsoon')
        }
      })
    },

    // 替换excel里面的中文数据为英文
    replaceExcelZhToEn,

    // 格式化备注
    formatRemark,

    // 批量注册学生导出Excel模板
    studentExcelTemplate() {
      file_download_studentExcelTemplate_token().then(response => {
        if (response === null) {
          this.$message(
            this.$t('message.Thefiledoesntexists'),
            this.$t('message.Notification'),
            {
              type: 'warning'
            }
          )
          return false
        }
        const url = window.URL.createObjectURL(new Blob([response]))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute(
          'download',
          this.$t('userMg.Studentsaccounttemplate')
        )
        document.body.appendChild(link)
        link.click()
      })
    },

    // 下载导入学生账号的结果
    downLoadImportAccount() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          this.$t('userMg.Name'),
          this.$t('userMg.Account'),
          this.$t('userMg.password'),
          this.$t('userMg.result')
        ]
        const filterVal = ['user_name', 'login_account', 'password', 'remark']
        const list = this.importlist
        const data = this.formatImportAccountJson(filterVal, list)
        excel.export_json_to_excel(
          tHeader,
          data,
          this.$t('userMg.Theresultofimportaccounts')
        )
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
    },
    // 查看用户详情
    userDetails(index, row) {
      this.UserDialogShow = true
      this.UserInfoisReadOnly = true // 详情的时候设置输入框只读为true
      this.UserDialogStstus = 'detail'
      this.userGetBindingEquipmentQRCode()
      this.UsereditForm = Object.assign({}, row)
    },
    // 确认迁移用户分组
    migratingUserGroups() {
      // 声明迁移用户分组的参数
      var migratingUserGroupsParment = {}
      migratingUserGroupsParment.user_group_id = this.removaltheCurrentlySelectedUserGroup_id
      migratingUserGroupsParment.user_ids = this.user_ids
      userGroup_migratoryUser_token_get(migratingUserGroupsParment).then(
        response => {
          if (response.errorCode === 0) {
            this.$message.success(this.$t('message.Migratesuccessed'))
          } else {
            this.$message.error(response.errorMessage)
          }
          this.getUserList()
          this.UserMigrationDialogShowOrHide = false
        }
      )
    },
    // 批量导入学生账号
    batchImportAccount(index, rwo) {
      this.batchImportAccountParams.private_cloud_id = rwo.private_cloud_id
      this.batchImportAccountParams.user_group_id = this.theCurrentlySelectedUserGroup_id
      // 按钮导入
      this.imFile.click()
    },
    // 查询私有云数据
    privateCloudList() {
      this.privateQuery()
    },
    // 查询私有云方法
    privateQuery() {
      privateCloud_pagedQuery_page_no_page_size_token_get(
        this.privatelistQuery
      ).then(response => {
        this.prvitelist = response.result.list
        this.PrivteTotal = response.result.total_count
      })
    },
    dealFile(data) {
      // 处理导入的数据
      this.imFile.value = ''
      this.fullscreenLoading = false
      if (data.length <= 0) {
        this.$message.error(
          this.$t('message.Pleasemakesuretoimportthecorrectinformation')
        )
      } else {
        var newDataArray = this.replaceExcelZhToEn(data)
        // 替换学号为student_code
        var replaceStudentNo = JSON.parse(
          JSON.stringify(newDataArray).replace(/学号/g, 'student_code')
        )

        this.batchImportAccountParams.excelStudentData = replaceStudentNo
        user_registrationStudent_private_cloud_id_user_group_id_token_post(
          this.batchImportAccountParams
        ).then(response => {
          if (response.errorCode === 0) {
            this.$message.success(this.$t('message.SuccessfulImport'))
          }
          this.importlist = response.result
          this.ImportUserDialogShow = true
        })
      }
    },
    analyzeData(data) {
      // 此处可以解析导入数据
      return data
    },
    fixdata(data) {
      // 文件流转BinaryString
      var o = ''
      var l = 0
      var w = 10240
      for (; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        )
      }
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    },
    // 导入excel
    importExcelFile() {
      this.fullscreenLoading = true
      const obj = this.imFile
      if (!obj.files) {
        this.fullscreenLoading = false
        return
      }
      var f = obj.files[0]
      var reader = new FileReader()
      const $t = this
      reader.onload = function(e) {
        var data = e.target.result
        if ($t.rABS) {
          $t.wb = XLSX.read(btoa(this.fixdata(data)), {
            // 手动转化
            type: 'base64'
          })
        } else {
          $t.wb = XLSX.read(data, {
            type: 'binary'
          })
        }
        const json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]])
        $t.dealFile($t.analyzeData(json)) // analyzeData: 解析导入数据
      }
      if (this.rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    },
    // excel批量导入用户数据
    uploadExcelFile() {
      if (
        this.theCurrentlySelectedUserGroup_id === '' ||
        this.theCurrentlySelectedUserGroup_id === 0
      ) {
        this.$message.error(
          this.$t('userMg.PleaseselecttheuserGroup')
        )
        return false
      }
      this.StudentAccountDialogShow = true
      this.privateCloudList()
    },
    s2ab(s) {
      // 字符串转字符流
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xff
      }
      return buf
    },
    getCharCol(n) {
      // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
      let s = ''
      let m = 0
      while (n > 0) {
        m = n % 26 + 1
        s = String.fromCharCode(m + 64) + s
        n = (n - m) / 26
      }
      return s
    },
    // 导出来用户列表数据 downloadExportUserList
    downloadExportUserList() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [this.$t('userMg.Name'), this.$t('userMg.Account')]
        const filterVal = ['user_name', 'login_account']
        const list = this.Userlist
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel(tHeader, data, this.$t('userMg.Userinformation'))
      })
    },
    /*eslint no-dupe-keys:*/
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    },
    // 用户修改方法
    updateUser() {
      this.$refs.UsereditForm.validate(valid => {
        if (valid) {
          this.$confirm(
            this.$t('message.Areyousuretoeditit'),
            this.$t('message.Notification'),
            {
              type: 'warning'
            }
          )
            .then(() => {
              user_update_user_id_token_post(this.UsereditForm).then(
                response => {
                  if (response.errorCode === 0) {
                    this.$message.success(
                      this.$t('message.Editsuccessed')
                    )
                  }
                  this.UserDialogShow = false
                }
              )
              this.getUserList()
            })
            .catch(() => {})
        }
      })
    },
    // 编辑显示方法
    userHandleEdit(index, row) {
      this.UserDialogShow = true
      this.UserInfoisReadOnly = false // 编辑的时候设置输入框只读为false
      this.UserDialogStstus = 'update'
      // 把当前行的数据赋给this.editForm
      this.UsereditForm = Object.assign({}, row)
    },
    // 删除用户按钮
    selectUserDelete(row) {
      this.$confirm(
        this.$t('message.Areyousuretodelete'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          var user_ids = new Array(0)
          user_ids.push(row.user_id)
          user_delete_token(user_ids).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Deletesuccessed'))
            }
            this.getUserList()
          })
        })
        .catch(() => {})
    },
    // 查询公有云用户分组
    userGroup_queryPublicCloud_token_get() {
      userGroup_queryPublicCloud_token_get().then(response => {
        this.selectedSetTree = response.result
        // 先添加上面声明的所有分组
        this.setTree.push(this.allOfTheGroup)
        if (response === null || response.result === null) {
          return false
        }
        // 再添加接口返回的分组
        for (var value of response.result) {
          this.setTree.push(value)
        }
      })
    },
    // 查询私有云用户分组
    userGroup_queryPrivatecloud_token_get() {
      userGroup_queryPrivatecloud_token_get().then(response => {
        this.selectedSetTree = response.result
        // 先添加上面声明的所有分组
        this.setTree.push(this.allOfTheGroup)
        // 再添加接口返回的分组
        for (var value of response.result) {
          this.setTree.push(value)
        }
      })
    },
    // 批量删除用户信息
    deleteIds() {
      if (this.multipleSelection.length === 0) {
        return
      }
      this.$confirm(
        this.$t('message.Areyousuretodelete'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          var ids = this.multipleSelection.map(item => item.user_id).join() // 获取所有选中行的id组成的字符串，以逗号分隔
          var strs = ids.split(',') // 字符分割
          for (var i = 0; i < strs.length; i++) {
            // 如果为空不添加
            if (strs[i] !== '') {
              this.deleteUserids.push(strs[i])
            }
          }
          user_delete_token(this.deleteUserids).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Deletesuccessed'))
            }
            this.getUserList()
          })
        })
        .catch(() => {})
    },
    // 查询用户信息
    searchUserinfo() {
      // 分页模糊查询默认第一页
      this.UserlistQuery.page_no = 1
      this.getUserList()
    },
    // 查询用户数据
    getUserList() {
      if (this.UserlistQuery.user_group_id === 0) {
        this.UserlistQuery.user_group_id = ''
        this.getUserList()
      } else {
        getUserinfo(this.UserlistQuery).then(response => {
          if (response.errorCode === 0) {
            // if (response.result.list.length === 0) {
            //   this.$message.error(
            //     // this.$t('userMg.NoUserThatMatchesTheSearchCondition')
            //   )
            // }
            this.Userlist = response.result.list
            this.Usertotal_count = response.result.total_count
          } else {
            this.$message.error(
              this.$t('userMg.Nonexists')
            )
            this.Userlist = []
          }
        })
      }
    },
    // 用户列表
    userHandleSizeChange(val) {
      this.UserlistQuery.page_size = val
      this.getUserList()
    },
    userHandleCurrentChange(val) {
      this.UserlistQuery.page_no = val
      this.getUserList()
    },
    // 批量导出学生信息多选
    updateMenthandleSelectionChange(val) {
      this.updatementmultipleSelection = val
    },
    // 私有云
    privateHandleSizeChange(val) {
      this.privatelistQuery.page_size = val
      this.privateQuery()
    },
    privateHandleCurrentChange(val) {
      this.privatelistQuery.page_no = val
      this.privateQuery()
    },

    handleClick(tab, event) {
      this.crumbs = tab.label
    },
    // 用户列表多选数组
    handleSelectionChange(val) {
      this.multipleSelection = val
      var ids = this.multipleSelection.map(item => item.user_id).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.user_ids = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.user_ids.push(strs[i])
        }
      }
    },
    initExpand() {
      this.setTree.map(a => {
        this.defaultExpandKeys.push(a.user_group_id)
      })
      this.isLoadingTree = true
    },
    handleNodeClick(d, n, s) {
      // 重置分页参数
      this.UserlistQuery =
      {
        page_no: 1,
        page_size: 7,
        user_name: '',
        role_code: 3,
        user_group_id: '',
        user_id: ''
      }
      // 选中的用户分组的id
      this.theCurrentlySelectedUserGroup_id = d.user_group_id
      // 选中的用户分组的名称显示出来
      this.theCurrentlySelectedGroup = d.user_group_name
      this.UserlistQuery.user_group_id = this.theCurrentlySelectedUserGroup_id
      // 根据用户组查询用户信息
      this.getUserList()
      // 点击节点
      d.isEdit = false // 放弃编辑状态
    },
    removalHandleNodeClick(d, n, s) {
      // 迁移选中的用户分组的id
      this.removaltheCurrentlySelectedUserGroup_id = d.user_group_id
      // 选中用户分组的名称显示出来
      this.removtheCurrentlySelectedGroup = d.user_group_name
    },
    renderContent(h, { node, data, store }) {
      // 加载节点
      this.$set(node, 'isEdit', false)
      const that = this
      return h(treeRender, {
        props: {
          DATA: data,
          NODE: node,
          STORE: store
        },
        on: {
          nodeAdd: (s, d, n) => that.handleAdd(s, d, n),
          nodeEdit: (s, d, n) => that.handleEdit(s, d, n),
          nodeDel: (s, d, n) => that.handleDelete(s, d, n)
        }
      })
    },
    handleAddTop() {
      const user_group_parmentadd = {
        user_group_name: this.$t('behaviorMg.Newnode'),
        parent_group_id: 0,
        sub_user_group: []
      }
      if (this.role_code.includes(1)) {
        // 添加用户分组信息
        userGroup_insertPublicCloud_token_post(user_group_parmentadd).then(
          response => {
            this.setTree.push({
              user_group_id: response.result.user_group_id,
              user_group_name: this.$t('behaviorMg.Newnode'),
              parent_group_id: 0,
              sub_user_group: []
            })
          }
        )
      } else if (this.role_code.includes(2)) {
        userGroup_insertPrivatecloud_type_token_post(
          user_group_parmentadd
        ).then(response => {
          this.setTree.push({
            user_group_id: response.result.user_group_id,
            user_group_name: this.$t('behaviorMg.Newnode'),
            parent_group_id: 0,
            sub_user_group: []
          })
        })
      }
    },

    handleAdd(s, d, n) {
      const user_group_parmentadd = {
        user_group_name: this.$t('behaviorMg.Newnode'),
        parent_group_id: d.user_group_id,
        sub_user_group: [],
        type: 2
      }
      if (this.role_code.includes(1) || this.role_code.includes(6)) {
        // 增加节点
        if (n.level >= 6) {
          this.$message.error(this.$t('equipmentMg.Onlysupport5levels'))
          return false
        }
        // 添加用户分组信息
        userGroup_insertPublicCloud_token_post(user_group_parmentadd).then(
          response => {
            if (response.errorCode === 0) {
              if (d.sub_user_group === null) {
                this.$set(d, 'sub_user_group', [])
              }
              // 要添加的用户分组参数
              var addUser_group = {
                user_group_id: response.result.user_group_id,
                user_group_name: this.$t('behaviorMg.Newnode'),
                parent_group_id: d.user_group_id,
                sub_user_group: []
              }
              if (d.user_group_id === '') {
                this.setTree.push(addUser_group)
                return false
              }
              d.sub_user_group.push(addUser_group)
            } else {
              this.$message.error(response.errorMessage)
            }
          }
        )
      } else if (this.role_code.includes(2)) {
        // 增加节点
        if (n.level >= 3) {
          this.$message.error(this.$t('userMg.Onlysupport3levels'))
          return false
        }
        userGroup_insertPrivatecloud_type_token_post(
          user_group_parmentadd
        ).then(response => {
          if (response.errorCode === 0) {
            if (d.sub_user_group === null) {
              this.$set(d, 'sub_user_group', [])
            }
            // 要添加的用户分组参数
            var addUser_group = {
              user_group_id: response.result.user_group_id,
              user_group_name: this.$t('behaviorMg.Newnode'),
              parent_group_id: d.user_group_id,
              sub_user_group: []
            }
            if (d.user_group_id === '') {
              this.setTree.push(addUser_group)
              return false
            }
            d.sub_user_group.push(addUser_group)
          } else {
            this.$message.error(response.errorMessage)
          }
        })
      }
    },

    handleEdit(s, d, n) {
      // 编辑节点
    },

    handleDelete(s, d, n) {
      // 删除节点
      const that = this
      // 有子级不删除
      if (d.sub_user_group && d.sub_user_group.length !== 0) {
        this.$message.error(
          this.$t('message.Youarenotallowedtodeletethenonemptynode')
        )
        return false
      } else {
        // 新增节点直接删除，否则要询问是否删除
        const delNode = () => {
          // 删除用户分组
          if (this.role_code.includes(1) || this.role_code.includes(6)) {
            userGroup_deletePublicCloud_user_group_id_token_get(
              d.user_group_id
            ).then(res => {
              if (res.errorCode === 0) {
                this.$message.success(this.$t('message.Deletesuccessed'))
                const list = n.parent.data.sub_user_group || this.setTree // 节点同级数据
                let _index = 0 // 要删除的index
                list.map((c, i) => {
                  if (d.user_group_id === c.user_group_id) {
                    _index = i
                  }
                })
                const k = list.splice(_index, 1)
                console.log(k)
              } else {
                this.$message.error(res.errorMessage)
              }
            })
          } else if (this.role_code.includes(2)) {
            userGroup_deletePrivatecloud_user_group_id_token_get(
              d.user_group_id
            ).then(res => {
              if (res.errorCode === 0) {
                this.$message.success(this.$t('message.Deletesuccessed'))
                const list = n.parent.data.sub_user_group || this.setTree // 节点同级数据
                let _index = 0 // 要删除的index
                list.map((c, i) => {
                  if (d.user_group_id === c.user_group_id) {
                    _index = i
                  }
                })
                const k = list.splice(_index, 1)
                console.log(k)
              } else {
                this.$message.error(res.errorMessage)
              }
            })
          }
        }
        const isDel = () => {
          that
            .$confirm(
              this.$t('message.Areyousuretodeltethisnode'),
              this.$t('message.Notification'),
              {
                confirmButtonText: this.$t('message.OK'),
                cancelButtonText: this.$t('message.Cancel'),
                type: 'warning'
              }
            )
            .then(() => {
              delNode()
            })
            .catch(() => {
              return false
            })
        }
        isDel()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'static/css/userAndDeviceCommon.scss';
</style>



