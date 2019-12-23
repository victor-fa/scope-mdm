<template>
  <div class="Publiccloud-home">
    <!--公共组件-->
    <theBreadcrumb>
      <el-breadcrumb-item>{{$t('Breadcrumb.SystemManagement')}}</el-breadcrumb-item>
    </theBreadcrumb>
    <el-tabs v-model="client_activeName" @tab-click="handleClick">
      <!-- 系统管理员面板-->
      <el-tab-pane :label="$t('Breadcrumb.Administrators')" name="first">
        <el-form :inline="true">
            <el-form-item>
              <el-input class="client-input" :placeholder="$t('systemMg.AdministratorsAccount')" v-model="UserlistQuery.user_name" @keyup.enter.native="adminQuery"></el-input>
            </el-form-item>
            <!--公有云
            1：公有云系统管理员
            5：家长
            6：市场专员
            7：内容专员
            8：管控专员
            10：审核专员

          私有云
            2：私有云系统管理员
            4：老师
            7：内容专员
            8：管控专员
            9：校长
            10：审核专员 -->
            <el-form-item>
              <el-select ref="selectSystem" @change='selectRoleChange' :placeholder="$t('systemMg.Pleaseselectanrole')" v-model="UserlistQuery.role_code">
                <el-option v-for="item in UserLogOptions" :key="item.role_code" :label="item.role_name" :value="item.role_code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="adminQuery">{{$t('table.Search')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="client-buttom" icon="el-icon-circle-plus-outline" @click="addAdministrator">{{$t('table.Add')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" :disabled="isdisableButton" @click="deleteIds" icon="el-icon-delete">{{$t('table.Deleteselected')}}</el-button>
            </el-form-item>
            <el-form-item>
              <router-link to="/uploadExcelTeacher">
                <el-button type="primary" class="client-buttom" icon="el-icon-circle-plus-outline" v-if="this.role_code.includes(2)">{{$t('systemMg.Inportteachersinformations')}}</el-button>
              </router-link>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-if="this.UserlistQuery.role_code==4" class="client-buttom" :disabled="isdisableButton"  @click="teacherClassShow">{{$t('systemMg.Pleaseselectaclassoftheteacher')}}</el-button>
            </el-form-item>
        </el-form>
        <!--系统管理员列表-->
          <el-scrollbar class="commonScrollbar" style="height: 560px;">
        <el-table :data="tablecolsAdmin" height="560px" highlight-current-row style="" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
            <el-table-column prop="user_name" :label="$t('systemMg.AdministratorsName')" width="190">
          </el-table-column>
          <el-table-column prop="login_account" :label="$t('systemMg.LoginAccount')" width="180">
          </el-table-column>
          <el-table-column prop="create_time" :label="$t('table.Date')" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="user_id" :label="$t('table.Operation')" width="200" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="primary" icon="el-icon-edit-outline" @click="userHandleEdit(scope.$index, scope.row)">{{$t('table.Edit')}}</el-button>
              <el-button size="small" type="danger" icon="el-icon-delete" @click="selectUserDelete(scope.row)">{{$t('table.Delete')}}</el-button>

            </template>
          </el-table-column>
        </el-table>
          </el-scrollbar>
        <!--工具条-->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="UserlistQuery.page" :page-sizes="[9, 10, 20, 30]" :page-size="UserlistQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="UserTotal">
          </el-pagination>
        </div>
      </el-tab-pane>

      <!--用户操作日志面板 -->
      <el-tab-pane :label="$t('Breadcrumb.OperationLogs')" name="Four">
        <el-form :inline="true">
            <el-form-item>
              <el-input class="client-input" :placeholder="$t('systemMg.Username')" v-model="LoglistQuery.user_name" @keyup.enter.native="querUser"></el-input>
            </el-form-item>
            <el-form-item>
              <el-date-picker  v-model="logCreate_time" type="datetime" :placeholder="$t('systemMg.Start')"> </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-date-picker v-model="logUpdate_time" :picker-options="pickerOptions" type="datetime" :placeholder="$t('systemMg.End')"> </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="querUser">
                {{$t('table.Search')}}</el-button>
            </el-form-item>
            <el-button type="primary" class="client-buttom" icon="document" @click="handleDownload">{{$t('systemMg.ExporttoExcelfile')}}</el-button>
        </el-form>
        <!--用户操作日志列表-->
          <el-scrollbar class="commonScrollbar" style="height: 560px;">
        <el-table :data="tableData"  highlight-current-row style="">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="user_name" :label="$t('systemMg.Username')" width="150">
          </el-table-column>
          <el-table-column prop="right_name" :label="$t('systemMg.Description')" width="260">
          </el-table-column>
          <el-table-column prop="create_time" :label="$t('table.Date')" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="execution_state" :label="$t('table.Status')" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.execution_state | LogStateFilter">{{scope.row.execution_state|formatLogStata}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
          </el-scrollbar>
        <!--工具条-->
        <div class="block">
          <el-pagination @size-change="logHandleSizeChange" @current-change="logHandleCurrentChange" :current-page="LoglistQuery.page_no" :page-sizes="[9, 10, 20, 30]" :page-size="LoglistQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="LogTotal">
          </el-pagination>
        </div>

      </el-tab-pane>
      <!--客户端异常日志-->
      <el-tab-pane :label="$t('Breadcrumb.Deviceerrorlogs')" name="three">
        <el-scrollbar class="commonScrollbar" style="height: 560px;">
        <!--客户端异常日志列表-->
        <el-table :data="ClientLogData"  highlight-current-row style="">
          <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
          <el-table-column prop="crash_log_id" :label="$t('systemMg.ExceptionlogID')" width="230">
          </el-table-column>
          <el-table-column prop="device_id" :label="$t('equipmentMg.DeviceID')" width="260">
          </el-table-column>
           <el-table-column prop="log"   :label="$t('systemMg.Abnormalcontent')" width="200" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="create_time" :label="$t('table.Date')" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

        </el-table>
        </el-scrollbar>
        <!--工具条-->
        <div class="block">
          <el-pagination @size-change="clientLoghandleSizeChange" @current-change="clientLoghandleCurrentChange" :current-page="ClientLoglistQuery.page_no" :page-sizes="[9, 10, 20, 30]" :page-size="ClientLoglistQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="ClientLogTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--系统管理员编辑弹出框-->
    <el-dialog width="50%" height="400px !important;" :title="$t('systemMg.EditUser')" :visible.sync="SystemDialogShowOrHide" top="8vh" append-to-body>
       <!--系统管理员编辑弹出框-->
      <el-form :inline="true" :model="SystemEditForm" :rules="editFormRules" ref="SystemEditForm" label-position="left" label-width="120px" style='width: 400px; margin-left:40px;'>
        <el-form-item :label="$t('systemMg.Username')">
          <el-input name="user_name" class="inputEqualWidth" v-model="SystemEditForm.user_name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemMg.Account')">
          <el-input name="login_account" class="inputEqualWidth" v-model="SystemEditForm.login_account" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemMg.Cellnumber')">
          <el-input name="mobile" v-model="SystemEditForm.mobile" class="client-input inputEqualWidth"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemMg.Email')">
          <el-input name="email" v-model="SystemEditForm.email" class="client-input inputEqualWidth"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemMg.Comments')">
          <el-input name="remark" class="inputEqualWidth" v-model="SystemEditForm.remark"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemMg.Pleaseselectanrole')">
          <el-checkbox-group v-model="SystemEditForm.role_codes">
            <el-checkbox :label=6 v-if="this.role_code.includes(1)">{{$t('systemMg.Sales')}}</el-checkbox>
            <el-checkbox :label=5 v-if="this.role_code.includes(1)">{{$t('systemMg.parents')}}</el-checkbox>
            <el-checkbox :label=1 v-if="this.role_code.includes(1)">{{$t('systemMg.Publiccloudadministrator')}}</el-checkbox>
            <el-checkbox :label=7>{{$t('systemMg.FileUploader')}}</el-checkbox>
            <el-checkbox :label=8>{{$t('systemMg.Administrator')}}</el-checkbox>
            <el-checkbox :label=10>{{$t('systemMg.Authorizer')}}</el-checkbox>
            <el-checkbox :label=2 v-if="this.role_code.includes(2)">{{$t('systemMg.Privatecloudadminitrator')}}</el-checkbox>
            <el-checkbox :label=4 v-if="this.role_code.includes(2)">{{$t('systemMg.Teacher')}}</el-checkbox>
            <el-checkbox :label=9 v-if="this.role_code.includes(2)">{{$t('systemMg.President')}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
        <!--删除任教班级表格-->
        <p style="padding-left:120px;" v-if="this.UserlistQuery.role_code===4"><b>{{$t('systemMg.Class')}}</b></p>
      <el-table :data="DeleteTeacherList" height="280px" highlight-current-row style="" v-if="this.UserlistQuery.role_code===4">
            <el-table-column prop="parent_group_name" :label="$t('systemMg.Grade')" width="150">
          </el-table-column>
          <el-table-column prop="user_group_name" :label="$t('pushMg.Classname')" width="150">
          </el-table-column>

           <el-table-column  :label="$t('table.Operation')" width="300" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteTeacherClass(scope.$index,scope.row)">{{$t('table.Delete')}}</el-button>
            </template>
          </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SystemDialogShowOrHide = false">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary" @click="updateUser()">{{$t('table.OK')}}</el-button>
      </span>

    </el-dialog>

    <!--添加系统管理员-->
    <el-dialog width="50%" height="400px !important;" :title="$t('systemMg.Addadministrator')" :visible.sync="AddSystemDialogShow" append-to-body>
      <el-form :inline="true" :model="fromline" :rules="rules" ref="fromline" class="demo-form-inline" label-width="190px" style='width: 600px; margin-left:50px;'>
        <el-form-item :label="$t('systemMg.Cellnumber')" prop="mobile">
          <el-input name="mobile" type="mobile" class="client-input" v-model="fromline.mobile"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemMg.Account')" prop="login_account">
          <el-input :maxlength=inputMaxleng name="login_account" class="client-input" v-model="fromline.login_account"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemMg.AdministratorsName')" prop="user_name">
          <el-input class="client-input" v-model="fromline.user_name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemMg.Email')" prop="email">
          <el-input name="email" class="client-input" v-model="fromline.email"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemMg.password')" prop="password">
          <el-input class="client-input" type="password" v-model="fromline.password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemMg.Confirm')" prop="passwordNew">
          <el-input class="client-input" type="password" v-model="fromline.passwordNew"></el-input>
        </el-form-item>
        <el-form-item :label="$t('systemMg.Comments')" prop="remark">
          <el-input class="client-input" v-model="fromline.remark" name="remark"></el-input>
        </el-form-item>
        <!-- 公有云
            1：公有云系统管理员
            5：家长
            6：市场专员
            7：内容专员
            8：管控专员
            10：审核专员
          私有云
            2：私有云系统管理员
            4：老师
            7：内容专员
            8：管控专员
            9：校长
            10：审核专员 -->
        <el-form-item :label="$t('systemMg.Pleaseselectanrole')" class="Roles" prop="role_codes">
          <el-checkbox-group v-model="fromline.role_codes">
            <el-checkbox label=6 name="role_codes" v-if="this.role_code.includes(1)">{{$t('systemMg.Sales')}}</el-checkbox>
            <el-checkbox label=5 name="role_codes" v-if="this.role_code.includes(1)">{{$t('systemMg.parents')}}</el-checkbox>
            <el-checkbox label=1 name="role_codes" v-if="this.role_code.includes(1)">{{$t('systemMg.Publiccloudadministrator')}}</el-checkbox>
            <el-checkbox label=7 name="role_codes">{{$t('systemMg.FileUploader')}}</el-checkbox>
            <el-checkbox label=8 name="role_codes">{{$t('systemMg.Administrator')}}</el-checkbox>
            <el-checkbox label=10 name="role_codes">{{$t('systemMg.Authorizer')}}</el-checkbox>
            <el-checkbox label=2 name="role_codes" v-if="this.role_code.includes(2)">{{$t('systemMg.Privatecloudadminitrator')}}</el-checkbox>
            <el-checkbox label=4 name="role_codes" v-if="this.role_code.includes(2)">{{$t('systemMg.Teacher')}}</el-checkbox>
            <el-checkbox label=9 name="role_codes" v-if="this.role_code.includes(2)">{{$t('systemMg.President')}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddSystemDialogShow = false">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary" class="client-buttom" @click="resetAdmin">{{$t('form.reset')}}</el-button>
        <el-button type="primary" class="client-buttom" @click="addAdmin">{{$t('table.OK')}}</el-button>
      </span>
    </el-dialog>
    <!--老师设置班级弹出框-->
    <el-dialog width="30%" height="50%" :title="this.$t('systemMg.Class')" :visible.sync="dialogShowOrHide" append-to-body>

      <div class="expand">
        <div>
          <el-tree accordion :show-checkbox="true" ref="expandMenuList" class="expand-tree" v-if="isLoadingTree" :data="selectedSetTree" node-key="user_group_id" highlight-current :props="defaultProps" :expand-on-click-node="false" :default-expanded-keys="defaultExpandKeys"></el-tree>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShowOrHide = false">{{$t('table.Cancel')}}</el-button>

        <el-button type="primary" @click="getTreeCheckedKeys">{{$t('table.OK')}}</el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserinfo,
  userOperationLog_pagedQuery_page_no_page_size_token,
  user_delete_token,
  user_update_user_id_token_post,
  user_userRegistration_token_post,
  user_accountVerification_login_account_token,
  userGroup_queryPrivatecloud_token_get,
  user_addTeachingClass_token,
  user_delTeachingClass_user_id_token,
  crashLog_pagedQuery_page_no_page_size
} from '@/api/user/user'

import { timestampToTime } from '@/utils/format'
import { formatLogStata } from '@/filters'
export default {
  name: 'SystemManagement',
  data() {
    const validatepassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('systemMg.Pleaseinputthepassword')))
      } else {
        callback()
      }
    }
    const validatepasswordNew = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('systemMg.Pleaseinputthepassword')))
      } else {
        if (value !== this.fromline.password) {
          callback(
            new Error(this.$t('systemMg.ThePass'))
          )
        }
        callback()
      }
    }
    const role_codes = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('systemMg.Pleaseselectanrole')))
      } else {
        callback()
      }
    }
    const validatelogin_account = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('systemMg.Pleaseinputtheaccount')))
      } else {
        var txt = new RegExp(/^[a-zA-Z][a-zA-Z0-9_]{5,15}$/)
        // 只能输入字母开头,字母数字下划线,6-16字节
        if (txt.test(value)) {
          user_accountVerification_login_account_token(
            this.fromline.login_account
          ).then(response => {
            if (response.result === false) {
              callback(new Error(this.$t('systemMg.Theaccounthasexistspleasetryanother')))
            } else {
              callback()
            }
          })
        } else {
          callback(new Error(this.$t('systemMg.Startwithcharacterornumber616letters')))
        }
      }
    }
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return time < this.logCreate_time
        }
      },
      inputMaxleng: 16, // 管理员账号最多16位

      selectedSetTree: [], // 老师任教班级的节点树数据

      // 树形菜单参数
      defaultProps: {
        children: 'sub_user_group',
        label: 'user_group_name'
      },

      defaultExpandKeys: [], // 默认展开节点列表

      isLoadingTree: false, // 是否加载节点树

      dialogShowOrHide: false, // 老师设置班级弹出框属性

      removtheCurrentlySelectedGroup: this.$t('userMg.Null'), // 当前选中分组名称

      checkboxRole_codes: [], // 多个复选的Rolecode

      // 添加系统管理非空验证
      rules: {
        user_name: [
          {
            required: true,
            message: this.$t('systemMg.PleaseinputtheUsername'),
            trigger: 'addAdmin'
          }
        ],
        // mobile: [
        //   {
        //     required: true,
        //     message: this.$t('systemMg.Pleaseinputthecellnumber'),
        //     trigger: 'addAdmin'
        //   }
        // ],
        email: [
          {
            required: true,
            message: this.$t('systemMg.Pleaseinputtheemail'),
            trigger: 'addAdmin'
          }
        ],
        // remark: [
        //   {
        //     required: true,
        //     message: this.$t('systemMg.Pleaseinputthecomments'),
        //     trigger: 'addAdmin'
        //   }
        // ],
        login_account: [
          {
            required: true,
            trigger: 'blur',
            validator: validatelogin_account
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatepassword
          }
        ],
        passwordNew: [
          {
            required: true,
            trigger: 'blur',
            validator: validatepasswordNew
          }
        ],
        role_codes: [
          {
            required: true,
            trigger: 'blur',
            validator: role_codes
          }
        ]
      },

      AddSystemDialogShow: false, // 添加管理员弹出框显示属性

      // 添加管理员参数from
      fromline: {
        login_account: '', // 账号
        user_name: '', // 管理员名称
        password: '', // 密码
        passwordNew: '', // 确认密码
        role_codes: [], // 角色
        mobile: '',
        email: '',
        remark: ''
      },

      // 编辑用户显示数据
      SystemEditForm: {
        user_name: '',
        mobile: '',
        email: '',
        student_code: '',
        parent_user_id: '',
        remark: '',
        login_account: '',
        role_codes: []
      },

      SystemDialogShowOrHide: false, // 修改用户弹出显示属性

      editFormRules: {}, // 编辑系统管理员表单验证

      multipleSelection: [], // 多选数组

      user_ids: [], // 删除数组

      isdisableButton: true, // 管理员按钮是否禁用

      UserLogOptions: [], // 用户日志下拉框显示

      // 公有云下拉框属性
      PublicOptions: [
        {
          role_code: 1,
          role_name: this.$t('systemMg.Publiccloudadministrator')
        },
        { role_code: 5, role_name: this.$t('systemMg.parents') },
        { role_code: 10, role_name: this.$t('systemMg.Authorizer') },
        { role_code: 6, role_name: this.$t('systemMg.Sales') },
        { role_code: 7, role_name: this.$t('systemMg.FileUploader') },
        { role_code: 8, role_name: this.$t('systemMg.Administrator') }
      ],
      // 私有云
      PrivateOptions: [
        {
          role_code: 2,
          role_name: this.$t('systemMg.Privatecloudadminitrator')
        },
        { role_code: 9, role_name: this.$t('systemMg.President') },
        { role_code: 4, role_name: this.$t('systemMg.Teacher') },
        { role_code: 6, role_name: this.$t('systemMg.Sales') },
        { role_code: 7, role_name: this.$t('systemMg.FileUploader') },
        { role_code: 8, role_name: this.$t('systemMg.Administrator') }
      ],

      UserTotal: null, // 系统管理员分页

      ClientLogTotal: null, // 客户端异常日志

      LogTotal: null, // 用户日志分页

      // 系统用户分页参数
      UserlistQuery: {
        page_no: 1,
        page_size: 9,
        user_name: '',
        role_code: 7
      },

      // 客户端异常日志分页参数
      ClientLoglistQuery: {
        page_no: 1,
        page_size: 9
      },

      ClientLogData: [], // 客户日志端数据表格

      // 删除老师任教班级参数
      delTeachingClassPrama: {
        user_id: ''
      },

      DeleteTeacherList: [], // 老师任教班级数据表格

      logCreate_time: '', // 查询日志起始时间

      logUpdate_time: '', // 查询日志终止时间

      // 用户分页参数
      LoglistQuery: {
        page_no: 1,
        page_size: 9,
        user_name: '',
        create_time: '',
        update_time: '',
        execution_state: ''
      },

      role_code: '', // 权限id

      crumbs: this.$t('Breadcrumb.Administrators'), // 面包屑 当前所在位置

      tablecolsAdmin: [], // 系统管理员数据表格

      tableData: [], // 日志data表格

      client_activeName: 'first' // 跳转到指定页面
    }
  },
  computed: {},
  mounted() {
    this.initExpand()
  },
  created() {
    this.crashLogPagedQuery()
    // 查询管理员信息
    this.adminQuery()
    // 查询用户日志
    this.userLog()
    this.role_code = this.$store.getters.roles
    if (this.role_code.includes(1)) {
      this.UserLogOptions = this.PublicOptions
    }
    if (this.role_code.includes(2)) {
      this.UserLogOptions = this.PrivateOptions
    }
  },

  watch: {
    // 管理员选中按钮事件
    multipleSelection(curVal, oldVal) {
      if (curVal.length === 0) {
        this.isdisableButton = true
      } else if (curVal.length !== 0) {
        this.isdisableButton = false
      }
    }
  },
  methods: {
    // 查询客户端异常日志
    crashLogPagedQuery() {
      crashLog_pagedQuery_page_no_page_size(this.ClientLoglistQuery).then(response => {
        this.ClientLogData = response.result.list
        this.ClientLogTotal = response.result.total_count
      })
    },
    // 删除老师任教班级
    deleteTeacherClass(index, row) {
      var delTeachingClass = {}
      var user_group_ids = []
      user_group_ids.push(row.user_group_id)
      delTeachingClass.user_group_ids = user_group_ids
      delTeachingClass.user_id = this.delTeachingClassPrama.user_id
      user_delTeachingClass_user_id_token(delTeachingClass).then(response => {
        if (response.errorCode === 0) {
          this.$message.success(this.$t('message.Deletesuccessed'))
          this.DeleteTeacherList.splice(index, 1)
        } else {
          this.$message.error(response.errorMessage)
        }
      })
    },
    // 老师设置班级Tree通过key来获取 user_group_id
    getTreeCheckedKeys() {
      var addTeachingClass = {}
      addTeachingClass.user_group_ids = this.$refs.expandMenuList.getCheckedKeys(true)
      addTeachingClass.user_ids = this.user_ids
      user_addTeachingClass_token(addTeachingClass).then(response => {
        if (response.errorCode === 0) {
          this.$message.success(this.$t('message.Setupsuccessed'))
          // 调用查询老师方法
          this.getUserList()
        } else if (response.errorCode === 10) {
          this.$message.error(this.$t('message.Pleaseselectclass'))
        } else {
          this.$message.error(response.errorMessage)
        }
      })
    },

    // 设置老师任教班级按钮
    teacherClassShow() {
      // if (this.multipleSelection.length === 0) {
      //   this.$message.error(this.$t('message.Pleaseselecttheteacher'))
      //   return
      // }
      this.dialogShowOrHide = true
      this.userGroup_queryPrivatecloud_token_get()
    },
    // 格式化日志状态
    formatLogStata,
    // 格式化表格里面的excel日期字段
    timestampToTime,
    // 添加管理员方法
    addAdmin() {
      if (this.fromline.role_codes.length === 0) {
        this.$message.error(this.$t('systemMg.Pleaseselectanrole'))
        return false
      }
      this.$refs.fromline.validate(valid => {
        if (valid) {
          var addAdminIfon = {}
          addAdminIfon.mobile = this.fromline.mobile
          addAdminIfon.email = this.fromline.email
          addAdminIfon.remark = this.fromline.remark
          addAdminIfon.login_account = this.fromline.login_account
          addAdminIfon.user_name = this.fromline.user_name
          addAdminIfon.password = this.fromline.password
          addAdminIfon.passwordNew = this.fromline.passwordNew
          // 数组里面的字符串变成数字
          addAdminIfon.role_codes = this.fromline.role_codes.map(Number)
          var addUserArray = []
          addUserArray.push(addAdminIfon)
          user_userRegistration_token_post(addUserArray).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Addsuccessed'))
              this.resetAdmin()
              this.getUserList()
              return false
            }
          })
        }
      })
    },
    // 重置按钮事件
    resetAdmin() {
      this.$refs['fromline'].resetFields()
    },
    // 添加角色
    addAdministrator() {
      this.AddSystemDialogShow = true
    },
    // 导出用户
    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [this.$t('systemMg.Username'), this.$t('systemMg.Operator'), this.$t('systemMg.Date'), this.$t('systemMg.Status')]
        const filterVal = [
          'user_name',
          'right_name',
          'create_time',
          'execution_state'
        ]
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel(tHeader, data, this.$t('systemMg.Userlogs'))
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'create_time') {
            return timestampToTime(v[j])
          } else if (j === 'execution_state') {
            return formatLogStata(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    // 修改用户方法
    updateUser() {
      this.$refs.SystemEditForm.validate(valid => {
        if (valid) {
          this.$confirm(
            this.$t('message.Areyousuretoedittheusersinformation'),
            this.$t('message.OK'),
            {
              type: 'warning'
            }
          )
            .then(() => {
              user_update_user_id_token_post(this.SystemEditForm).then(response => {
                if (response.errorCode === 0) {
                  this.$message.success(this.$t('message.Editsuccessed'))
                  this.getUserList()
                }
                this.SystemDialogShowOrHide = false
              })
              // this.getUserList()
            })
            .catch(() => {})
        }
      })
    },
    // 编辑按钮
    userHandleEdit(index, row) {
      this.SystemDialogShowOrHide = true
      this.PusheditForm = row
      this.SystemEditForm = row
      this.DeleteTeacherList = row.teaching_class
      this.delTeachingClassPrama.user_id = row.user_id
    },
    // 查询用户操作日志方法
    querUser() {
      // 分页模糊查询默认第一页
      this.LoglistQuery.page_no = 1
      this.userLog()
    },
    userLog() {
      if (this.logCreate_time !== '') {
        var createTimestamp = Date.parse(new Date(this.logCreate_time))
        this.LoglistQuery.create_time = createTimestamp
      }
      if (this.logUpdate_time !== '') {
        var updateTimestamp = Date.parse(new Date(this.logUpdate_time))
        this.LoglistQuery.update_time = updateTimestamp
      }
      userOperationLog_pagedQuery_page_no_page_size_token(
        this.LoglistQuery
      ).then(response => {
        if (response.errorCode === 0) {
          this.tableData = response.result.list
          this.LogTotal = response.result.total_count
        } else {
          this.message.error(response.errorMessage)
        }
      })
        .catch(() => {})
    },
    // 查询总数据
    adminQuery() {
      this.UserlistQuery.page_no = 1
      this.getUserList()
    },
    // 查询管理员数据
    getUserList() {
      if (this.UserlistQuery.role_code === '') {
        this.$message.error(this.$t('systemMg.Pleaseselectanroleoftheuser'))
        return false
      }
      getUserinfo(this.UserlistQuery).then(response => {
        this.tablecolsAdmin = response.result.list
        this.UserTotal = response.result.total_count
      })
    },
    // 批量删除用户信息
    deleteIds(row) {
      if (this.multipleSelection.length === 0) {
        return
      }
      this.$confirm(
        this.$t('message.Areyousuretodeletetheselectedusers'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          user_delete_token(this.user_ids).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Deletesuccessed'))
            }
            this.getUserList()
          })
        })
        .catch(() => {})
    },
    // 删除单个用户信息
    selectUserDelete(row) {
      this.$confirm(
        this.$t('message.Areyousuretodelete'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.user_ids.push(row.user_id)
          user_delete_token(this.user_ids).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Deletesuccessed'))
            }
            this.getUserList()
          })
        })
        .catch(() => {})
    },

    // 获取角色下拉框触发事件
    selectRoleChange() {
      // 下拉框失去焦点
      this.$nextTick(() => this.$refs.selectSystem.blur())
      this.getUserList()
    },
    // 查询私有云用户分组
    userGroup_queryPrivatecloud_token_get() {
      userGroup_queryPrivatecloud_token_get().then(response => {
        this.selectedSetTree = response.result
      })
    },
    initExpand() {
      this.selectedSetTree.map(a => {
        this.defaultExpandKeys.push(a.user_group_id)
      })
      this.isLoadingTree = true
    },
    handleSizeChange(val) {
      this.UserlistQuery.page_size = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.UserlistQuery.page_no = val
      this.getUserList()
    },
    // 用户日志
    logHandleSizeChange(val) {
      this.LoglistQuery.page_size = val
      this.userLog()
    },
    logHandleCurrentChange(val) {
      this.LoglistQuery.page_no = val
      this.userLog()
    },
    // 客户端异常日志
    clientLoghandleSizeChange(val) {
      this.ClientLoglistQuery.page_size = val
    },
    clientLoghandleCurrentChange(val) {
      this.ClientLoglistQuery.page_no = val
    },
    handleClick(tab, event) {
      this.crumbs = tab.label
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      // 先得到用户ID
      var ids = this.multipleSelection.map(item => item.user_id).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.user_ids = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.user_ids.push(strs[i])
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.inputEqualWidth {
  width: 200px;
}
</style>

