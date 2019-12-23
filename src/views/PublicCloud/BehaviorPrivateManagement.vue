<template>

  <div class="Publiccloud-home">
      <the-breadcrumb>
       <el-breadcrumb-item>{{$t('Breadcrumb.RemoteControl')}}</el-breadcrumb-item>
    </the-breadcrumb>
    <el-container>
      <el-aside>
        <div class="Group-title top-commonborder">
          <div class="common-title">{{$t('userMg.Usergroup')}}</div>

          <el-scrollbar class="commonScrollbar" style="height: 620px;">
            <div class="expand">
              <div>
                <el-tree accordion key="1" v-if="multiple" ref="userExpandMenuList" @check="getTreeCheckedKeysChange" :show-checkbox="false" class="expand-tree" :data="setTree" node-key="user_group_id" highlight-current :props="defaultProps" :expand-on-click-node="false"  :default-expanded-keys="defaultExpandKeys" @node-click="handleNodeClick" :check-on-click-node="true"></el-tree>
                <el-tree accordion key="2" v-else ref="userExpandMenuList" @check="getTreeCheckedKeysChange" class="expand-tree"  :data="multipleChoiceSetTree" node-key="user_group_id" highlight-current :props="defaultProps" :expand-on-click-node="false" :default-expanded-keys="defaultExpandKeys" @node-click="handleNodeClick" :check-on-click-node="true"></el-tree>
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
        <el-tabs v-model="client_activeName" @tab-click="handleClick" style="height:600px;">
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
                <el-button type="primary" :disabled="isdisableButton" @click="privatedirecti">
                  {{$t('behaviorMg.Operation')}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
              </el-form-item>
               <el-form-item>
                   <template slot-scope="scope">
                   <el-button type="primary" :disabled="isdisableButton"  @click="SeeFiles(scope.$index,scope.row)">{{$t('behaviorMg.ViewingDeviceFiles')}}</el-button>
                   </template>
              </el-form-item>
            </el-form>
            <!--列表-->
            <el-scrollbar class="commonScrollbar" style="height:450px;">
              <el-table :data="Userlist" highlight-current-row @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" >
                </el-table-column>
                <el-table-column prop="user_name" :label="$t('userMg.Name')" width="180">
                </el-table-column>
                <el-table-column prop="login_account" :label="$t('userMg.Account')" width="180">
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
              </el-table>
            </el-scrollbar>
            <!--工具条-->
            <div class="block">
              <el-pagination @size-change="UserhandleSizeChange" @current-change="UserhandleCurrentChange" :current-page="UserlistQuery.page_no" :page-sizes="[7, 10, 20, 30]" :page-size="UserlistQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="Usertotal_count">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('Breadcrumb.WebsiteWhitelists')" name="tou" :disabled="isTheCurrentlySelectedUserGroup_id">
            <el-form :inline="true">
              <el-form-item>
              <el-button class="client-buttom" icon="el-icon-circle-plus-outline" type="primary" @click="showNetwrok">{{$t('table.Add')}}</el-button>
              </el-form-item>
                <el-form-item>
                  <el-button type="danger" :disabled="isdisableButton" @click="deletesNewtwork" icon="el-icon-delete">{{$t('table.Deleteselected')}}</el-button>
              </el-form-item>
            </el-form>
            <br>
            <!-- <p>白名单列表:</p> -->
            <el-table :data="whiteList" highlight-current-row style="width: 100%;"  @selection-change="whiteSelectionChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column :label="$t('behaviorMg.Websitewhitelist')" prop="write_net_name" width="180">
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
          <!--默认应用面板-->
          <el-tab-pane :label="$t('Breadcrumb.DefaultAPPs')" name="Three" :disabled="isTheCurrentlySelectedUserGroup_id">
              <el-form :inline="true">
                <el-select @change='deviceselectRoleChange' :placeholder="$t('table.Type')"  v-model="equipmentqueryList.configuration_item_type">
                <el-option v-for="item in defaultShouldbeOptions" :key="item.configuration_item_type" :label="item.role_name" :value="item.configuration_item_type">
                </el-option>
              </el-select>
            </el-form>
            <!--列表-->
            <el-scrollbar class="commonScrollbar" style="height:450px;">
              <el-table :data="deviceConfingactionList" highlight-current-row style="width: 100%;">
               
                <el-table-column :label="$t('behaviorMg.APPName')" prop="equipment_configuration_item_name" width="200">
                </el-table-column>
                <el-table-column :label="$t('table.Operation')" width="120" align="center">
                  <template slot-scope="scope">
                    <el-select @change='switchChange(scope.row)' :placeholder="$t('behaviorMg.Pleaseselectgroup')" v-model="scope.row.status_bool">
                      <el-option v-for="item in StatusOptions" :disabled="item.disabled" :key="item.status_bool" :label="item.status_name" :value="item.status_bool">
                      </el-option>
                      <!-- <el-option  :disabled="false" :key="false" :label="$t('behaviorMg.Off')" :value="false">
                      </el-option> -->
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane :label="$t('Breadcrumb.PushAPP')" name="four" :disabled="isTheCurrentlySelectedUserGroup_id">
              <el-form :inline="true">
                 <el-form-item>
                <el-button type="danger" @click="unInstallAppUserGroupLocals" :disabled="isdisableButton"  icon="el-icon-delete">{{$t('behaviorMg.Uninstallselected')}}</el-button>
            </el-form-item>
              </el-form>
            <!--列表-->
            <el-scrollbar class="commonScrollbar" style="height:450px;">
              <el-table :data="PushapplicationList " highlight-current-row style="width: 100%; " @selection-change="menthandleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column :label="$t( 'behaviorMg.APPName') " prop="file_name" width="200 ">
                </el-table-column>
                <el-table-column :label="$t( 'table.Operation') " width="190 " align="center ">
                  <template slot-scope="scope ">
                    <el-button size="small " type="danger " @click="unInstallAppUserGroupLocal(scope.row) ">{{$t('behaviorMg.Uninstall')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>

      </el-main>
    </el-container>
    <!-- 添加网络白名单弹出框-->
    <el-dialog width="30%" :title="$t('behaviorMg.Addwebsitetowhitelist')" :visible.sync="NetWrokDialogShow" append-to-body>
      <el-form :inline="true" :model="WhiteAddForm" :rules="newteditFormRules" label-width="180px" style='width: 460px; margin-left:20px;' ref="WhiteAddForm" class="demo-form-inline ">
        <el-form-item :label="$t( 'behaviorMg.Websitewhitelist')" prop="NetListName">
          <el-input name="NetListName " v-model="WhiteAddForm.NetListName" class="client-input"></el-input>
        </el-form-item>
        <el-form-item :label="$t('behaviorMg.websiteaddress')" prop="NetListUrl">
          <el-input name="NetListUrl" v-model="WhiteAddForm.NetListUrl" class="client-input"></el-input>
          <help style="float:right;margin-left:4px;"></help>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="NetWrokDialogShow=false">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary" @click="resetNetwrok">{{$t('form.reset')}}</el-button>
        <el-button type="primary" @click="addNetwrok">{{$t('table.OK')}}</el-button>
      </span>

    </el-dialog>
    <!--设置分组弹出框-->
    <!-- <el-dialog width="30% " :title="$t( 'userMg.Pleaseselectthemigrationgroup') " :visible.sync="dialogShowOrHide" append-to-body>
      <el-scrollbar  class="commonScrollbar" style="height: 620px;">
        <div class="expand ">
          <div>
            <el-tree accordion ref="expandMenuList" class="expand-tree" v-if="isLoadingTree " :data="setTree" node-key="id" highlight-current :props="defaultProps " :expand-on-click-node="false" :default-expanded-keys="defaultExpandKeys " @node-click="handleNodeClick "></el-tree>
          </div>
        </div>
      </el-scrollbar>
      <span slot="footer " class="dialog-footer ">
        <el-button @click="dialogShowOrHide=false ">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary " @click="dialogVisible=false ">{{$t('table.OK')}}</el-button>
      </span>
    </el-dialog> -->
    <!--设置指令有效时间-->
    <el-dialog width="40% " :title="$t( 'behaviorMg.Setuptheexpiretimeofoperation') " :visible.sync="TimeDialogShow" append-to-body>
      <el-form>
        <h4>{{$t('behaviorMg.Neverexpire')}}</h4>
        <el-form-item :label="$t( 'behaviorMg.Pleaseselecttimeunit') ">
          <el-select :placeholder="$t( 'behaviorMg.Pleaseselecttimeunit')" v-model="setCommandValidTime.timeType" @change="changeTimeType">
            <el-option v-for="item in timeTypeOptions" :key="item.timeType" :label="item.timeNum" :value="item.timeType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t( 'behaviorMg.pleaseselectexpiretimeofoperation')">
          <el-select :placeholder="$t( 'behaviorMg.pleaseselectexpiretimeofoperation') " v-model="setCommandValidTime.timeValue" @change="changeTimeValue">
            <el-option v-for="item in timeValueOptions" :key="item.timeValueKey" :label="item.timeValue" :value="item.timeValue">
            </el-option>
          </el-select>
          {{ selectedTimeTypeLabel }}
        </el-form-item>
      </el-form>
      <span slot="footer " class="dialog-footer ">
        <el-button @click="TimeDialogShow=false ">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary " @click="setCommandValidTimeButton ">{{$t('table.OK')}}</el-button>
      </span>

    </el-dialog>

    <el-dialog width="50%" :title="$t( 'behaviorMg.Operation')" :visible.sync="SettingInstructionDialogShow" append-to-body>
      <el-form>
        <!-- <el-form-item :label="$t( 'behaviorMg.Operationtype') ">
          <el-radio v-model="instructionBehaviorRadio" label="1">{{$t('behaviorMg.Realtime')}}</el-radio>
          <el-radio v-model="instructionBehaviorRadio" label="2">{{$t('behaviorMg.Fixedtime')}}</el-radio>
          <el-date-picker @change="datePickerChange()" :picker-options="pickerOptions" value-format="timestamp" style="margin-left:20px;" v-model="MQEquipment.endTime" v-if="this.instructionBehaviorRadio==2" type="datetime" :placeholder="$t('behaviorMg.Selectdatetime')">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item>
           <el-button v-if="this.instructionBehaviorRadio==1 " class="client-buttom order-buttom " @click="equipmentRestoreFactorySettings" type="primary ">{{$t('behaviorMg.RestoreFactorySettings')}}</el-button>

           <el-button v-if="this.instructionBehaviorRadio==1 " class="client-buttom order-buttom " @click="deviceUnbundling" type="primary ">{{$t('behaviorMg.Unbind')}}</el-button>

          <el-button v-if="this.instructionBehaviorRadio==1 " class="client-buttom order-buttom " @click="deviceReset" type="primary ">{{$t('behaviorMg.Release')}}</el-button>

          <el-button class="client-buttom order-buttom " @click="deviceShutdown " type="primary ">{{$t('behaviorMg.Poweroff')}}</el-button>

          <el-button class="client-buttom order-buttom " @click="deviceRestart" type="primary ">{{$t('behaviorMg.Reboot')}}</el-button>

          <el-button v-if="this.instructionBehaviorRadio==1 " class="client-buttom order-buttom " @click="deviceLock " type="primary ">{{$t('behaviorMg.Lock')}}</el-button>

          <el-button v-if="this.instructionBehaviorRadio==1 " class="client-buttom order-buttom " @click="deviceunlok " type="primary ">{{$t('behaviorMg.Unlock')}}</el-button>


          <!-- <el-button class="client-buttom " type="primary " @click="showTiem ">{{$t('behaviorMg.Setuptheexpiretimeofoperation')}}</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--远程查看文件弹出框-->
   <el-dialog width="60%"  :title="$t('behaviorMg.seeFile')" :visible.sync="FilesDialogShow" append-to-body>
    <el-form  :inline="true" :model="DeviceeditForm" :rules="newteditFormRules" ref="DeviceeditForm">
       <el-form-item>
      <el-select  v-model="Filseoptions.code" :placeholder="$t('message.SelectDevice')"   @change="selectFilesQuery()" style="width:400px;">
     <el-option   v-for="item in Filseoptions.equipmentCode" :key="Filseoptions.name+item" :label="Filseoptions.name+ ' ( ' + item + ' )'" :value="item"></el-option>
  </el-select>
  </el-form-item>
   <el-form-item>{{$t('behaviorMg.Catalog')}}：<el-input style="width:290px;"  class="client-input"  v-model="FilesParam.path" :disabled="true"></el-input></el-form-item>
    <el-form-item><el-button  size="small" type="primary" icon="el-icon-arrow-up"  @click="returnToUpper()">{{$t('behaviorMg.ReturnToHigherDirectory')}}</el-button></el-form-item>
     <el-form-item><el-button  size="small" type="primary" icon="el-icon-view"  @click="DeviceLocation()">{{$t('behaviorMg.ViewDeviceLocation')}}</el-button></el-form-item>
    <el-table :data="FilesDeviceTableData"  style="width: 100%"  v-loading="loading"  :element-loading-text="$t('behaviorMg.loadDataInfo')">
    <!-- <el-table-column type="selection" width="55">
    </el-table-column> -->
    <el-table-column prop="name" :label="$t('behaviorMg.FileNmae')"  width="230"> </el-table-column>
    <el-table-column prop="size" :label="$t('behaviorMg.Size')"  width="230"> 
       <template slot-scope="scope">
                <span>{{scope.row.size | fileSizeConventMB }}</span>
              </template>
    </el-table-column>
     <el-table-column :label="$t('table.Date')" prop="time" width="180">
       <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span>{{scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
    </el-table-column>
     <el-table-column prop="" :label="$t('table.Operation')" width="200" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.property===0"  size="small" type="danger" icon="el-icon-delete" @click="deleteFiles(scope.row)">{{$t('table.Delete')}}</el-button>
              <el-button v-if="scope.row.property===1 " size="small" type="primary" icon="" @click="SeeFiless(scope.index, scope.row)">{{$t('behaviorMg.Catalog')}}</el-button>
            </template>
          </el-table-column>
    </el-table>
      </el-form>
  </el-dialog> 
  <!--查看设备定位-->
   <el-dialog  width="60%"  :title="$t('behaviorMg.localPostionInfo')" :visible.sync="DeviceLocationDialogShow" append-to-body>
          <el-form  :inline="true" :model="DeviceLocationForm"  ref="DeviceLocationForm">
         <el-form-item>{{$t('behaviorMg.longitudeInfo')}}：<el-input style="width:200px;"   v-model="DeviceLocationForm.longitude" :disabled="true"></el-input></el-form-item>
         <el-form-item>{{$t('behaviorMg.latitudeInfo')}}：<el-input style="width:200px;"  v-model="DeviceLocationForm.latitude" :disabled="true"></el-input></el-form-item>
        <el-form-item>{{$t('behaviorMg.errorInfo')}}：<el-input style="width:200px;"   v-model="DeviceLocationForm.accuracy" :disabled="true"></el-input></el-form-item>
         <el-form-item>{{$t('behaviorMg.addrsInfo')}}：<el-input style="width:460px;"  v-model="DeviceLocationForm.addring" :disabled="true"></el-input></el-form-item>
          </el-form>
   </el-dialog>
  </div>
</template>
<script>
import {
  role_query_token_get,
  getUserinfo,
  userGroup_deletePrivatecloud_user_group_id_token_get,
  userGroup_queryPrivatecloud_token_get,
  userGroup_insertPrivatecloud_type_token_post,
  equipment_queryWriteNetListUserGroup_token,
  user_delete_token
} from '@/api/user/user'
import {
  equipment_restoreMQEquipmentUser,
  equipment_setNetWriteListLocalUser_token,
  equipment_closeMQEquipmentUser_token,
  equipment_resetMQEquipmentLocalUser_post,
  equipment_rebootMQEquipmentLocalUser_post,
  equipment_rockMQEquipmentLocalUser_post,
  equipment_unBindMQEquipmentLocalUser_token,
  equipment_unRockMQEquipmentLocalUser_post,
  equipment_manageEquipmentConfigLocalUser_token,
  equipment_queryConfigListLocalUser_token,
  equipment_deleteNetWriteMQListLocalUser_token,
  equipment_queryAPKUserGroup_token,
  equipment_unInstallAppUserGroupLocal_token
} from '@/api/equipment/equipment'
import { isEquipmentGropu_idNotAll, validateURL } from '@/utils/validate'
import { GetLength } from '@/utils/format'
import { arrayDifferent } from '@/utils/array'
import {
  fileOperation_toke,
  equipment_getTargeting_equipment_code_token
} from '@/api/file/file'
import { parentsFiles } from '@/utils/response'
export default {
  name: 'BehaviorPrivateManagement',
  data() {
    const validateNetListUrl = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('behaviorMg.Pleaseinputthewhitelistnames')))
      } else {
        if (GetLength(value) === 1) {
          callback(new Error(this.$t('message.Input2lettersatleast')))
        } else if (validateURL(value) === true) {
          callback(new Error(this.$t('FourOFour.Forexamplewwwqqcomonlyneedstofillintheqqandverifytheerror')))
        } else {
          callback()
        }
      }
    }
    return {
      DeviceLocationForm: {}, // 设备定位from

      DeviceLocationDialogShow: false, // 设备定位弹出框属性

      loading: true, // 表格加载属性

      DeviceeditForm: { },
      // 下拉框对象
      Filseoptions: {
        code: '',
        equipmentCode: [],
        name: ''
      },
      // 查看文件参数
      FilesParam: {
        equipment_code: '',
        path: '/',
        cmd: 1
      },
      equipment_code: '',
      // 删除文件参数
      deleteFilseParam: {
        equipment_code: '',
        path: '',
        cmd: 2

      },
      // 定时时间不得小于当前时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      FilesDeviceTableData: [], // 文件数据表格

      FilesDialogShow: false, // 文件弹出框

      instructionBehaviorRadio: '1', // 判断指令操作是即使(1默认)还是定时(2)

      isTheCurrentlySelectedUserGroup_id: true, // 是否选中用户分组

      // 默认应用下拉框属性
      defaultShouldbeOptions: [
        {
          configuration_item_type: 1,
          role_name: this.$t('behaviorMg.Software')
        },
        {
          configuration_item_type: 2,
          role_name: this.$t('behaviorMg.Hardware')
        }
      ],

      // 已推送应用状态
      StatusOptions: [
        { status_bool: false, status_name: this.$t('behaviorMg.Off') },
        { status_bool: true, status_name: this.$t('behaviorMg.On') },
        {
          status_bool: 'null',
          status_name: this.$t('behaviorMg.OnorOff'),
          disabled: true
        }
      ],

      selectedTimeTypeLabel: this.$t('behaviorMg.Minute'), // 选中的时间类型label

      // 设置设备操作指令有效时间parment
      setCommandValidTime: {
        timeType: 1,
        timeValue: 1,
        hourlyBasis: 60 // 以秒为时间单位
      },

      PushapplicationList: [], // 推送应用数据表格

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

      // 选择时间单位的下拉框选项
      timeTypeOptions: [
        { timeType: 1, timeNum: this.$t('behaviorMg.Minute') },
        { timeType: 2, timeNum: this.$t('behaviorMg.Hour') },
        { timeType: 3, timeNum: this.$t('behaviorMg.Day') }
      ],

      timeValueOptions: [], // 设置指令时间属性

      TimeDialogShow: false, // 设置时间弹出框

      SettingInstructionDialogShow: false, // 设置指令弹出框

      // 添加白名单form属性
      WhiteAddForm: {
        parentTopic: 'MQTT_QHMDM',
        NetListName: '',
        NetListUrl: '',
        user_group_id: [],
        NetList: []
      },

      // 添加白名单非空验证
      newteditFormRules: {
        NetListName: [
          {
            required: true,
            message: this.$t('behaviorMg.Pleaseinputthename'),
            trigger: 'blur'
          }
        ],
        NetListUrl: [
          { required: true, validator: validateNetListUrl, trigger: 'blur' }
        ]
      },

      NetWrokDialogShow: false, // 白名单弹出框属性

      user_ids: [], // 批量操作用户ID

      // 公共操作指令参数
      MQEquipment: {
        parentTopic: 'MQTT_QHMDM',
        user_ids: [],
        validTime: -1,
        endTime: '',
        user_group_id: []
      },

      theCurrentlySelectedUserGroup_id: '', // 当前选中的用户分组id

      whiteList: [], // 网络白名单数据表格

      deviceConfingactionList: [], // 默认应用数据表格

      deleteUserids: [], // 批量删除用户数组

      theCurrentlySelectedGroup: this.$t('userMg.Null'), // 当前选中的分组

      isdisableButton: true, // 按钮是否禁用

      multipleSelection: [], // 用户多选数组

      whitemultipleSelection: [], // 白名单多选数组

      mentmultipleSelection: [], // 已推送应用

      // dialogShowOrHide: false, // 设置分组弹出框

      client_activeName: 'first', // 默认显示面板

      // 默认应用
      equipmentqueryList: {
        parentTopic: 'MQTT_QHMDM',
        user_group_ids: [],
        configuration_item_type: 1
      },

      getCheckedUserKeys: [],

      Userlist: [], // 用户数据表格

      // 用户分页参数
      UserlistQuery: {
        page_no: 1,
        page_size: 7,
        user_name: '',
        role_code: 3,
        user_group_id: ''
        // user_id: '',
        // equipment_code: []
      },
      //   equipment_code: [0], // 默认值
      // 删除已推送应用
      userGroupList: {
        user_group_id: [],
        file_id: []
      },

      Usertotal_count: null, // 用户分页

      Devicetotal: null, // 设备分页

      crumbs: this.$t('Breadcrumb.UserLists'), // 面包屑 当前所在位置

      // 下面的是 tree 配置
      // isLoadingTree: false, // 是否加载节点树

      setTree: [], // 节点树数据

      multiple: true, // 树节点是否是多选

      multipleChoiceSetTree: [], // 单选数组

      // 树形菜单参数
      defaultProps: {
        children: 'sub_user_group',
        label: 'user_group_name'
      },
      defaultExpandKeys: [] // 默认展开节点列表
    }
  },
  watch: {
    // 判断当前选中的tab
    client_activeName(curVal, oldVal) {
      if (curVal !== 'first') {
        // 树形分组不可以多选
        this.multiple = false
      } else {
        // 树形分组可以多选
        this.multiple = true
        // 勾选当前的分组
        this.$nextTick(() => {
          this.$refs.userExpandMenuList.setCheckedKeys(this.getCheckedUserKeys)
        })
      }
    },
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
    mentmultipleSelection(curVal, oldVa) {
      if (curVal.length === 0) {
        this.isdisableButton = true
      } else if (curVal.length !== 0) {
        this.isdisableButton = false
      }
    },
    // 白名单是否选中
    whitemultipleSelection(curVal, oldVa) {
      if (curVal.length === 0) {
        this.isdisableButton = true
      } else if (curVal.length !== 0) {
        this.isdisableButton = false
      }
    },
    // 是否选中用户分组
    theCurrentlySelectedUserGroup_id(curVal, oldVa) {
      if (curVal === '') {
        this.isTheCurrentlySelectedUserGroup_id = true
      } else if (curVal !== '') {
        this.isTheCurrentlySelectedUserGroup_id = false
      }
    },
    getCheckedUserKeys(curVal, oldVa) {
      if (curVal.length === 0) {
        if (this.MQEquipment.user_ids.length === 0) {
          this.isdisableButton = true
        }
      } else if (curVal.length !== 0) {
        this.isdisableButton = false
      }
    }
  },
  created() {
    this.childrenInfoOptions = this.$store.getters.childrenInfoOptions
    // 查询用户信息
    this.getUserList()

    // 根据用户分组查询默认应用
    this.equipmentqueryConfigListLocalUser()

    // 查询私有云用户分组
    this.userGroup_queryPrivatecloud_token_get()
  },

  mounted() {
    this.initExpand()
  },
  computed: {},
  methods: {
  // 查看设备定位
    DeviceLocation() {
      this.DeviceLocationDialogShow = true
      this.equipmentGetTargeting()
    },
    // 查看文件弹出框
    SeeFiles(index, row) {
      // 再次点击设备回原路径
      this.FilesParam.path = '/'
      if (this.MQEquipment.user_ids.length !== 1) {
        this.$message.error(this.$t('message.OnlyOneUserCanBeSelected'))
      } else {
        // this.Filseoptions = this.FilesParam.equipmentCode = strss[0]
        for (var i = 0; i < this.Userlist.length; i++) {
          if (this.Userlist[i].user_id === this.MQEquipment.user_ids[0]) {
            this.Filseoptions.name = this.Userlist[i].user_name
            this.Filseoptions.equipmentCode = this.Userlist[i].equipment_code
            // 输出唯一标识符
            // console.log('kkkkk' + this.Userlist[i].equipment_code[0])
            // console.log('kkkkk' + this.Filseoptions.equipmentCode[0])
          }
        }
        this.FilesDialogShow = true
        // 得到下拉框设备默认第一个唯一标识符查询
        this.FilesParam.equipment_code = this.Filseoptions.equipmentCode[0]
        // 显示第一个唯一标识符
        this.Filseoptions.code = this.Filseoptions.equipmentCode[0]

        // 查询目录下的文件
        this.queryFiles()

        // console.log('kkkkk' + this.Filseoptions.equipmentCode)
      }
    },
    // 下拉框事件
    selectFilesQuery() {
      // this.Filseoptions.equipmentCode[0] = this.Userlist.equipment_code[0]
      // this.Filseoptions.code = this.Filseoptions.equipmentCode[0]
      // this.Filseoptions.equipmentCode.push(this.FilesParam.equipment_code)
      // 得到下拉框设备唯一标识符
      this.FilesParam.equipment_code = this.Filseoptions.code
      // 查询定位
      this.equipment_code = this.Filseoptions.code
      // 查询目录下的文件
      this.queryFiles()
      // 查询定位
      this.equipmentGetTargeting()
    },
    // 查询下级目录文件
    SeeFiless(index, row) {
      // // 表格加载数据
      // this.loading = true
      this.FilesParam.equipment_code = this.Filseoptions.code
      // if (this.Filseoptions.equipmentCode.length !== 1) {
      //   this.$message.error(this.$t('message.YouCanOnlySelectOneDirectory'))
      //   return false
      // } else
      // if (this.Filseoptions.equipmentCode.length === 1) {
      this.DeviceeditForm = Object.assign({}, row)
      if (this.FilesParam.path === '/') {
        this.FilesParam.path = this.FilesParam.path + this.DeviceeditForm.name
      } else {
        this.FilesParam.path = this.FilesParam.path + '/' + this.DeviceeditForm.name
      }

      this.queryFiles()
      // }
    },

    // 返回上级目录
    returnToUpper() {
      var i = this.FilesParam.path.lastIndexOf('/')
      var str = this.FilesParam.path.substring(0, i)
      if (str === '') {
        str = '/'
      }
      this.FilesParam.path = str
      this.queryFiles()
      // console.log('hhhhh+++:' + this.FilesParam.path[0])
    },
    // 查询远程的文件
    queryFiles() {
      // 清空数据表格
      this.FilesDeviceTableData = []
      // 表格加载数据
      this.loading = true
      fileOperation_toke(this.FilesParam).then(response => {
        if (response.errorCode === 0) {
          this.loading = false
          this.FilesDeviceTableData = response.result.fileList
        } else {
          parentsFiles(response.errorMessage)
          this.loading = false
        }
      })
    },
    // 查询设备定位
    equipmentGetTargeting() {
      this.equipment_code = this.Filseoptions.equipmentCode[0]
      // console.log('chen' + this.equipment_code)
      equipment_getTargeting_equipment_code_token(this.equipment_code).then(response => {
        if (response.errorCode === 0) {
          this.DeviceLocationForm = response.result
        } else {
          parentsFiles(response.errorMessage)
        }
      })
    },
    // 删除单个文件
    deleteFiles(row) {
      this.$confirm(this.$t('message.Areyousuretodelete'), this.$t('message.Notification'), {
        type: 'warning'
      })
        .then(response => {
          this.deleteFilseParam.equipment_code = this.Filseoptions.code
          this.DeviceeditForm = Object.assign({}, row)
          this.deleteFilseParam.path = this.FilesParam.path + '/' + this.DeviceeditForm.name
          fileOperation_toke(this.deleteFilseParam).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Deletesuccessed'))
            } else {
              parentsFiles(response.errorMessage)
            }
            this.queryFiles()
          })
        })
        .catch(() => {})
    },

    //
    getTreeCheckedKeysChange(d, ifcheckstate) {
      // 最新勾选的设备分组集合
      var newCheckedKeysArrys = this.$refs.userExpandMenuList.getCheckedKeys()
      if (newCheckedKeysArrys.length !== this.setTree.length) {
        // 当前不是全选取消全选勾选框
        this.$refs.userExpandMenuList.setChecked('', false, false)
      }
      // 之前勾选的设备分组集合
      var beforeCheckedKeysArrysArray = this.getCheckedUserKeys
      var arr5 = []
      var arr6 = []
      // 最新的减去之前的勾选的数组如果有''的数组就是说勾选了所有分组(顶部的所有分组声明的id为'')
      arr5 = arrayDifferent(newCheckedKeysArrys, beforeCheckedKeysArrysArray, arr5)
      // 之前的减去最新的勾选的数组如果有''的数组就是说取消勾选了所有分组(顶部的所有分组声明的id为'')
      arr6 = arrayDifferent(beforeCheckedKeysArrysArray, newCheckedKeysArrys, arr6)
      if (arr5.includes('')) {
        // 勾选了所有分組
        this.$refs.userExpandMenuList.setCheckedNodes(this.setTree, false)
      } else if (arr6.includes('')) {
        // 取消勾选所有分組
        this.$refs.userExpandMenuList.setCheckedNodes([], false)
      }

      // 如果当前没有勾选
      if (this.$refs.userExpandMenuList.getCheckedKeys().length === 0) {
        // 选中的节点为null
        d = null
      }
      // 点击Tree节点事件
      this.handleNodeClick(d, null, null)
      // 源代码
      // this.MQEquipment.user_group_id = []

      // 得到勾选的用户分组集合
      this.getCheckedUserKeys = this.$refs.userExpandMenuList.getCheckedKeys()

      // 源代码
      // for (var i = 0; i < this.getCheckedUserKeys.length; i++) {
      //   // 如果为空不添加
      //   if (this.getCheckedUserKeys[i] !== '') {
      //     this.MQEquipment.user_group_id.push(this.getCheckedUserKeys[i])
      //   }
      // }

      // 修改后
      this.MQEquipment.user_group_id = []
      this.MQEquipment.user_group_id.push(this.theCurrentlySelectedUserGroup_id)
      // console.log('gggg' + this.theCurrentlySelectedUserGroup_id)
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
    // 根据用户分组或用户ID对设备上已经推送的APK进行批量删除。
    unInstallAppUserGroupLocals() {
      if (this.mentmultipleSelection.length === 0) {
        return false
      }
      this.$confirm(
        this.$t('behaviorMg.AreyousuretouninstallselectedAPPs'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          // 添加之前先清空
          this.userGroupList.user_group_id = []
          this.userGroupList.user_group_id.push(
            this.theCurrentlySelectedUserGroup_id
          )
          equipment_unInstallAppUserGroupLocal_token(this.userGroupList).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('behaviorMg.Uninstallsuccessed'))
              } else {
                this.$message.error(response.errorMessage)
              }
              this.equipmentqueryAPKUserGroup()
            }
          )
        })
        .catch(() => {
          return false
        })
    },

    // 根据用户分组或用户ID对设备上已经推送的APK进行删除。
    unInstallAppUserGroupLocal(row) {
      this.$confirm(
        this.$t('message.Areyousuretodelete'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          // 添加之前先清空
          this.userGroupList.file_id = []
          this.userGroupList.user_group_id = []
          this.userGroupList.user_group_id.push(
            this.theCurrentlySelectedUserGroup_id
          )
          this.userGroupList.file_id.push(row.file_id)
          equipment_unInstallAppUserGroupLocal_token(this.userGroupList).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Deletesuccessed'))
              } else {
                this.$message.error(response.errorMessage)
              }
              this.equipmentqueryAPKUserGroup()
            }
          )
        })
        .catch(() => {
          return false
        })
    },

    // 根据用户分组或用户ID对设备上已经推送的APK进行查询。
    equipmentqueryAPKUserGroup() {
      // 根据用户分分组查询已推送应用
      var queryAPKUserGroupParams = {
        user_group_id: '',
        parentTopic: 'MQTT_QHMDM'
      }
      // 如果当前分组是所有分组
      if (this.theCurrentlySelectedUserGroup_id === '') {
        return false
      }
      queryAPKUserGroupParams.user_group_id = this.theCurrentlySelectedUserGroup_id
      equipment_queryAPKUserGroup_token(queryAPKUserGroupParams).then(
        response => {
          if (response.errorCode === 0) {
            if (response.result !== null) {
              if (response.result.length !== 0) {
                this.PushapplicationList = response.result[0]
              }
            }
          } else {
            this.PushapplicationList = []
          }
        }
      )
    },

    // 操作指令弹出框
    privatedirecti() {
      // 判断不能同时选择单个和分组
      if (
        !isEquipmentGropu_idNotAll(
          this.MQEquipment.user_ids,
          this.MQEquipment.user_group_id
        )
      ) {
        return false
      }
      this.SettingInstructionDialogShow = true
    },
    // 批量删除白名单方法
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
          this.WhiteAddForm.user_group_id = []
          this.WhiteAddForm.user_group_id.push(
            this.theCurrentlySelectedUserGroup_id
          )
          equipment_deleteNetWriteMQListLocalUser_token(this.WhiteAddForm).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Deletesuccessed'))
              } else {
                this.$message.error(response.errorMessage)
              }
              this.userWhileQuery()
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
          this.WhiteAddForm.NetList = []
          this.WhiteAddForm.user_group_id = []
          this.WhiteAddForm.NetList.push(row.write_net_id)
          this.WhiteAddForm.user_group_id.push(
            this.theCurrentlySelectedUserGroup_id
          )
          equipment_deleteNetWriteMQListLocalUser_token(this.WhiteAddForm).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Deletesuccessed'))
              } else {
                this.$message.error(response.errorMessage)
              }
              this.userWhileQuery()
            }
          )
        })
        .catch(() => {
          return false
        })
    },

    // 确认设置指令有效时间
    setCommandValidTimeButton() {
      var rebootMQEquipmentValidTime = this.setCommandValidTime.hourlyBasis * this.setCommandValidTime.timeValue
      this.MQEquipment.validTime = rebootMQEquipmentValidTime
      this.$message.success(this.$t('message.Setupsuccessed'))
      this.TimeDialogShow = false
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
      this.TimeDialogShow = true
      // 默认选中分为单位的时间下拉框
      this.timeValueOptions = this.timeMinuteOrHourOptions
    },

    // 设备配置Change事件
    switchChange(rwo) {
      var configParmet = {}
      if (this.DeviceModelVisible !== true) {
        var user_group_ids = []
        user_group_ids.push(this.theCurrentlySelectedUserGroup_id)
        configParmet.user_group_id = user_group_ids
      } else {
        configParmet.user_id = this.MQEquipment.user_ids
      }
      var equipment_configuration_item_en_name =
        rwo.equipment_configuration_item_en_name
      var configApp = rwo.status_bool
      var configParmetConf = {}
      // console.log(configValue)
      // console.log(123)
      // console.log(configParmet.config)
      // console.log(456)
      // console.log(configApp)
      var configKey = equipment_configuration_item_en_name
      var configValue = configApp
      configParmetConf[configKey] = configValue
      configParmet.config = configParmetConf
      configParmet.parentTopic = 'MQTT_QHMDM'
      equipment_manageEquipmentConfigLocalUser_token(configParmet).then(
        response => {
          if (response.errorCode === 0) {
            this.$message.success(this.$t('message.Successed'))
          } else {
            this.$message.error(response.errorMessage)
          }
        }
      )
    },
    // 默认应用下拉框事件
    deviceselectRoleChange() {
      this.equipmentqueryConfigListLocalUser()
    },

    // 查询默认应用
    equipmentqueryConfigListLocalUser() {
      // 清空数组
      this.equipmentqueryList.user_group_ids = []
      // 如果当前是所有分组
      if (this.theCurrentlySelectedUserGroup_id === '') {
        return false
      }
      this.equipmentqueryList.user_group_ids.push(
        this.theCurrentlySelectedUserGroup_id
      )
      equipment_queryConfigListLocalUser_token(this.equipmentqueryList).then(
        response => {
          if (response.errorCode === 0) {
            if (response.result !== null) {
              if (response.result.length !== 0) {
                this.deviceConfingactionList = response.result.equipment_item
              }
            }
          } else {
            this.deviceConfingactionList = []
          }
        }
      )
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
        .catch(() => {
          return false
        })
    },
    // 设备恢复出厂设置
    equipmentRestoreFactorySettings() {
      this.$confirm(
        this.$t('message.IsItSureToRestoreTheFactorySetting'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          // 私有云根据用户id或者用户分组id设备重关机调用指令接口
          equipment_restoreMQEquipmentUser(this.MQEquipment).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.ResumeFactorySettingSuccess'))
              } else {
                this.$message.error(response.errorMessage)
              }
            }
          )
        })
        .catch(() => {
          return false
        })
    },

    // 设备解锁
    deviceunlok() {
      this.$confirm(
        this.$t('message.Areyousuretounlockselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          equipment_unRockMQEquipmentLocalUser_post(this.MQEquipment).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Unlocksuccessed'))
              } else if (response.errorCode !== 0) {
                this.$message.error(response.errorMessage)
              }
            }
          )
        })
        .catch(() => {
          return false
        })
    },

    // 设备解绑
    deviceUnbundling() {
      this.$confirm(
        this.$t('message.Areyousuretoreleaseselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          equipment_unBindMQEquipmentLocalUser_token(this.MQEquipment).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.unBindSuccess'))
              } else if (response.errorCode !== 0) {
                this.$message.error(response.errorMessage)
              }
            }
          )
        })
        .catch(() => {
          return false
        })
    },

    // 设备锁定
    deviceLock() {
      this.$confirm(this.$t('message.Areyousuretolockselecteddevices'), this.$t('message.Notification'), {
        type: 'warning'
      })
        .then(() => {
          equipment_rockMQEquipmentLocalUser_post(this.MQEquipment).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Lockscreensuccessed'))
              } else if (response.errorCode !== 0) {
                this.$message.error(response.errorMessage)
              }
            }
          )
        })
        .catch(() => {
          return false
        })
    },

    // 设备重启
    deviceRestart() {
      this.$confirm(
        this.$t('message.Areyousuretorebootselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
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
        })
        .catch(() => {
          return false
        })
    },

    // 设备回收
    deviceReset() {
      this.$confirm(
        this.$t('message.Areyousuretorecallselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
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
        })
        .catch(() => {
          return false
        })
    },

    // 设备关机
    deviceShutdown() {
      this.$confirm(
        this.$t('message.Areyousuretopoweroffselecteddevices'),
        this.$t('message.Notification'), {
          type: 'warning'
        })
        .then(() => {
          // 私有云根据用户id或者用户分组id设备重关机调用指令接口
          equipment_closeMQEquipmentUser_token(this.MQEquipment).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Poweroffsuccessed'))
              } else {
                this.$message.error(response.errorMessage)
              }
            }
          )
        })
        .catch(() => {
          return false
        })
    },

    // 新增白名单按钮显示弹出框
    showNetwrok() {
      if (this.theCurrentlySelectedUserGroup_id === '') {
        this.$message.error(this.$t('behaviorMg.Pleaseselectusergroup'))
        return false
      }
      this.NetWrokDialogShow = true
    },

    // 重置白名单事件
    resetNetwrok() {
      this.$refs['WhiteAddForm'].resetFields()
    },

    // 添加白名单方法
    addNetwrok() {
      this.$refs.WhiteAddForm.validate(vaild => {
        if (vaild) {
          var addnetwrk = {}
          var user_group_id = new Array(0)
          var oneNetList = {}
          var NetListName = this.WhiteAddForm.NetListName
          var NetListUrl = this.WhiteAddForm.NetListUrl
          oneNetList[NetListName] = NetListUrl
          addnetwrk.NetList = oneNetList
          user_group_id.push(this.theCurrentlySelectedUserGroup_id)
          addnetwrk.user_group_id = user_group_id
          addnetwrk.parentTopic = this.WhiteAddForm.parentTopic
          equipment_setNetWriteListLocalUser_token(addnetwrk).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Addsuccessed'))
              this.userWhileQuery()
              this.resetNetwrok()
              return false
            } else {
              this.$message.error(response.errorMessage)
              this.resetNetwrok()
              return false
            }
          })
        }
      })
    },

    // 根据用户分组id查询白名单
    userWhileQuery() {
      var whiteListQuery = {
        user_group_id: '',
        parentTopic: 'MQTT_QHMDM'
      }
      // 如果当前分组是所有分组
      if (this.theCurrentlySelectedUserGroup_id === '') {
        return false
      }
      whiteListQuery.user_group_id = this.theCurrentlySelectedUserGroup_id
      equipment_queryWriteNetListUserGroup_token(whiteListQuery).then(
        response => {
          if (response.errorCode === 0) {
            this.whiteList = response.result[0].write_nets
          } else {
            this.$message.error(response.errorMessage)
            return false
          }
        }
      )
    },

    // 查询私有云用户分组
    userGroup_queryPrivatecloud_token_get() {
      userGroup_queryPrivatecloud_token_get().then(response => {
        // 所有分组
        var allOfTheGroup = {
          user_group_id: '',
          user_group_name: this.$t('userMg.Allgroups'),
          parent_group_id: 0,
          sub_user_group: []
        }
        this.setTree.push(allOfTheGroup)
        // 再添加接口返回的分组
        for (var value of response.result) {
          this.setTree.push(value)
          this.multipleChoiceSetTree.push(value)
        }
      })
    },

    // 查询用户信息
    searchUserinfo() {
      this.UserlistQuery.page_no = 1
      this.getUserList()
    },
    // 获取下拉框角色类型list
    getRoleOptionList() {
      role_query_token_get().then(response => {
        this.defaultShouldbeOptions = response.result
      })
    },
    // 查询用户数据
    getUserList() {
      getUserinfo(this.UserlistQuery).then(response => {
        if (response.errorCode === 0) {
          // if (response.result.list.length === 0) {
          //   this.$message.error(
          //     this.$t('behaviorMg.Tehreisnouserincurrentgroup')
          //   )
          // }
          this.Userlist = response.result.list
          this.Usertotal_count = response.result.total_count
        } else {
          this.$message.error(response.errorMessage)
          this.Userlist = []
        }
      })
    },
    // 用户列表
    UserhandleSizeChange(val) {
      this.UserlistQuery.page_size = val
      this.getUserList()
    },
    UserhandleCurrentChange(val) {
      this.UserlistQuery.page_no = val
      this.getUserList()
    },
    handleClick(tab, event) {
      this.crumbs = tab.label
    },
    // 推送应用数据
    menthandleSelectionChange(val) {
      this.mentmultipleSelection = val
      var ids = this.mentmultipleSelection.map(item => item.file_id).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.userGroupList.file_id = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.userGroupList.file_id.push(strs[i])
        }
      }
    },
    // 用户列表多选数组
    handleSelectionChange(val) {
      this.multipleSelection = val
      // 获取设备唯一标识符
      // var idss = this.multipleSelection.map(item => item.equipment_code).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      // var strss = idss.split(',') // 字符分割
      // console.log('dddd' + idss)
      // console.log('dddd' + strss)
      // this.FilesParam.equipmentCode = strss[0]
      // for (var l = 0; l < strss.length; l++) {
      //   // 如果为空不添加
      //   if (strss[l] !== '') {
      //     this.equipment_code.push(strss[l])
      //   }
      // }
      // 获取用户ID
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
      // 如果同时选择单个和分组,单个优先
      if (
        this.MQEquipment.user_ids.length > 0 &&
        this.MQEquipment.user_group_id.length > 0
      ) {
        this.MQEquipment.user_group_id = []
      }
    },
    // 白名单多选数组
    whiteSelectionChange(val) {
      this.whitemultipleSelection = val
      // 先得到设备分组id
      var ids = this.whitemultipleSelection.map(item => item.write_net_id).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.WhiteAddForm.NetList = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.WhiteAddForm.NetList.push(strs[i])
        }
      }
    },
    initExpand() {
      this.setTree.map(a => {
        this.defaultExpandKeys.push(a.user_group_id)
      })
      // this.isLoadingTree = true
    },
    handleNodeClick(d, n, s) {
      if (d === null) {
        // 选中的设备分组的名称显示出来
        this.theCurrentlySelectedGroup = this.$t('userMg.Null')
        // 选中的设备分组的id
        this.theCurrentlySelectedUserGroup_id = ''
        return false
      }
      // 重置分页参数
      this.UserlistQuery =
      {
        page_no: 1,
        page_size: 7,
        user_name: '',
        role_code: 3,
        user_group_id: ''
      }
      // 选中的用户分组的id
      this.theCurrentlySelectedUserGroup_id = d.user_group_id
      this.UserlistQuery.user_group_id = this.theCurrentlySelectedUserGroup_id
      // 根据分组查询用户
      this.getUserList()
      // 根据用户分组id查询白名单
      this.userWhileQuery()
      // 用户分组id查询白默认应用
      this.equipmentqueryConfigListLocalUser()
      // 根据用户分组或用户ID对设备上已经推送的APK进行查询。
      this.equipmentqueryAPKUserGroup()

      // 选中的用户分组的名称显示出来
      this.theCurrentlySelectedGroup = d.user_group_name
      // 点击节点
      d.isEdit = false // 放弃编辑状态
    },
    // renderContent(h, { node, data, store }) {
    //   // 加载节点
    //   this.$set(node, 'isEdit', false)
    //   const that = this
    //   return h(treeRender, {
    //     props: {
    //       DATA: data,
    //       NODE: node,
    //       STORE: store
    //     },
    //     on: {
    //       nodeAdd: (s, d, n) => that.handleAdd(s, d, n),
    //       nodeEdit: (s, d, n) => that.handleEdit(s, d, n),
    //       nodeDel: (s, d, n) => that.handleDelete(s, d, n)
    //     }
    //   })
    // },
    handleAdd(s, d, n) {
      // 增加节点
      if (n.level >= 2) {
        this.$message.error(this.$t('behaviorMg.Onlysupport3levels'))
        return false
      }
      const user_group_parmentadd = {
        user_group_name: this.$t('behaviorMg.Newnode'),
        parent_group_id: d.user_group_id,
        sub_user_group: []
      }
      userGroup_insertPrivatecloud_type_token_post(user_group_parmentadd).then(
        response => {
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
        }
      )
      // 展开节点
      if (!n.expanded) {
        n.expanded = true
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

