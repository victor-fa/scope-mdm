<template>
  <div class="Publiccloud-home">
    <theBreadcrumb>
      <el-breadcrumb-item>{{$t('Breadcrumb.RemoteControl')}}</el-breadcrumb-item>
    </theBreadcrumb>
    <el-select ref="selectTbehaivor" @change='pulbicIstlectRoleChange' v-model="PulbicTeachingClass" :placeholder="$t('message.PleaseselecttheClass')">
      <el-option v-for="item in teachingClassOptions" :key="item.user_group_id" :label="item.user_group_name" :value="item.user_group_id">
      </el-option>
    </el-select>
    <el-tabs v-model="client_activeName" @tab-click="handleClick" highlight-current-row style="height:600px;">
      <el-tab-pane :label="$t('Breadcrumb.UserLists')" name="first">
        <el-form :inline="true">
          <el-form-item>
            <el-input class="client-input" :placeholder="$t('userMg.Name')" v-model="UserlistQuery.user_name" @keyup.enter.native="searchUserinfo"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary " icon="el-icon-search" class="client-buttom" @click="searchUserinfo">
              {{$t('table.Search')}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="isdisableButton" @click="privateDirecti">
              {{$t('behaviorMg.Operation')}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="download()">{{$t('behaviorMg.ExportQRCodeforparents')}}</el-button>
          </el-form-item>
        </el-form>
        <!--列表-->
        <el-scrollbar class="commonScrollbar" style="height:450px;">
          <el-table :data="Userlist" highlight-current-row style="" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="user_name" :label="$t('userMg.Name')" width="130">
            </el-table-column>
            <el-table-column prop="login_account" :label="$t('userMg.Account')" width="180">
            </el-table-column>
            <el-table-column prop="equipment_code" :label="$t('userMg.Bindeddevices')" width="160" align="center">
              <template slot-scope="scope">
                {{scope.row.equipment_code | formatBindDeviceNum}}
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.Operation')" width="300" align="center">
              <template slot-scope="scope">
                <el-button size="small" type="primary" icon="el-icon-edit-outline" @click="userHandleEdit(scope.$index, scope.row)">{{$t('table.Edit')}}</el-button>
                <el-button size="small" type="danger" icon="el-icon-delete" @click="selectUserDelete(scope.row)">{{$t('table.Delete')}}</el-button>
                <el-button size="small" type="primary" icon="el-icon-more" @click="userDetails(scope.$index, scope.row)">{{$t('table.Details')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
        <!--工具条-->
        <div class="block">
          <el-pagination @size-change="userHandleSizeChange" @current-change="userHandleCurrentChange" :current-page="UserlistQuery.page_no" :page-sizes="[9, 10, 20, 30]" :page-size="UserlistQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="Usertotal_count">
          </el-pagination>
        </div>
      </el-tab-pane>
      <!--网络白名单-->
      <el-tab-pane :label="$t('Breadcrumb.WebsiteWhitelists') " name="tuo">
        <el-form :inline="true">
          <!-- <el-form-item>
            <el-select @change='WhitelistlectRoleChange' v-model="whiteTeachingClass" >
              <el-option v-for="item in teachingClassOptions" :key="item.user_group_id" :label="item.user_group_name" :value="item.user_group_id">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
          <el-button class="client-buttom" icon="el-icon-circle-plus-outline" type="primary" @click="addNewtWrok">{{$t('table.Add')}}</el-button>
          </el-form-item>
          <!-- <el-form-item>
                  <el-button type="primary" @click="download()">{{$t('behaviorMg.ExportQRCodeforparents')}}</el-button>
           </el-form-item>   -->
           <el-form-item>
                  <el-button type="danger" :disabled="isdisableButton" @click="deletesNewtwork" icon="el-icon-delete">{{$t('table.Deleteselected')}}</el-button>
              </el-form-item>
        </el-form>
        <br>
        <!-- <p>白名单列表:</p> -->
        <el-table :data="whiteList" highlight-current-row style="width: 100%;"  @selection-change="whiteSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column :label="$t('behaviorMg.Websitewhitelist')" prop="write_net_name" width="200">
          </el-table-column>
          <el-table-column :label="$t('behaviorMg.websiteaddress')" prop="write_net_address" width="200">
          </el-table-column>
          <el-table-column :label="$t('table.Date')" prop="create_time" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.Operation')" width="150" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="danger" @click="deleteNewtwork(scope.row)">{{$t('table.Delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--已推送应用-->
      <el-tab-pane :label="$t('Breadcrumb.PushAPP')  " name="four">
        <el-form :inline="true">

          <!-- <el-form-item>
              <el-select    @change='TbehlectRoleChange' v-model="PushAppTeachingClass" :placeholder="$t('behaviorMg.Pleaseselectgroup')">
                <el-option v-for="item in teachingClassOptions" :key="item.user_group_id" :label="item.user_group_name" :value="item.user_group_id">
                </el-option>
              </el-select>
            </el-form-item> -->

          <el-form-item>
            <el-button type="danger" :disabled="isdisableButton" @click="unInstallAppUserGroupLocals" icon="el-icon-delete">
              {{$t('behaviorMg.Uninstallselected')}}</el-button>
          </el-form-item>

        </el-form>
        <!--列表-->
        <el-scrollbar class="commonScrollbar" style="height:450px;">
          <el-table :data="PushapplicationList" highlight-current-row style="width: 100%;" @selection-change="menthandleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column :label="$t('behaviorMg.APPName')" prop="file_name" width="200">
            </el-table-column>
            <el-table-column :label="$t('table.Operation')" width="190" align="center">
              <template slot-scope="scope">
                <el-button size="small" type="danger" @click="unInstallAppUserGroupLocal(scope.row)">{{$t('behaviorMg.Uninstall')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
    <!--设置指令有效时间-->
    <el-dialog width="30%" :title="$t('behaviorMg.Setuptheexpiretimeofoperation')" :visible.sync="innerVisibTime" append-to-body>
      <el-form>
        <h4>{{$t('behaviorMg.Neverexpire')}}</h4>
        <el-form-item :label="$t('behaviorMg.Pleaseselecttimeunit')">
          <el-select :placeholder="$t('behaviorMg.Pleaseselecttimeunit')" v-model="setCommandValidTime.timeType" @change="changeTimeType">
            <el-option v-for="item in timeTypeOptions" :key="item.timeType" :label="item.timeNum" :value="item.timeType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('behaviorMg.pleaseselectexpiretimeofoperation')">
          <el-select :placeholder="$t('behaviorMg.pleaseselectexpiretimeofoperation')" v-model="setCommandValidTime.timeValue" @change="changeTimeValue">
            <el-option v-for="item in timeValueOptions" :key="item.timeValueKey" :label="item.timeValue" :value="item.timeValue">
            </el-option>
          </el-select>
          {{ selectedTimeTypeLabel }}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="innerVisibTime = false">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary" @click="setCommandValidTimeButton">{{$t('table.OK')}}</el-button>
      </span>

    </el-dialog>
    <el-dialog width="50%" height='200px !important;' :title="$t('behaviorMg.Operation')" :visible.sync="directiveinnerVisib" append-to-body>
      <el-form>
        <!-- <el-form-item :label="$t('behaviorMg.Operationtype')">
          <el-radio v-model="instructionTBehaviorRadio" label="1">{{$t('behaviorMg.Realtime')}}</el-radio>
          <el-radio v-model="instructionTBehaviorRadio" label="2">{{$t('behaviorMg.Fixedtime')}}</el-radio>
          <el-date-picker @change="datePickerChange()" :picker-options="pickerOptions" value-format="timestamp" style="margin-left:20px;" v-model="MQEquipment.endTime" v-if="this.instructionTBehaviorRadio==2" type="datetime" :placeholder="$t('behaviorMg.Selectdatetime')">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item>
          <el-button v-if="this.instructionTBehaviorRadio==1 " class="client-buttom order-buttom" @click="deviceUnbundling" type="primary">{{$t('behaviorMg.Unbind')}}</el-button>

          <el-button v-if="this.instructionTBehaviorRadio==1 " class="client-buttom order-buttom" @click="deviceReset" type="primary">{{$t('behaviorMg.Release')}}</el-button>

          <el-button class="client-buttom order-buttom" @click="deviceShutdown" type="primary">{{$t('behaviorMg.Poweroff')}}</el-button>

          <el-button class="client-buttom order-buttom" @click="deviceRestart" type="primary">{{$t('behaviorMg.Reboot')}}</el-button>

          <el-button v-if="this.instructionTBehaviorRadio==1 " class="client-buttom order-buttom" @click="deviceLock" type="primary">{{$t('behaviorMg.Lock')}}</el-button>

          <el-button v-if="this.instructionTBehaviorRadio==1 " class="client-buttom order-buttom" @click="deviceUnlok" type="primary">{{$t('behaviorMg.Unlock')}}</el-button>

         

          <!-- <el-button class="client-buttom" type="primary" @click="showTiem">{{$t('behaviorMg.Setuptheexpiretimeofoperation')}}</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加网络白名单-->
    <el-dialog width="30%" :title="$t('behaviorMg.Addwebsitetowhitelist')" :visible.sync="WhiteDialogShow" append-to-body>
      <el-form :inline="true" :model="newteditForm" label-position="left" label-width="180px" style='width: 400px; margin-left:50px;' :rules="newteditFormRules" ref="newteditForm" class="demo-form-inline">
        <!-- <el-form-item :label="$t('behaviorMg.Pleaseselectclass')">
            <el-select @change='WhitelistlectRoleChange' v-model="whiteTeachingClass" :placeholder="$t('behaviorMg.Pleaseselectgroup')">
              <el-option v-for="item in teachingClassOptions" :key="item.user_group_id" :label="item.user_group_name" :value="item.user_group_id">
              </el-option>
            </el-select>
          </el-form-item> -->
        <el-form-item :label="$t('behaviorMg.Pleaseinputthename')" prop="NetListName">
          <el-input name="NetListName" v-model="newteditForm.NetListName" class="client-input"></el-input>
        </el-form-item>
        <el-form-item :label="$t('behaviorMg.websiteaddress')" prop="NetListUrl">
          <el-input name="NetListUrl" v-model="newteditForm.NetListUrl" class="client-input"></el-input>
        </el-form-item>
        <help></help>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="WhiteDialogShow = false">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary" @click="restNetwrok">{{$t('form.reset')}}</el-button>
        <el-button type="primary" @click="addNewtwok">{{$t('table.OK')}}</el-button>
      </span>

    </el-dialog>
    <!--用户编辑详情弹出框-->
    <el-dialog width="50%" height="400px !important;" title="" :visible.sync="UserDialogShow" append-to-body>
      <el-form :inline="true" :model="UsereditForm" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;' :rules="editFormRules" ref="UsereditForm" class="demo-form-inline">
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
import {
  getUserinfo,
  equipment_queryWriteNetListUserGroup_token,
  user_getBindingEquipmentQRCodeExcel_user_group_id_token,
  user_update_user_id_token_post,
  user_delete_token
} from '@/api/user/user'
import {
  equipment_setNetWriteListLocalUser_token,
  equipment_deleteNetWriteMQListLocalUser_token,
  equipment_queryAPKUserGroup_token,
  equipment_unInstallAppUserGroupLocal_token,
  equipment_closeMQEquipmentUser_token,
  equipment_resetMQEquipmentLocalUser_post,
  equipment_rebootMQEquipmentLocalUser_post,
  equipment_rockMQEquipmentLocalUser_post,
  equipment_unBindMQEquipmentLocalUser_token,
  equipment_unRockMQEquipmentLocalUser_post
} from '@/api/equipment/equipment'
import { isTbehavior_idNotAll } from '@/utils/validate'
import { GetLength } from '@/utils/format'
export default {
  name: 'TbehaviorManagement',
  data() {
    const validateNetListUrl = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('behaviorMg.Pleaseinputthewhitelistnames')))
      } else {
        if (GetLength(value) === 1) {
          callback(new Error(this.$t('message.Input2lettersatleast')))
        }
        callback()
      }
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },

      teachingClassOptions: [], // 老师任教班级下拉框选项

      PulbicTeachingClass: '', // 公共任教班级
      // whiteTeachingClass: '', // 老师任教班级

      // PushAppTeachingClass: '', // 已经推送应用的老师任教班级

      // UserTechingClass: '', // 用户任教班级

      UserDialogStstus: '', // 编辑用户和查看属性

      UserDialogShow: false, // 用户弹出框显示属性

      UserInfoisReadOnly: false, // 输入框是否可编辑属性

      editFormRules: {}, // 用户非空验证属性

      png_path: '', // 二维码图片路径

      png_pathAlt: '', // 二维码图片路径提示

      // 编辑查看
      textMap: {
        update: this.$t('table.Edit'),
        detail: this.$t('table.Details')
      },

      // 查看用户form元素
      UsereditForm: {

      },

      instructionTBehaviorRadio: this.$t('behaviorMg.One'), // 设置指令有效时间属性

      selectedTimeTypeLabel: this.$t('behaviorMg.Minute'), // 选中的时间类型label

      // 设置设备操作指令有效时间parment
      setCommandValidTime: {
        timeType: 1,
        timeValue: 1,
        hourlyBasis: 60 // 以秒为时间单位
      },

      // 选择分或者时后的下拉框选项
      timeMinuteOrHourOptions: [
        { timeValueKey: 1, timeValue: this.$t('behaviorMg.One') },
        { timeValueKey: 5, timeValue: this.$t('behaviorMg.Five') },
        { timeValueKey: 10, timeValue: this.$t('behaviorMg.Ten') }
      ],

      // 选择天后的下拉框选项
      timeDayOptions: [
        { timeValueKey: 1, timeValue: 1 },
        { timeValueKey: 2, timeValue: 2 },
        { timeValueKey: 3, timeValue: 3 }
      ],

      // 公共操作指令参数
      MQEquipment: {
        parentTopic: 'MQTT_QHMDM',
        user_ids: [],
        user_group_id: [],
        validTime: -1,
        endTime: ''
      },
      // 选择时间单位的下拉框选项
      timeTypeOptions: [
        { timeType: 1, timeNum: this.$t('behaviorMg.Minute') },
        { timeType: 2, timeNum: this.$t('behaviorMg.Hour') },
        { timeType: 3, timeNum: this.$t('behaviorMg.Day') }
      ],

      timeValueOptions: [], // 设置指令时间属性

      // 添加网络白名单非空验证
      newteditFormRules: {
        NetListName: [
          {
            required: true,
            message: this.$t('behaviorMg.Pleaseinputthename'),
            trigger: 'blur'
          }
        ],
        NetListUrl: [
          {
            required: true,
            trigger: 'blur',
            validator: validateNetListUrl
          }
        ]
        // NetListUrl: [
        //   { required: true, message: this.$t('behaviorMg.Pleaseinputthewhitelistnames'), trigger: 'blur' }
        // ]
      },

      // 添加白名单弹出框弹出框属性
      WhiteDialogShow: false,

      user_group_ids: [],

      // 白名单from
      newteditForm: {
        parentTopic: 'MQTT_QHMDM',
        NetListUrl: '', // 网址
        NetListName: '', // 网址对应的名称
        user_group_id: [],
        NetList: []
      },
      isdisableButton: true, // 按钮是否禁用

      directiveinnerVisib: false, // 设置指令操作属性

      innerVisibTime: false, // 设置时间属性

      Usertotal_count: null, //

      getCheckedTeachereKeys: null, // 老师选中班级数组

      // 删除已推送应用参数
      userGroupList: {
        user_group_id: [],
        file_id: []
      },

      // 根据用户分分组查询已推送应用
      queryAPKUserGroupParams: {
        user_group_id: '',
        parentTopic: 'MQTT_QHMDM'
      },

      Userlist: [], // 用户数据表格

      UserlistQuery: {
        page_no: 1,
        page_size: 9,
        user_name: '',
        role_code: 3,
        user_group_id: ''
      },
      PushapplicationList: [], // 已推送应用数据表格

      whiteList: [], // 白名单数据表格

      // 查询网络白名单
      whiteListQuery: {
        user_group_id: '',
        parentTopic: 'MQTT_QHMDM'
      },

      appmultipleSelection: [], // 已推送应用多选数组

      whitemultipleSelection: [], // 白名单多选数组

      multipleSelection: [], // 用户多选数组

      client_activeName: 'first' // 当前面板
    }
  },
  watch: {
    // 用户列表按钮是否禁用
    multipleSelection(curVal, oldVal) {
      if (curVal.length === 0) {
        if (this.MQEquipment.user_group_id.length === 0) {
          this.isdisableButton = true
        }
      } else if (curVal.length !== 0) {
        this.isdisableButton = false
      }
    },
    whitemultipleSelection(curVal, oldVal) {
      if (curVal.length === 0) {
        if (this.MQEquipment.user_group_id.length === 0) {
          this.isdisableButton = true
        }
      } else if (curVal.length !== 0) {
        this.isdisableButton = false
      }
    },
    // 老师选中班级学生
    PulbicTeachingClass(curVal, oldVal) {
      if (curVal.length === '') {
        if (this.MQEquipment.user_ids.length === 0) {
          this.isdisableButton = true
        }
      } else if (curVal.length !== '') {
        this.isdisableButton = false
      }
    }
  },

  created() {
    this.getUserList() // 查询用户方法
    this.teachingClassOptions = this.$store.getters.teachingClass // 得到白名单老师任教班级
  },
  computed: {},

  methods: {
    // 老师选中班级学生操作指令
    getTeacherKeysChange() {
      // 得到下拉框的用户分组集合
      this.MQEquipment.user_group_id.push(this.PulbicTeachingClass)
    },

    datePickerChange() {
      // 获取当前时间戳
      const timestamp = new Date().getTime()
      // 如果选择的时间小于当前时间提示错误
      if (this.MQEquipment.endTime < timestamp) {
        this.MQEquipment.endTime = null
        this.$message.error(
          this.$t('behaviorMg.Cantbeforecurrenttime')
        )
        return false
      }
    },
    // 编辑显示方法
    userHandleEdit(index, row) {
      this.UserDialogShow = true
      this.UserInfoisReadOnly = false // 编辑的时候设置输入框只读为false
      this.UserDialogStstus = 'update'
      // 把当前行的数据赋给this.editForm
      this.UsereditForm = Object.assign({}, row)
    },

    // 查看用户详情
    userDetails(index, row) {
      this.UserDialogShow = true
      this.UserInfoisReadOnly = true // 详情的时候设置输入框只读为true
      this.UserDialogStstus = 'detail'
      // this.UserGetBindingEquipmentQRCode()
      this.UsereditForm = Object.assign({}, row)
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
                  } else {
                    this.$message.error(response.errorMessage)
                  }
                  this.UserDialogShow = false
                }
              )
              this.getUserList()
            })
            .catch(() => {
              return false
            })
        }
      })
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
        .catch(() => {
          return false
        })
    },
    // 下载文件
    download() {
      if (this.PulbicTeachingClass === '') {
        this.$message.error(
          this.$t('behaviorMg.Pleaseselectclassfirst')
        )
        return false
      }
      user_getBindingEquipmentQRCodeExcel_user_group_id_token(
        this.PulbicTeachingClass
      ).then(response => {
        if (response.errorCode !== 0) {
          this.$message.error(response.errorMessage)
          return false
        } else {
          const token = this.$store.getters.token
          window.open(
            'mdm/user/getBindingEquipmentQRCodeExcel/' +
              this.PulbicTeachingClass +
              '/' +
              token
          )
        }
      })
    },
    // 公共下拉框加载
    pulbicIstlectRoleChange() {
      // 下拉框失去焦点
      this.$nextTick(() => this.$refs.selectTbehaivor.blur())
      // 老师下拉框选择方法
      this.getTeacherKeysChange()
      // 根据班级查询用户
      this.classesQueryUser()
      // 根据班级查询白名单
      this.whiteQuery()
      // 根据班级查询已推送应用
      this.equipmentQueryAPKUserGroup()
    },

    // 确认设置指令有效时间
    setCommandValidTimeButton() {
      var rebootMQEquipmentValidTime =
        this.setCommandValidTime.hourlyBasis *
        this.setCommandValidTime.timeValue
      this.MQEquipment.validTime = rebootMQEquipmentValidTime
      this.$message.success(this.$t('message.Setupsuccessed'))
      this.innerVisibTime = false
    },

    // 设置指令有效时间单位下拉框change
    changeTimeType() {
      if (this.setCommandValidTime.timeType === 1) {
        this.timeValueOptions = this.timeMinuteOrHourOptions
        this.selectedTimeTypeLabel = this.$t('behaviorMg.Minute')
        this.setCommandValidTime.hourlyBasis = 60
      } else if (this.setCommandValidTime.timeType === 2) {
        this.timeValueOptions = this.timeMinuteOrHourOptions
        this.selectedTimeTypeLabel = this.$t('behaviorMg.Hour')
        this.setCommandValidTime.hourlyBasis = 3600
      } else if (this.setCommandValidTime.timeType === 3) {
        this.timeValueOptions = this.timeDayOptions
        this.selectedTimeTypeLabel = this.$t('behaviorMg.Day')
        this.setCommandValidTime.hourlyBasis = 86400
      }
    },

    // 设置指令有效时间下拉框change
    changeTimeValue() {
      console.log(this.setCommandValidTime.timeValue, 'timevalue')
    },

    // 设置时间指令显示弹出框
    showTiem() {
      this.innerVisibTime = true
      // 默认选中分为单位的时间下拉框
      this.timeValueOptions = this.timeMinuteOrHourOptions
    },

    // 操作指令弹出框
    privateDirecti() {
      // 判断不能同时选择单个和分组
      if (
        !isTbehavior_idNotAll(
          this.MQEquipment.user_ids,
          this.MQEquipment.user_group_id
        )
      ) {
        return false
      }
      this.directiveinnerVisib = true
    },

    // 查询用户信息
    searchUserinfo() {
      this.getUserList()
    },
    // 查询用户数据
    getUserList() {
      getUserinfo(this.UserlistQuery).then(response => {
        if (response.errorCode === 0) {
          this.Userlist = response.result.list
          this.Usertotal_count = response.result.total_count
        } else {
          this.$message.error(response.errorMessage)
          this.list = []
        }
      })
    },
    // 根据任教班级查询用户信息
    classesQueryUser() {
      this.UserlistQuery.user_group_id = this.PulbicTeachingClass
      getUserinfo(this.UserlistQuery).then(response => {
        if (response.errorCode === 0) {
          this.Userlist = response.result.list
          this.Usertotal_count = response.result.total_count
        } else {
          this.$message.error(response.errorMessage)
        }
      })
    },
    // 根据任教班级查询出网络白名单
    whiteQuery() {
      this.whiteListQuery.user_group_id = this.PulbicTeachingClass
      equipment_queryWriteNetListUserGroup_token(this.whiteListQuery).then(
        response => {
          if (response.errorCode === 0) {
            if (response.result != null || response.result !== {}) {
              this.whiteList = response.result[0].write_nets
            }
          }
          // } else {
          //   this.$message.error(response.errorMessage)
          // }
        }
      )
    },

    // 添白名单方法
    addNewtwok() {
      if (this.PulbicTeachingClass === '') {
        this.$message.error(
          this.$t('behaviorMg.Pleaseselectclassfirst')
        )
        return false
      }
      this.$refs.newteditForm.validate(vaild => {
        if (vaild) {
          var addnetwrk = {}
          var user_group_id = new Array(0)
          var oneNetList = {}
          var NetListUrl = this.newteditForm.NetListUrl
          var NetListName = this.newteditForm.NetListName
          oneNetList[NetListName] = NetListUrl
          addnetwrk.NetList = oneNetList
          user_group_id.push(this.PulbicTeachingClass)
          addnetwrk.user_group_id = user_group_id
          addnetwrk.parentTopic = this.newteditForm.parentTopic
          equipment_setNetWriteListLocalUser_token(addnetwrk).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Addsuccessed'))
              // 添加成功后查询一遍白名单数据
              this.whiteQuery()
              this.restNetwrok()
              return false
            } else {
              this.$message.error(response.errorMessage)
              this.restNetwrok()
              return false
            }
          })
        }
      })
    },
    // 批量删除白名单
    deletesNewtwork() {
      if (this.whitemultipleSelection.length === 0) {
        return
      }

      this.$confirm(
        this.$t('message.Areyousuretodelete'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(response => {
          // 每次刪除前清空之前数组
          // this.newteditForm.NetList = []
          this.newteditForm.user_group_id = []
          this.newteditForm.user_group_id.push(this.PulbicTeachingClass)
          equipment_deleteNetWriteMQListLocalUser_token(this.newteditForm).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Deletesuccessed'))
              } else {
                this.$message.error(response.errorMessage)
              }
              this.whiteQuery()
            }
          )
        })
        .catch(() => {
          return false
        })
    },
    // 删除白名单方法
    deleteNewtwork(row) {
      this.$confirm(
        this.$t('message.Areyousuretodelete'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(response => {
          // 每次刪除前清空之前数组
          this.newteditForm.NetList = []
          this.newteditForm.user_group_id = []
          this.newteditForm.NetList.push(row.write_net_id)
          this.newteditForm.user_group_id.push(this.PulbicTeachingClass)
          equipment_deleteNetWriteMQListLocalUser_token(this.newteditForm).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Deletesuccessed'))
              } else {
                this.$message.error(response.errorMessage)
              }
              this.whiteQuery()
            }
          )
        })
        .catch(() => {
          return false
        })
    },
    // 网络白名单重置按钮
    restNetwrok() {
      this.$refs['newteditForm'].resetFields()
    },

    // 添加网络白名单显示弹出框方法
    addNewtWrok() {
      this.WhiteDialogShow = true
    },

    // 根据设备批量卸载已推送应用
    unInstallAppUserGroupLocals(row) {
      if (this.appmultipleSelection.length === 0) {
        return
      }
      this.$confirm(
        this.$t('behaviorMg.AreyousuretouninstallselectedAPPs'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.userGroupList.user_group_id.push(this.PulbicTeachingClass)
          this.userGroupList.file_id.push(row.file_id)
          equipment_unInstallAppUserGroupLocal_token(this.userGroupList).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('behaviorMg.Uninstallsuccessed'))
              } else {
                this.$message.error(response.errorMessage)
              }
              this.equipmentQueryAPKUserGroup()
            }
          )
        })
        .catch(() => {
          return false
        })
    },

    // 根据用户id删除单个已推送应用信息
    unInstallAppUserGroupLocal(row) {
      this.$confirm(
        this.$t('message.Areyousuretodelete'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.userGroupList.user_group_id.push(this.PulbicTeachingClass)
          this.userGroupList.file_id.push(row.file_id)
          equipment_unInstallAppUserGroupLocal_token(this.userGroupList).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Deletesuccessed'))
              } else {
                this.$message.error(response.errorMessage)
              }
              this.equipmentQueryAPKUserGroup()
            }
          )
        })
        .catch(() => {
          return false
        })
    },

    // 根据用户id查询已推送应用信息
    equipmentQueryAPKUserGroup() {
      this.queryAPKUserGroupParams.user_group_id = this.PulbicTeachingClass
      equipment_queryAPKUserGroup_token(this.queryAPKUserGroupParams).then(
        response => {
          if (response.errorCode === 0) {
            if (response.result.length !== 0) {
              this.PushapplicationList = response.result[0]
            }
          } else {
            this.PushapplicationList = []
          }
        }
      )
    },

    // 设备解锁
    deviceUnlok() {
      equipment_unRockMQEquipmentLocalUser_post(this.MQEquipment).then(
        response => {
          if (response.errorCode === 0) {
            this.$message.success(this.$t('message.Unlocksuccessed'))
          } else if (response.errorCode !== 0) {
            this.$message.error(response.errorMessage)
          }
        }
      )
    },

    // 设备解绑
    deviceUnbundling() {
      equipment_unBindMQEquipmentLocalUser_token(this.MQEquipment).then(
        response => {
          if (response.errorCode === 0) {
            this.$message.success(this.$t('message.unBindSuccess'))
          } else if (response.errorCode !== 0) {
            this.$message.error(response.errorMessage)
          }
        }
      )
    },

    // 设备锁定
    deviceLock() {
      equipment_rockMQEquipmentLocalUser_post(this.MQEquipment).then(
        response => {
          if (response.errorCode === 0) {
            this.$message.success(this.$t('message.Lockscreensuccessed'))
          } else if (response.errorCode !== 0) {
            this.$message.error(response.errorMessage)
          }
        }
      )
    },

    // 设备重启
    deviceRestart() {
      // 私有云根据用户id或者用户分组id设备重关机调用指令接口
      equipment_rebootMQEquipmentLocalUser_post(this.MQEquipment).then(
        response => {
          if (response.errorCode === 0) {
            this.$message.success(this.$t('message.Rebootsuccessed'))
          } else {
            this.$message.error(response.errorMessage)
          }
        }
      )
    },

    // 设备重置
    deviceReset() {
      // 私有云根据用户id或者用户分组id设备重关机调用指令接口
      equipment_resetMQEquipmentLocalUser_post(this.MQEquipment).then(
        response => {
          if (response.errorCode === 0) {
            this.$message.success(this.$t('message.Releasesuccessed'))
          } else {
            this.$message.error(response.errorMessage)
          }
        }
      )
    },

    // 设备关机
    deviceShutdown() {
      // 私有云根据用户id或者用户分组id设备重关机调用指令接口
      equipment_closeMQEquipmentUser_token(this.MQEquipment).then(response => {
        if (response.errorCode === 0) {
          this.$message.success(this.$t('message.Poweroffsuccessed'))
        } else {
          this.$message.error(response.errorMessage)
        }
      })
    },

    // 已推送应用多选数组
    menthandleSelectionChange(val) {
      this.appmultipleSelection = val
      // 先得到用户ID
      var ids = this.appmultipleSelection.map(item => item.file_id).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.userGroupList.file_id = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.userGroupList.file_id.push(strs[i])
        }
      }
    },
    // 白名单多选数组
    whiteSelectionChange(val) {
      this.whitemultipleSelection = val
      // 先得到设备分组id
      var ids = this.whitemultipleSelection.map(item => item.write_net_id).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.newteditForm.NetList = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.newteditForm.NetList.push(strs[i])
        }
      }
    },
    // 用户列表多选数组
    handleSelectionChange(val) {
      this.multipleSelection = val
      var ids = this.multipleSelection.map(item => item.user_id).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var user_group_ids = this.multipleSelection
        .map(
          item =>
            item.user_group_id === undefined ? 'null' : item.user_group_id
        )
        .join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      var user_group_idsStrs = user_group_ids.split(',') // 字符分割
      this.MQEquipment.user_ids = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.MQEquipment.user_ids.push(strs[i])
        }
      }

      this.beforeTheCurrentlySelectedUser_UserGroup_id = []
      for (var k = 0; k < user_group_idsStrs.length; k++) {
        this.beforeTheCurrentlySelectedUser_UserGroup_id.push(
          user_group_idsStrs[k]
        )
      }
    },

    handleClick(tab, event) {
      this.crumbs = tab.label
    },
    // 用户列表
    userHandleSizeChange(val) {
      this.UserlistQuery.page_size = val
      this.getUserList()
    },
    userHandleCurrentChange(val) {
      this.UserlistQuery.page_no = val
      this.getUserList()
    }
  }
}
</script>