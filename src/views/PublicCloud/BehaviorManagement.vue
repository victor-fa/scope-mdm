<template>
  <div class="Publiccloud-home">
      <the-breadcrumb>
       <el-breadcrumb-item>{{$t('Breadcrumb.RemoteControl')}}</el-breadcrumb-item>
    </the-breadcrumb>
    <el-container>
      <el-aside>
        <div class="Group-title top-commonborder">
          <div class="common-title">{{$t('behaviorMg.Devicegroup')}}</div>
          <el-scrollbar class="commonScrollbar" style="height: 620px;">
            <div class="expand">
              <div>
                <el-tree accordion key="1"  v-if="multiple" ref="DeviceExpandMenuList" @check="getTreeCheckedKeysChange" class="expand-tree" :data="setTree" node-key="equipment_group_id" highlight-current :props="defaultProps" :expand-on-click-node="false" :default-expanded-keys="defaultExpandKeys" @node-click="handleNodeClick" :check-on-click-node="false"></el-tree>
                <el-tree accordion key="2" v-else ref="DeviceExpandMenuList" @check="getTreeCheckedKeysChange" class="expand-tree" :data="multipleChoiceSetTree" node-key="equipment_group_id" highlight-current :props="defaultProps" :expand-on-click-node="false" :default-expanded-keys="defaultExpandKeys" @node-click="handleNodeClick" :check-on-click-node="false"></el-tree>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </el-aside>
      <el-main>
        <div class="SelectedGroup-title top-commonborder">
          <div class="common-title">{{$t('behaviorMg.Selecteddevicegroup')}}&nbsp;&nbsp;
            <span>{{ theCurrentlySelectedGroup }}</span>
          </div>
        </div>

        <el-tabs v-model="client_activeName" @tab-click="handleClick" highlight-current-row style="height:600px;">
          <el-tab-pane :label="$t('Breadcrumb.DeviceLists')" name="first">
            <!--toolbar-->
            <el-form :inline="true">
              <el-form-item>
                <el-input style="width:290px;" class="client-input" :placeholder="$t('behaviorMg.DeviceGuidUserName')" v-model="DevicelistQuery.equipmentCode" @keyup.enter.native="searchequipment"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="searchequipment">
                  {{$t('table.Search')}}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :disabled="isdisableButton" @click="directivts">
                  {{$t('behaviorMg.Operation')}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
              </el-form-item>
              <el-form-item>
                   <template slot-scope="scope">
                   <el-button type="primary"  :disabled="isdisableButton"  @click="SeeFiles(scope.$index,scope.row)"> {{$t('behaviorMg.ViewingDeviceFiles')}}</el-button>
                   </template>
              </el-form-item>
            </el-form>
            <!--列表-->
            <el-scrollbar class="commonScrollbar" style="height:450px;">
              <el-table :data="DeviceList" highlight-current-row  @selection-change="handleSelectionChange">
                <el-table-column type="selection" :selectable="canICheckIt" width="55">
                </el-table-column>
                <el-table-column prop="equipment_code" :label="$t('behaviorMg.DeviceGUID')" width="230" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="create_time" :label="$t('table.Date')" width="180">
                  <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="user_name" :label="$t('behaviorMg.Binder')" width="100" align="center">
                  <template slot-scope="scope">
                    {{scope.row.user_name | formatBindDeviceUser}}
                  </template>
                </el-table-column>groupName

                <el-table-column prop="state" :label="$t('behaviorMg.Status')" min-width="180">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.state | EquipmentState">{{scope.row.state|formatEquipmentState}}</el-tag>
                  </template>
                </el-table-column>
                <!-- <el-table-column>
                     <template slot-scope="scope">
                   <el-button type="primary"  :disabled="isdisableButton" @click="SeeFiles(scope.$index,scope.row)">查看</el-button>
                   </template>
                </el-table-column> -->
              </el-table>
            </el-scrollbar>
            <!--工具条-->
            <div class="block">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="DevicelistQuery.pageNo" :page-sizes="[7, 10, 20, 30]" :page-size="DevicelistQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="DeviceTotal">

              </el-pagination>
            </div>
          </el-tab-pane>
          <!--白名单面板-->
          <el-tab-pane :label="$t('Breadcrumb.WebsiteWhitelists') " name="two" :disabled="isTheCurrentlySelectedGroup_id">
            <el-form :inline="true">
              <el-form-item>
                <el-button class="client-buttom" icon="el-icon-circle-plus-outline" type="primary" @click="addnewtwrok">{{$t('table.Add')}}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="danger" :disabled="isdisableButton" @click="deletesNewtwork" icon="el-icon-delete">{{$t('table.Deleteselected')}}</el-button>
              </el-form-item>
            </el-form>
            <br>
            <!-- <p>白名单列表:</p> -->
            <el-table :data="whiteList" highlight-current-row style="width: 100%;" @selection-change="WhiteSelectionChange">
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
          <!--应用白名单面板-->
          <el-tab-pane :label="$t('Breadcrumb.ApplicationWhitelists') " name="Three" :disabled="isTheCurrentlySelectedGroup_id">
            <el-form :inline="true">
              <el-form-item>
                <el-button class="client-buttom" icon="el-icon-circle-plus-outline" type="primary" @click="addapplication">{{$t('table.Add')}}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="danger" :disabled="isdisableButton" @click="deletesNewtwork" icon="el-icon-delete">{{$t('table.Deleteselected')}}</el-button>
              </el-form-item>
            </el-form>
            <br>
            <!-- <p>应用白名单列表:</p> -->
            <el-table :data="[]" highlight-current-row style="width: 100%;" @selection-change="WhiteSelectionChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column :label="'应用名称'" prop="write_net_name" width="200">
              </el-table-column>
              <el-table-column :label="'来源'" prop="write_net_address" width="200">
              </el-table-column>
              <el-table-column :label="'上网'" prop="create_time" width="180">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="'操作'" width="150" align="center">
                <template slot-scope="scope">
                  <el-button size="small" type="primary">{{$t('table.Edit')}}</el-button>
                  <el-button size="small" type="danger">{{$t('table.Delete')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!--白名单列表面板-->
          <el-tab-pane :label="$t('Breadcrumb.Whitelists') " name="Four" :disabled="isTheCurrentlySelectedGroup_id">
            <el-form :inline="true">
              <el-form-item>
                <el-button class="client-buttom" icon="el-icon-circle-plus-outline" type="primary" @click="addapplication">{{$t('table.Add')}}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="danger" :disabled="isdisableButton" @click="deletesNewtwork" icon="el-icon-delete">{{$t('table.Deleteselected')}}</el-button>
              </el-form-item>
            </el-form>
            <br>
            <!-- <p>白名单列表:</p> -->
            <el-table :data="[]" highlight-current-row style="width: 100%;" @selection-change="WhiteSelectionChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column :label="'白名单名称'" prop="write_net_name" width="200">
              </el-table-column>
              <el-table-column :label="'来源'" prop="write_net_address" width="200">
              </el-table-column>
              <el-table-column :label="'上网'" prop="create_time" width="180">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="'操作'" width="150" align="center">
                <template slot-scope="scope">
                  <el-button size="small" type="primary">{{$t('table.Edit')}}</el-button>
                  <el-button size="small" type="danger">{{$t('table.Delete')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!--默认应用面板-->
          <el-tab-pane :label="$t('Breadcrumb.DefaultAPPs') " name="Five" :disabled="isTheCurrentlySelectedGroup_id">
            <el-form :inline="true">
              <el-form-item>
                <el-select ref="selectBehavior" @change='selectRoleChange' :placeholder="$t('table.Type')" v-model="AppListQuery.configuration_item_type">
                  <el-option v-for="item in DefaultApplicationOptions" :key="item.configuration_item_type" :label="item.role_name" :value="item.configuration_item_type">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <!--列表-->
            <el-scrollbar class="commonScrollbar" style="height:450px;">
              <el-table :data="deviceConfingactionList" highlight-current-row style="width:100%;">

                <el-table-column :label="$t('behaviorMg.APPName')" prop="equipment_configuration_item_name" width="200">
                </el-table-column>
                <el-table-column :label="$t('table.Operation')" width="120" align="center">
                  <template slot-scope="scope">
                    <el-select @change="switchChange(scope.row)" v-model="scope.row.status_bool" :placeholder="$t('message.SelectInfo')">
                      <el-option v-for="item in StatusOptions" :disabled="item.disabled" :key="item.status_bool" :label="item.state_name" :value="item.status_bool">
                      </el-option>
                      <!-- <el-option  :disabled="false" :key="false" :label="$t('behaviorMg.Off')" :value="false">
                      </el-option> -->
                    </el-select>
                  </template>

                </el-table-column>
              </el-table>
            </el-scrollbar>
          </el-tab-pane>
          <!--已推送应用面板-->
          <el-tab-pane :label="$t('Breadcrumb.PushAPP') " name="Six" :disabled="isTheCurrentlySelectedGroup_id">
            <el-form :inline="true">
              <el-form-item>
                <el-button type="danger" @click="unInstallAppEquipmentGroupLocals" :disabled="isdisableButton" icon="el-icon-delete">{{$t('table.Deleteselected')}}</el-button>
              </el-form-item>
            </el-form>
            <!--列表-->
            <el-scrollbar class="commonScrollbar" style="height:450px;">
              <el-table :data="PushapplicationList" height="450" highlight-current-row style="width: 100%;" @selection-change="menthandleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column :label="$t('behaviorMg.APPName')" prop="file_name" width="200">
                </el-table-column>
                <el-table-column :label="$t('table.Operation')" width="190" align="center">
                  <template slot-scope="scope">
                    <el-button size="small" type="danger" @click="unInstallAppEquipmentGroupLocal(scope.row)">{{$t('behaviorMg.Uninstall')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <!--网络白名单-->
    <!-- 添加网络白名单-->
    <el-dialog width="30%" :title="$t('behaviorMg.Addwebsitetowhitelist')" :visible.sync="NetWrokDialogShow" append-to-body>
      <el-form :inline="true" :model="WhiteAddForm" label-position="left" label-width="180px" style='width: 460px; margin-left:50px;' :rules="newteditFormRules" ref="WhiteAddForm" class="demo-form-inline">
        <el-form-item :label="$t('behaviorMg.Websitewhitelist')" prop="NetListName">
          <el-input name="NetListName" v-model="WhiteAddForm.NetListName" class="client-input"></el-input>
        </el-form-item>

        <el-form-item :label="$t('behaviorMg.websiteaddress')" prop="NetListUrl">
          <el-input name="NetListUrl" v-model="WhiteAddForm.NetListUrl" class="client-input"></el-input>
          <help style="float:right;margin-left:4px;"></help>

        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="NetWrokDialogShow = false">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary" @click="restNetwrok">{{$t('form.reset')}}</el-button>
        <el-button type="primary" @click="addNewtwok">{{$t('table.OK')}}</el-button>
      </span>

    </el-dialog>
    <!-- 添加应用白名单-->
    <el-dialog width="30%" :title="'添加应用白名单'" :visible.sync="ApplicationDialogShow" append-to-body>
      <el-form :inline="true" :model="AppWhiteAddForm" label-position="left" label-width="180px" style='width: 460px; margin-left:50px;' :rules="newteditFormRules" ref="AppWhiteAddForm" class="demo-form-inline">
        <el-form-item :label="$t('behaviorMg.Websitewhitelist')" prop="NetListName">
          <el-input name="NetListName" v-model="WhiteAddForm.NetListName" class="client-input"></el-input>
        </el-form-item>

        <el-form-item :label="$t('behaviorMg.websiteaddress')" prop="NetListUrl">
          <el-input name="NetListUrl" v-model="WhiteAddForm.NetListUrl" class="client-input"></el-input>
          <help style="float:right;margin-left:4px;"></help>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ApplicationDialogShow = false">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary" @click="restApplication">{{$t('form.reset')}}</el-button>
        <el-button type="primary" @click="addApplication">{{$t('table.OK')}}</el-button>
      </span>
    </el-dialog>
    <!--设置指令有效时间弹出框-->
    <el-dialog width="30%" :title="$t('behaviorMg.Setuptheexpiretimeofoperation')" :visible.sync="TimeDialogShow" append-to-body>
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
        <el-button @click="TimeDialogShow = false">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary" @click="setCommandValidTimeButton">{{$t('table.OK')}}</el-button>
      </span>

    </el-dialog>
    <el-dialog width="50%" :title="$t('behaviorMg.Operation')" :visible.sync="SettingInstructionDialogShow" append-to-body>
      <el-form>
        <!-- <el-form-item :label="$t('behaviorMg.Operationtype')">
          <el-radio v-model="instructionBehaviorRadio" label="1">{{$t('behaviorMg.Realtime')}}</el-radio>
          <el-radio v-model="instructionBehaviorRadio" label="2">{{$t('behaviorMg.Fixedtime')}}</el-radio>
          <el-date-picker @change="datePickerChange()" :picker-options="pickerOptions" value-format="timestamp" style="margin-left:20px;" v-model="MQEquipment.endTime" v-if="this.instructionBehaviorRadio==2" type="datetime" :placeholder="$t('behaviorMg.Selectdatetime')">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item>
         <el-button v-if="this.instructionBehaviorRadio==1" class="client-buttom order-buttom" @click="equipmentRestoreFactorySettings" type="primary">{{$t('behaviorMg.RestoreFactorySettings')}}</el-button>

          <el-button v-if="this.instructionBehaviorRadio==1" class="client-buttom order-buttom" @click="deviceunbundling" type="primary">{{$t('behaviorMg.Unbind')}}</el-button>

          <el-button v-if="this.instructionBehaviorRadio==1" class="client-buttom order-buttom" @click="devicereset" type="primary">{{$t('behaviorMg.Release')}}</el-button>

          <el-button class="client-buttom order-buttom" @click="deviceShutdown" type="primary">{{$t('behaviorMg.Poweroff')}}</el-button>

          <el-button class="client-buttom order-buttom" @click="devicerestart" type="primary">{{$t('behaviorMg.Reboot')}}</el-button>

          <el-button v-if="this.instructionBehaviorRadio==1" class="client-buttom order-buttom" @click="devicelock" type="primary">{{$t('behaviorMg.Lock')}}</el-button>

          <el-button v-if="this.instructionBehaviorRadio==1" class="client-buttom order-buttom" @click="deviceunlok" type="primary">{{$t('behaviorMg.Unlock')}}</el-button>

          <!-- <el-button class="client-buttom" type="primary" @click="showTiem">{{$t('behaviorMg.Setuptheexpiretimeofoperation')}}</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>

<!--查看文件弹出框-->
  <el-dialog width="60%"  :title="$t('behaviorMg.seeFile')" :visible.sync="FilesDialogShow" append-to-body>
    <el-form  :inline="true" :model="DeviceeditForm" :rules="editFormRules" ref="DeviceeditForm">
      <!-- <el-form-item>
         <el-select v-model="FilesParam.content" placeholder="请选择文件夹">
    <el-option v-for="item in Filseoptions" :key="item.equipmentCodes" :label="item.content" :value="item.equipmentCodes"></el-option>
  </el-select>
      </el-form-item> -->
    <el-form-item>{{$t('behaviorMg.Catalog')}}：<el-input style="width:400px;" class="client-input"  v-model="FilesParam.path" :disabled="true"></el-input></el-form-item>
    <el-form-item><el-button  size="small" type="primary" icon="el-icon-arrow-up" @click="returnToUpper()">{{$t('behaviorMg.ReturnToHigherDirectory')}}</el-button></el-form-item>
    <el-form-item><el-button  size="small" type="primary" icon="el-icon-view" @click="DeviceLocation()">{{$t('behaviorMg.ViewDeviceLocation')}}</el-button></el-form-item>
    <el-table :data="FilesTableData"  style="width: 100%"   v-loading="loading"  :element-loading-text="$t('behaviorMg.loadDataInfo')">
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
     <el-table-column :label="$t('table.Operation')" width="200" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.property===0"  size="small" type="danger" icon="el-icon-delete" @click="deleteFiles(scope.row)">{{$t('table.Delete')}}</el-button>
              <el-button v-if="scope.row.property===1 " size="small" type="primary" icon="" @click="SeeFiless(scope.index,scope.row)">{{$t('behaviorMg.Catalog')}}</el-button>
            </template>
          </el-table-column>
    </el-table>
      </el-form>
  </el-dialog>
   <!--设备定位弹出框-->
   <el-dialog  width="60%"  :title="$t('behaviorMg.localPostionInfo')" :visible.sync="DeviceLocationDialogShow" append-to-body>
          <el-form  :inline="true" :model="DeviceLocationForm" :rules="editFormRules" ref="DeviceLocationForm">
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
  equipment_restoreMQEquipment,
  equipmentGroup_queryEquipmentGroup_get,
  equipmentGroup_addEquipmentGroup_post,
  equipmentGroup_deleteEquipmentGroupById_groupId_get,
  equipment_queryWriteNetList_token,
  equipment_setNetWriteMQList_token,
  equipment_queryEquipment_pageNo_pageSize_equipmentID_get,
  equipment_resetMQEquipment_post,
  equipment_closeMQEquipment_post,
  equipment_rebootMQEquipment_post,
  equipment_rockMQEquipment_post,
  equipment_unBindMQEquipment_token,
  equipment_unRockMQEquipment_post,
  equipment_manageEquipmentConfig_token,
  equipment_queryConfigList_token,
  equipmentGroup_queryEquipmentsForGroup_token,
  equipment_deleteNetWriteMQList_token,
  equipment_queryAPKEquipmentGroup_token,
  equipment_unInstallAppEquipmentGroup_token
} from '@/api/equipment/equipment'
import { parentsFiles } from '@/utils/response'
import {
  fileOperation_toke,
  equipment_getTargeting_equipment_code_token
} from '@/api/file/file'

import { validateURL } from '@/utils/validate'
import { GetLength } from '@/utils/format'
import { arrayDifferent } from '@/utils/array'
export default {
  name: 'BehaviorManagement',
  data() {
    const validateNetListUrl = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('behaviorMg.Pleaseinputthewhitelistnames')))
      } else {
        if (GetLength(value) === 1) {
          callback(new Error(this.$t('message.Input2lettersatleast')))
        } else if (validateURL(value) === true) {
          callback(
            new Error(
              this.$t(
                'FourOFour.Forexamplewwwqqcomonlyneedstofillintheqqandverifytheerror'
              )
            )
          )
        } else {
          callback()
        }
      }
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      loading: true, // 表格加载数据

      DeviceLocationForm: {}, // 设备定位from

      DeviceLocationDialogShow: false, // 设备定位弹出框属性

      instructionBehaviorRadio: '1', // 判断指令操作是即使(1默认)还是定时(2)

      isTheCurrentlySelectedGroup_id: true, // 判断是否选中所以分组

      // 默认应用下拉框
      DefaultApplicationOptions: [
        {
          configuration_item_type: 1,
          role_name: this.$t('behaviorMg.Software')
        },
        {
          configuration_item_type: 2,
          role_name: this.$t('behaviorMg.Hardware')
        }
      ],

      // 默认应用状态
      StatusOptions: [
        { status_bool: false, status_name: this.$t('behaviorMg.Off') },
        { status_bool: true, status_name: this.$t('behaviorMg.On') },
        {
          status_bool: 'null',
          status_name: this.$t('behaviorMg.OnorOff'),
          disabled: true
        }
      ],

      deviceDialogStstus: '', // 编辑新增公用属性

      textMap: {
        update: this.$t('behaviorMg.Edit'),
        create: this.$t('behaviorMg.Create')
      },

      selectedTimeTypeLabel: this.$t('behaviorMg.Minute'), // 选中的时间类型 label

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

      // 选择时间单位的下拉框选项
      timeTypeOptions: [
        { timeType: 1, timeNum: this.$t('behaviorMg.Minute') },
        { timeType: 2, timeNum: this.$t('behaviorMg.Hour') },
        { timeType: 3, timeNum: this.$t('behaviorMg.Day') }
      ],

      TimeDialogShow: false, // 设置指令时间弹出框

      SettingInstructionDialogShow: false, // 操作指令弹出框

      timeValueOptions: [], // 设置指令时间属性

      PushapplicationList: [], // 推送应用数据表格

      NetWrokDialogShow: false, // 添加网络白名单弹出框

      ApplicationDialogShow: false, // 添加应用白名单弹出框

      FilesDialogShow: false, // 查看文件弹出框

      FilesTuoDialogShow: false, // 查看目录下的文件弹出框

      FilesTableData: [], // 查看文件数据表格

      FiledisableButton: true, // 批量删除按钮属性

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
        path: '/',
        cmd: 2
      },
      FilseSelection: [], // 文件数组
      // 设备详情form表单元素
      DeviceeditForm: {
        equipment_code: ''

      },

      // 网络白名单非空验证
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
      },

      theCurrentlySelectedGroup: this.$t('behaviorMg.Null'), // 当前选中的分组

      theCurrentlySelectedGroup_id: '', // 当前选中的分组id

      ModelVisible: false, // 型号编辑是否显示属性

      // 白名单from
      WhiteAddForm: {
        parentTopic: 'MQTT_QHMDM',
        NetListUrl: '', // 网址
        NetListName: '', // 网址对应的名称
        equipment_group_id: [],
        NetList: []
      },

      // 应用白名单from
      AppWhiteAddForm: {
        parentTopic: 'MQTT_QHMDM',
        NetListUrl: '', // 网址
        NetListName: '', // 网址对应的名称
        equipment_group_id: [],
        NetList: []
      },

      deviceConfingactionList: [], // 默认应用数据表格

      // 设备列表list
      DevicelistQuery: {
        pageNo: 1,
        pageSize: 7,
        equipmentCode: '',
        equipment_group_id: ''
      },

      // 默认应用
      applistQuery: {
        pageNo: 1,
        pageSize: 7,
        equipmentCode: ''
      },

      // 查询默认应用参数
      AppListQuery: {
        equipment_group_ids: [],
        configuration_item_type: 1
      },

      DeviceList: [], // 设备列表数据表格

      // 表单验证
      editFormRules: {
        equipment_model_name: [
          {
            required: true,
            message: this.$t('behaviorMg.Pleaseinputmodelname'),
            trigger: 'blur'
          }
        ]
      },
      // 包含父亲节点的数组减去不包含父亲节点的数组得到所有父亲节点数组
      // checkedfatherkeyarray: [],
      // 设备操作参数
      MQEquipment: {
        parentTopic: 'MQTT_QHMDM',
        equipmentCode: [],
        validTime: -1,
        endTime: '',
        equipment_group_id: []
      },

      whiteList: [], // 网络白名单表格数据

      isdisableButton: true, // 设备列表操作指令按钮是否禁用

      equipmentIds: [], // 批量删除设备数组

      NetWrokdialogShowOrHide: false, // 网络白名单弹出框属性

      // 删除已推送应用
      equipmentList: {
        equipment_group_id: [],
        file_id: []
      },

      client_activeName: 'first', // 当前面板

      multipleSelection: [], // 设备列表多选数组

      appmultipleSelection: [], // 默认应用多选数组

      whitemultipleSelection: [], // 白名单多选数组

      getCheckedDeviceKeys: [], // 设备分组指令操作多选数组

      DeviceTotal: null, // 设备分页

      crumbs: this.$t('Breadcrumb.DeviceLists'), // 面包屑 当前所在位置

      // 下面的是 tree 配置
      // isLoadingTree: false, // 是否加载节点树

      multiple: true, // 树节点是否是多选

      setTree: [], // 节点树数据

      multipleChoiceSetTree: [], // 单选数组
      // 树形菜单参数
      defaultProps: {
        children: 'sub_group',
        label: 'equipment_group_name'
      },

      defaultExpandKeys: [] // 默认展开节点列表
    }
  },
  computed: {},
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
          this.$refs.DeviceExpandMenuList.setCheckedKeys(
            this.getCheckedDeviceKeys
          )
        })
      }
    },
    // 设备列表按钮是否禁用
    multipleSelection(curVal, oldVal) {
      if (curVal.length === 0) {
        if (this.MQEquipment.equipment_group_id.length === 0) {
          this.isdisableButton = true
        }
      } else if (curVal.length !== 0) {
        this.isdisableButton = false
      }
    },
    // 面板是否禁用
    theCurrentlySelectedGroup_id(curVal, oldVal) {
      if (curVal === '') {
        this.isTheCurrentlySelectedGroup_id = true
      } else if (curVal.length !== '') {
        this.isTheCurrentlySelectedGroup_id = false
      }
    },
    // 推送应用多选方法
    appmultipleSelection(curVal, oldVal) {
      if (curVal.length === 0) {
        this.isdisableButton = true
      } else if (curVal.length !== 0) {
        this.isdisableButton = false
      }
    },
    // 白名单多选方法
    whitemultipleSelection(curVal, oldVal) {
      if (curVal.length === 0) {
        this.isdisableButton = true
      } else if (curVal.length !== 0) {
        this.isdisableButton = false
      }
    },
    getCheckedDeviceKeys(curVal, oldVal) {
      if (curVal.length === 0) {
        if (this.MQEquipment.equipmentCode.length === 0) {
          this.isdisableButton = true
        }
      } else if (curVal.length !== 0) {
        this.isdisableButton = false
      }
    },
    // 远程删除文件
    FilseSelection(curVal, oldVal) {
      if (curVal.length === 0) {
        this.FiledisableButton = true
      } else if (curVal.length !== 0) {
        this.FiledisableButton = false
      }
    }
  },
  created() {
    // 查询设备信息
    this.getDevcieList()

    // 查询默认应用
    this.equipmentqueryConfigList()

    // 查询设备分组
    this.equipment_queryEquipmentGroup_get()
  },
  mounted() {
    this.initExpand()
  },
  methods: {
    // 查看设备定位
    DeviceLocation() {
      this.DeviceLocationDialogShow = true
      this.equipmentGetTargeting()
    },
    // 查看文件
    SeeFiles(index, row) {
      this.FilesParam.path = '/'
      if (this.MQEquipment.equipmentCode.length !== 1) {
        this.$message.error(this.$t('message.OnlyOneDeviceCanBeSelected'))
        return false
      } else if (this.MQEquipment.equipmentCode.length === 1) {
        this.FilesDialogShow = true
        // 获取唯一标识符
        this.FilesParam.equipment_code = this.MQEquipment.equipmentCode[0]

        //
        this.DeviceeditForm = Object.assign({}, row)

        // 查询文件方法
        this.queryFiles()
      }
    },
    // 查询目录下文件
    SeeFiless(index, row) {
      // 表格数据动画加载
      this.loading = true
      if (this.MQEquipment.equipmentCode.length !== 1) {
        this.$message.error(this.$t('message.YouCanOnlySelectOneDirectory'))
        return false
      } else if (this.MQEquipment.equipmentCode.length === 1) {
        // 获取标识符
        this.FilesParam.equipment_code = this.MQEquipment.equipmentCode[0]

        this.DeviceeditForm = Object.assign({}, row)
        // 目录拼接
        // this.FilesParam.path = this.FilesParam.path + '/' + this.DeviceeditForm.name
        if (this.FilesParam.path === '/') {
          this.FilesParam.path = this.FilesParam.path + this.DeviceeditForm.name
        } else {
          this.FilesParam.path = this.FilesParam.path + '/' + this.DeviceeditForm.name
        }
        this.queryFiles()
      }
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
    // 查询文件
    queryFiles() {
      // 清空数据
      this.FilesTableData = []
      // 表格数据动画加载
      this.loading = true
      fileOperation_toke(this.FilesParam).then(response => {
        if (response.errorCode === 0) {
          this.loading = false
          this.FilesTableData = response.result.fileList
        } else {
          parentsFiles(response.errorMessage)
          this.loading = false
        }
      })
        .catch(() => {})
    },
    // 查询设备定位
    equipmentGetTargeting() {
      // 获取唯一标识符
      this.equipment_code = this.MQEquipment.equipmentCode[0]
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
          this.deleteFilseParam.equipment_code = this.MQEquipment.equipmentCode[0]
          this.DeviceeditForm = Object.assign({}, row)
          // 目录拼接
          this.deleteFilseParam.path = this.FilesParam.path + '/' + this.DeviceeditForm.name
          fileOperation_toke(this.deleteFilseParam).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Deletesuccessed'))
            } else {
              parentsFiles(response.errorMessage)
            }
            // 调用查询方法
            this.queryFiles()
          })
        })
        .catch(() => {})
    },

    // 判断这行是否可以勾选
    canICheckIt(row, index) {
      if (row.state !== '1') {
        return true
      }
    },
    getTreeCheckedKeysChange(d, ifcheckstate) {
      // 最新勾选的设备分组集合
      var newCheckedKeysArrys = this.$refs.DeviceExpandMenuList.getCheckedKeys()
      if (newCheckedKeysArrys.length !== this.setTree.length) {
        // 当前不是全选取消全选勾选框
        this.$refs.DeviceExpandMenuList.setChecked('', false, false)
      }
      // 之前勾选的设备分组集合
      var beforeCheckedKeysArrysArray = this.getCheckedDeviceKeys
      var arr5 = []
      var arr6 = []
      // 最新的减去之前的勾选的数组如果有''的数组就是说勾选了所有分组(顶部的所有分组声明的id为'')
      arr5 = arrayDifferent(
        newCheckedKeysArrys,
        beforeCheckedKeysArrysArray,
        arr5
      )
      // 之前的减去最新的勾选的数组如果有''的数组就是说取消勾选了所有分组(顶部的所有分组声明的id为'')
      arr6 = arrayDifferent(
        beforeCheckedKeysArrysArray,
        newCheckedKeysArrys,
        arr6
      )
      if (arr5.includes('')) {
        // 勾选了所有分組
        this.$refs.DeviceExpandMenuList.setCheckedNodes(this.setTree, false)
        // this.$refs.DeviceExpandMenuList.setChecked('', false, false)
      } else if (arr6.includes('')) {
        // 取消勾选所有分組
        this.$refs.DeviceExpandMenuList.setCheckedNodes([], false)
      }
      // 如果当前没有勾选
      if (this.$refs.DeviceExpandMenuList.getCheckedKeys().length === 0) {
        // 选中的节点为null
        d = null
      }
      // 点击Tree节点事件
      this.handleNodeClick(d, null, null)
      // 得到勾选的设备分组集合
      this.getCheckedDeviceKeys = this.$refs.DeviceExpandMenuList.getCheckedKeys()

      this.MQEquipment.equipment_group_id = []
      for (var i = 0; i < this.getCheckedDeviceKeys.length; i++) {
        // 如果为空不添加
        if (this.getCheckedDeviceKeys[i] !== '') {
          this.MQEquipment.equipment_group_id.push(this.getCheckedDeviceKeys[i])
        }
      }
    },

    datePickerChange() {
      // 获取当前时间戳
      const timestamp = new Date().getTime()
      // 如果选择的时间小于当前时间提示错误
      if (this.MQEquipment.endTime < timestamp) {
        this.MQEquipment.endTime = null
        this.$message.error(this.$t('behaviorMg.Cantbeforecurrenttime'))
        return false
      }
    },
    // 指令操作弹出框
    directivts() {
      // 判断不能同时选择单个和分组
      // if (!isEquipmentGropu_idNotAll(
      //   this.MQEquipment.equipmentCode,
      //   this.MQEquipment.equipment_group_id
      // )
      // ) {
      //   return false
      // }
      this.SettingInstructionDialogShow = true
    },

    // 根据设备批量卸载已推送应用
    unInstallAppEquipmentGroupLocals() {
      if (this.appmultipleSelection.length === 0) {
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
          this.equipmentList.equipment_group_id = []
          this.equipmentList.equipment_group_id.push(
            this.theCurrentlySelectedGroup_id
          )
          equipment_unInstallAppEquipmentGroup_token(this.equipmentList).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('behaviorMg.Uninstallsuccessed'))
              } else {
                this.$message.error(response.errorMessage)
              }
              this.queryPushapplicationList()
            }
          )
        })
        .catch(() => {
          return false
        })
    },

    // 根据设备分组id卸载单个已推送应用信息
    unInstallAppEquipmentGroupLocal(row) {
      this.$confirm(
        this.$t('message.Areyousuretodelete'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          // 添加之前先清空
          this.equipmentList.equipment_group_id = []
          this.equipmentList.equipment_group_id.push(
            this.theCurrentlySelectedGroup_id
          )
          this.equipmentList.file_id.push(row.file_id)
          equipment_unInstallAppEquipmentGroup_token(this.equipmentList).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Deletesuccessed'))
              } else {
                this.$message.error(response.errorMessage)
              }
              this.queryPushapplicationList()
            }
          )
        })
        .catch(() => {
          return false
        })
    },

    // 根据设备id查询已推送应用信息
    queryPushapplicationList() {
      // 根据设备分组id查询已推送应用
      var queryAPKEquipmentGroupParams = {
        equipment_group_id: '',
        parentTopic: 'MQTT_QHMDM'
      }
      // 如果当前分组是所有分组
      if (this.theCurrentlySelectedGroup_id === '') {
        return false
      }
      queryAPKEquipmentGroupParams.equipment_group_id = this.theCurrentlySelectedGroup_id
      equipment_queryAPKEquipmentGroup_token(queryAPKEquipmentGroupParams).then(
        response => {
          if (response.errorCode === 0) {
            this.PushapplicationList = response.result
          } else {
            this.PushapplicationList = []
          }
        }
      )
    },

    // 查询分组下的所有设备查询
    queryEquipmentsForGroup() {
      if (this.DevicelistQuery.equipment_group_id === '') {
        this.getDevcieList()
      } else {
        equipmentGroup_queryEquipmentsForGroup_token(this.DevicelistQuery).then(
          response => {
            if (response.errorCode === 0) {
              this.DeviceList = response.result.list
              this.DeviceTotal = response.result.total_count
            } else {
              // this.$message.error(response.errorMessage)
              this.DeviceList = []
              this.DeviceTotal = 0
            }
          }
        )
      }
    },
    // 确认设置指令有效时间
    setCommandValidTimeButton() {
      var MQEquipmentValidTime =
        this.setCommandValidTime.hourlyBasis *
        this.setCommandValidTime.timeValue
      this.MQEquipment.validTime = MQEquipmentValidTime
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

    // 默认应用开关方法
    switchChange(rwo) {
      var configParmet = {}
      if (this.DeviceModelVisible !== true) {
        var equipment_group_ids = []
        equipment_group_ids.push(this.theCurrentlySelectedGroup_id)
        configParmet.equipment_group_id = equipment_group_ids
      } else {
        configParmet.equipmentCode = this.MQEquipment.equipmentCode
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
      equipment_manageEquipmentConfig_token(configParmet).then(response => {
        if (response.errorCode === 0) {
          this.$message.success(this.$t('message.Successed'))
        } else {
          this.$message.error(response.errorMessage)
        }
      })
    },
    // 默认应用类型下拉框事件
    selectRoleChange() {
      // ESC失去事件
      this.$nextTick(() => this.$refs.selectBehavior.blur())
      this.equipmentqueryConfigList()
    },
    // 查询默认应用
    equipmentqueryConfigList() {
      // 清空数组
      this.AppListQuery.equipment_group_ids = []
      // 如果当前分组是所有分组
      if (this.theCurrentlySelectedGroup_id === '') {
        return false
      }
      this.AppListQuery.equipment_group_ids.push(
        this.theCurrentlySelectedGroup_id
      )
      equipment_queryConfigList_token(this.AppListQuery).then(response => {
        if (response.errorCode === 0) {
          if (response.result !== null) {
            if (response.result.length !== 0) {
              this.deviceConfingactionList = response.result.equipment_item
            }
          }
        } else {
          this.deviceConfingactionList = []
        }
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
          equipment_restoreMQEquipment(this.MQEquipment).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.ResumeFactorySettingSuccess'))
            } else {
              this.$message.error(response.errorMessage)
            }
          })
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
          equipment_unRockMQEquipment_post(this.MQEquipment).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Unlocksuccessed'))
            } else {
              this.$message.error(response.errorMessage)
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    // 设备解绑
    deviceunbundling() {
      this.$confirm(
        this.$t('message.Areyousuretoreleaseselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          equipment_unBindMQEquipment_token(this.MQEquipment).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.unBindSuccess'))
            } else {
              this.$message.error(response.errorMessage)
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    // 设备锁定
    devicelock() {
      this.$confirm(
        this.$t('message.Areyousuretolockselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          equipment_rockMQEquipment_post(this.MQEquipment).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Lockscreensuccessed'))
            } else {
              this.$message.error(response.errorMessage)
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    // 设备重启
    devicerestart() {
      this.$confirm(
        this.$t('message.Areyousuretorebootselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          equipment_rebootMQEquipment_post(this.MQEquipment).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Rebootsuccessed'))
            } else {
              this.$message.error(response.errorMessage)
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    // 设备回收
    devicereset() {
      this.$confirm(
        this.$t('message.Areyousuretorecallselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          equipment_resetMQEquipment_post(this.MQEquipment).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Releasesuccessed'))
            } else {
              this.$message.error(response.errorMessage)
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    // 设备关机
    deviceShutdown() {
      this.$confirm(
        this.$t('message.Areyousuretopoweroffselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          equipment_closeMQEquipment_post(this.MQEquipment).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Poweroffsuccessed'))
            } else {
              this.$message.error(response.errorMessage)
            }
          })
        })
        .catch(() => {
          return false
        })
    },

    // 查询设备列表信息
    searchequipment() {
      this.DevicelistQuery.pageNo = 1
      this.getDevcieList()
    },
    getDevcieList() {
      // 如果分组id不为空
      if (this.DevicelistQuery.equipment_group_id !== '') {
        // 调用根据用户分组查询
        this.queryEquipmentsForGroup()
      } else {
        equipment_queryEquipment_pageNo_pageSize_equipmentID_get(
          this.DevicelistQuery
        ).then(response => {
          if (response.errorCode === 0) {
            this.DeviceList = response.result.list
            this.DeviceTotal = response.result.total_count
          } else {
            this.$message.error(response.errorMessage)
            this.DeviceList = []
          }
        })
      }
    },

    // 网络白名单重置按钮
    restNetwrok() {
      this.$refs['WhiteAddForm'].resetFields()
    },
    // 网络白名单重置按钮
    restApplication() {
      this.$refs['AppWhiteAddForm'].resetFields()
    },
    // 添白名单方法
    addNewtwok() {
      this.$refs.WhiteAddForm.validate(vaild => {
        if (vaild) {
          var addnetwrk = {}
          var equipment_group_id = new Array(0)
          var oneNetList = {}
          var NetListUrl = this.WhiteAddForm.NetListUrl
          var NetListName = this.WhiteAddForm.NetListName
          oneNetList[NetListName] = NetListUrl
          addnetwrk.NetList = oneNetList
          equipment_group_id.push(this.theCurrentlySelectedGroup_id)
          addnetwrk.equipment_group_id = equipment_group_id
          addnetwrk.parentTopic = this.WhiteAddForm.parentTopic
          equipment_setNetWriteMQList_token(addnetwrk).then(response => {
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
    // 添加应用白名单
    addApplication() {
      // console.log('添加应用白名单');
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
          this.WhiteAddForm.equipment_group_id = []
          this.WhiteAddForm.equipment_group_id.push(
            this.theCurrentlySelectedGroup_id
          )
          equipment_deleteNetWriteMQList_token(this.WhiteAddForm).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Deletesuccessed'))
                this.whiteQuery()
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
          this.WhiteAddForm.equipment_group_id = []
          this.WhiteAddForm.NetList.push(row.write_net_id)
          this.WhiteAddForm.equipment_group_id.push(
            this.theCurrentlySelectedGroup_id
          )
          equipment_deleteNetWriteMQList_token(this.WhiteAddForm).then(
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

    // 根据groupid查询出网络白名单
    whiteQuery() {
      // 如果当前分组是所有分组
      if (this.DevicelistQuery.equipment_group_id === '') {
        return false
      }
      equipment_queryWriteNetList_token(this.DevicelistQuery).then(response => {
        if (response.errorCode === 0) {
          if (response.result != null || response.result !== {}) {
            this.whiteList = response.result.write_nets
          }
        }
      })
    },

    // 查询设备分组
    equipment_queryEquipmentGroup_get() {
      equipmentGroup_queryEquipmentGroup_get().then(response => {
        // 所有分组
        var allOfTheGroup = {
          equipment_group_id: '',
          equipment_group_name: this.$t('equipmentMg.Allgroups'),
          parent_group_id: 0,
          sub_group: []
        }
        this.setTree.push(allOfTheGroup)
        if (response === null || response.result === null) {
          return false
        }
        // 再添加接口返回的分组
        for (var value of response.result) {
          this.setTree.push(value)
          this.multipleChoiceSetTree.push(value)
        }
      })
    },
    // 网络白名单
    networklists() {
      this.NetWrokdialogShowOrHide = true
    },
    // 添加网络白名单
    addnewtwrok() {
      if (this.theCurrentlySelectedGroup_id === '') {
        this.$message.error(this.$t('behaviorMg.Selectdevicegroup'))
        return false
      }
      this.NetWrokDialogShow = true
    },
    // 添加应用白名单
    addapplication() {
      if (this.theCurrentlySelectedGroup_id === '') {
        this.$message.error(this.$t('behaviorMg.Selectdevicegroup'))
        return false
      }
      this.ApplicationDialogShow = true
    },
    handleClick(tab, event) {
      this.crumbs = tab.label
    },
    initExpand() {
      this.setTree.map(a => {
        this.defaultExpandKeys.push(a.equipment_group_id)
      })
      // this.isLoadingTree = true
    },
    handleNodeClick(d, n, s) {
      if (d === null) {
        // 选中的设备分组的名称显示出来
        this.theCurrentlySelectedGroup = this.$t('behaviorMg.Null')
        // 选中的设备分组的id
        this.theCurrentlySelectedGroup_id = ''
        return false
      }
      // 重置设备列表分页参数
      this.DevicelistQuery = {
        pageNo: 1,
        pageSize: 7,
        equipmentCode: '',
        equipment_group_id: ''
      }
      // 重置默认应用分页参数
      this.applistQuery = {
        pageNo: 1,
        pageSize: 7,
        equipmentCode: ''
      }
      // 选中的设备分组的名称显示出来
      this.theCurrentlySelectedGroup = d.equipment_group_name
      // 选中的设备分组的id
      this.theCurrentlySelectedGroup_id = d.equipment_group_id

      d.isEdit = false // 放弃编辑状态

      this.DevicelistQuery.equipment_group_id = d.equipment_group_id
      this.queryEquipmentsForGroup()
      // 查询默认应用配置
      this.equipmentqueryConfigList()
      // 查询网络白名单
      this.whiteQuery()
      // 查询已经推送应用
      this.queryPushapplicationList()
      // 点击节点
    },
    // 设备列表多选数组
    handleSelectionChange(val) {
      this.multipleSelection = val
      var ids = this.multipleSelection.map(item => item.equipment_code).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      // console.log('dddd' + ids)
      // console.log('dddd' + strs)
      this.MQEquipment.equipmentCode = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.MQEquipment.equipmentCode.push(strs[i])
        }
      }
      // 如果同时选择单个和分组,单个优先
      if (
        this.MQEquipment.equipmentCode.length > 0 &&
        this.MQEquipment.equipment_group_id.length > 0
      ) {
        this.MQEquipment.equipment_group_id = []
      }
    },
    // 已推送应用多选数组
    menthandleSelectionChange(val) {
      this.appmultipleSelection = val
      // 先得到用户ID
      var ids = this.appmultipleSelection.map(item => item.file_id).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.equipmentList.file_id = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.equipmentList.file_id.push(strs[i])
        }
      }
    },
    // 白名单多选数组
    WhiteSelectionChange(val) {
      this.whitemultipleSelection = val
      // 先得到设备分组id
      var ids = this.whitemultipleSelection
        .map(item => item.write_net_id)
        .join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.WhiteAddForm.NetList = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.WhiteAddForm.NetList.push(strs[i])
        }
      }
    },

    // // 远程删除文件多选数组
    // FileseSelectionChange(val) {
    //   this.FilseSelection = val
    //   // 得到设备唯一标识符
    //   var ids = this.FilseSelection.map(item => item.equipment_code).join()
    //   var strs = ids.split(',')
    //   this.deleteFilseParam.equipmentCodes = ''
    //   for (var i = 0; i < strs.length; i++) {
    //     if (strs[i] !== '') {
    //       this.deleteFilseParam.equipmentCodes(strs[i])
    //     }
    //   }
    // },

    // 设备列表分页
    handleSizeChange(val) {
      this.DevicelistQuery.pageSize = val
      this.getDevcieList()
    },
    handleCurrentChange(val) {
      this.DevicelistQuery.pageNo = val
      this.getDevcieList()
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
    handleAddTop() {
      var equipment_group_parment = {
        equipment_group_name: this.$t('behaviorMg.Newnode'),
        parent_group_id: 0,
        sub_group: []
      }
      equipmentGroup_addEquipmentGroup_post(equipment_group_parment).then(
        response => {
          if (response.errorCode === 101) {
            this.$message.error(
              this.$t('behaviorMg.Addgroupfailedthegrouphasalreadyexist')
            )
            return false
          }
          this.setTree.push({
            equipment_group_id: response.result.equipment_group_id,
            equipment_group_name: this.$t('behaviorMg.Newnode'),
            parent_group_id: 0,
            sub_group: []
          })
        }
      )
    },

    handleAdd(s, d, n) {
      // 增加节点
      if (n.level >= 6) {
        this.$message.error(this.$t('behaviorMg.Onlysupport5levels'))
        return false
      }
      if (d.equipment_group_id === '') {
        d.equipment_group_id = 0
      }
      // 设备分组添加数据
      var equipment_group_parment = {
        equipment_group_name: this.$t('behaviorMg.Newnode'),
        parent_group_id: d.equipment_group_id,
        sub_group: []
      }
      // 添加设备分组
      equipmentGroup_addEquipmentGroup_post(equipment_group_parment).then(
        response => {
          if (response.errorCode === 0) {
            if (d.sub_group === undefined) {
              this.$set(d, 'sub_group', [])
            }
            var addEquipment_group = {
              equipment_group_id: response.result.equipment_group_id,
              equipment_group_name: this.$t('behaviorMg.Newnode'),
              parent_group_id: d.equipment_group_id,
              sub_group: []
            }
            // 要添加的设备分组参数
            if (d.equipment_group_id === 0) {
              this.setTree.push(addEquipment_group)
              return false
            }
            d.sub_group.push(addEquipment_group)
          } else {
            this.$message.error(response.errorMessage)
            return false
          }
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
      if (d.sub_group && d.sub_group.length !== 0) {
        this.$message.error(
          this.$t('message.Youarenotallowedtodeletethenonemptynode')
        )
        return false
      } else {
        // 询问是否删除
        const delNode = () => {
          equipmentGroup_deleteEquipmentGroupById_groupId_get(
            d.equipment_group_id
          ).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Deletesuccessed'))
              const list = n.parent.data.sub_group || this.setTree // 节点同级数据
              let _index = 0 // 要删除的index
              list.map((c, i) => {
                if (d.equipment_group_id === c.equipment_group_id) {
                  _index = i
                }
              })
              const k = list.splice(_index, 1)
              console.log(k)
            } else {
              this.$message.error(response.errorMessage)
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


