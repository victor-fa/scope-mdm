<template>
  <div class="Publiccloud-home">
        <the-breadcrumb>
       <el-breadcrumb-item>{{$t('Breadcrumb.Pushfiles')}}</el-breadcrumb-item>
    </the-breadcrumb>
    <el-tabs v-model="client_activeName" @tab-click="handleClick">
      <!--推送计划面板 -->
      <el-tab-pane :label="$t('Breadcrumb.PushSchedule')" name="first">
          <el-form :inline="true">
            <el-form-item>
              <el-input class="client-input"  style="width:210px;" :placeholder="$t('pushMg.SchedulenamePublisher')" v-model="PushListQuery.release_plan_name" @keyup.enter.native="pushPlanquery"></el-input>
            </el-form-item>
            <el-form-item prop="state ">
              <el-select ref="selectPush" @change='selectRoleChange' :placeholder="$t('pushMg.Status')" v-model="PushListQuery.state">
                <el-option v-for="item in StateOptons" :key="item.state" :label="item.role_name" :value="item.state">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="pushPlanquery">
                {{$t('table.Search')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="client-buttom" icon="el-icon-circle-plus-outline" type="primary" @click="addPush">{{$t('table.Add')}}</el-button>
            </el-form-item>
            <el-form-item>

              <el-button class="client-buttom" type="primary" icon="el-icon-upload" v-if="this.role_code.includes(4)" @click="TeacheFormVisible=true">{{$t('content.Uploadedcontent')}}</el-button>

            </el-form-item>
          </el-form>

        <!--推送计划列表-->
          <el-scrollbar class="commonScrollbar" style="height: 560px;">
        <el-table  :data="pushlist" highlight-current-row style="width: 100%;" @selection-change="pushHandleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="release_plan_name" :label="$t('pushMg.Schedulename')" width="156"         >
          </el-table-column>

          <el-table-column prop="user_name" :label="$t('pushMg.Publisher')" width="136"         >
          </el-table-column>

          <el-table-column class-name="status-col" :label="$t('table.Status')" width="150"         >
            <template slot-scope="scope">
              <el-tag :type="scope.row.state | statusFilter">{{scope.row.state|formatCheckStata}}</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="type" :label="$t('table.Type')" width="180" :formatter="formatObjectType"         >
          </el-table-column>
          <el-table-column prop="create_time" :label="$t('table.Pushtime')" width="180"         >
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.Operation')" width="320" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="primary" icon="el-icon-edit-outline" @click="handleEdit(scope.$index, scope.row)">{{$t('table.Edit')}}</el-button>
              <el-button size="small" type="danger" icon="el-icon-delete" @click="pushDelete(scope.row)">{{$t('table.Delete')}}</el-button>
              <el-button size="small" type="primary" icon="el-icon-more" @click="queryDeta(scope.$index,scope.row)">{{$t('table.Details')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
          </el-scrollbar>
        <!--工具条-->
        <div class="block">
          <el-pagination @size-change="PushhandleSizeChange" @current-change="PushhandleCurrentChange" :current-page="PushListQuery.page_no" :page-sizes="[9, 10, 20, 30]" :page-size="PushListQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="PushTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--编辑推送计划弹出框-->
    <el-dialog width="50%" height="400px !important;" :title="textMap[prviateDialogStstus]" :visible.sync="editPushForm" append-to-body>

      <el-form :inline="true" :model="PusheditForm" :rules="editFormRules" ref="PusheditForm" class="demo-form-inline">
        <el-form-item :label="$t('pushMg.Pleaseinputtheschedulename')" prop="release_plan_name">
          <el-input name="release_plan_name" v-model="PusheditForm.release_plan_name" class="client-input"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.Type')" prop="type " v-if="prviateDialogStstus=='create'">
          <el-select :placeholder="$t('pushMg.Type')" v-model="PusheditForm.type">
            <el-option v-for="item in PushOptions" :key="item.type" :label="item.role_name" :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editPushForm = false">{{$t('table.Cancel')}}</el-button>
        <el-button v-if="prviateDialogStstus=='create'" key="form-reset" type="primary" @click="resetPush">{{$t('form.reset')}}</el-button>
        <el-button v-if="prviateDialogStstus=='create'" key="table-confirm" type="primary" @click="addPlan">{{$t('table.OK')}}</el-button>
        <el-button v-else type="primary" @click="updatePush">{{$t('table.OK')}}</el-button>
      </span>
    </el-dialog>

    <!--新增发布计划-->
    <el-dialog width="50%" :title="$t('pushMg.Newschedule')" :visible.sync="addeditFormVisible" append-to-body :before-close="handleCloseAddReleasePlan" top="6vh">
      <el-form :inline="true" :model="addeditForm" :rules="AddeditFormRules" ref="addeditForm" class="demo-form-inline" label-width="190px">
        <el-form-item prop="release_plan_name" :label="$t('pushMg.Schedulename')">
          <el-input  name="release_plan_name" v-model="addeditForm.release_plan_name" class="client-input"></el-input>
        </el-form-item>
        <br>
        <el-form-item :label="$t('table.Type')" prop="type" v-if="this.role_code.includes(1) || this.role_code.includes(2) || this.role_code.includes(4)">
          <el-select :placeholder="$t('pushMg.Publishingtype')" v-model="addeditForm.type" @change="changePushType()">
            <el-option v-for="item in PushOptions" :key="item.type" :label="item.role_name" :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <h3 style="margin-left:36px;">
          {{$t('pushMg.Selectedobjects')}}{{ addeditForm.publish.length}} {{$t('pushMg.Individual')}}
        </h3>
        <br>
        <el-form-item :label="$t('pushMg.Pleaseinputthefilename')">
          <el-input class="client-input" v-model="contentlistQuery.file_name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select @change="selectPushQuery" v-if="addeditForm.type!=1 && addeditForm.type!=2" :placeholder="$t('pushMg.Filetype')" v-model="contentlistQuery.file_type">
            <el-option v-for="item in fielTypeOptions" :key="item.fielType_num" :label="item.fielType_name" :value="item.fielType_num">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="searchFile()">
            {{$t('table.Search')}}</el-button>
        </el-form-item>
         <el-scrollbar class="commonScrollbar" style="height:560px;">
        <el-table  :data="list" ref="listMultipleTable" highlight-current-row style="width:100%;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="file_name" :label="$t('pushMg.Filename')" width="280">
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
          <el-pagination @size-change="addFielhandleSizeChange" @current-change="addFielhandleCurrentChange" :current-page="contentlistQuery.page_no" :page-sizes="[9, 10, 20, 30]" :page-size="contentlistQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="Filetotal_count"> </el-pagination>

        </div>
        <br>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddPlan">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary" @click="addPlan">{{$t('table.Add')}}</el-button>
      </span>
      <!-- 选择发布对象dialog -->
      <el-dialog :title="$t('pushMg.Publishingobjects')" :visible.sync="publishDialogVisible" append-to-body :width="pushObjectDialogWidth" :before-close="handleClosePushObjectDialog" top="10vh">
        <el-tabs v-model="client_activeName" @tab-click="handleClick">
          <!-- 查询用户列表 -->
          <el-tab-pane :label="$t('pushMg.SearchuserIDlist')" name="six" v-if="this.addeditForm.type == 7">
              <el-form :inline="true">
                <el-form-item>
                  <el-input class="client-input" :placeholder="$t('pushMg.Name')" v-model="userListQuery.user_name"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="searchUserinfo">
                    {{$t('table.Search')}}</el-button>
                </el-form-item>
              </el-form>
            <!--用户表格数据-->
              <el-scrollbar class="commonScrollbar" style="height: 560px;">
            <el-table  :data="UserList" highlight-current-row style="width: 100%;" @selection-change="handleSelectionChangeUserList">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column v-for="(col,index) in tableCols " :key="index" :prop="col.prop" :label="col.label" width="120">
              </el-table-column>
            </el-table>
              </el-scrollbar>
            <!--工具条-->
            <div class="block">
              <el-pagination @size-change="userHandleSizeChange" @current-change="userHandleCurrentChange" :current-page="userListQuery.page_no" :page-sizes="[9, 10, 20, 30]" :page-size="userListQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="UserListTotal_count">

              </el-pagination>
            </div>
          </el-tab-pane>
          <!-- 查询设备id列表 -->
          <el-tab-pane :label="$t('pushMg.Searchdevicelist')" name="seven" v-if="this.addeditForm.type == 5">
              <el-form :inline="true">
                <el-form-item>
                  <el-input style="width:290px;" :placeholder="$t('equipmentMg.DeviceGuidAccountUserName')" class="client-input" v-model="DevicelistQeury.equipmentCode"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary"   icon="el-icon-search" class="client-buttom" @click="searcheQuipment">
                    {{$t('table.Search')}}</el-button>
                </el-form-item>
              </el-form>
               <!-- 查询设备id列表 -->
                <el-scrollbar class="commonScrollbar" style="height: 560px;">
            <el-table :data="Devicelist"  highlight-current-row style="width: 100%;" @selection-change="handleSelectionChangeDevice">
              <el-table-column type="selection" width="55">
              </el-table-column>
                 <el-table-column prop="equipment_code" :label="$t('equipmentMg.GUID')" width="210"  show-overflow-tooltip >
              </el-table-column>
              <el-table-column prop="login_account" :label="$t('equipmentMg.Bindedaccount')"  width="150"       >
              </el-table-column>
              <el-table-column  :label="$t('table.Date')" width="180"       >
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="user_name" :label="$t('equipmentMg.Bindeduser')" width="140"       >
              </el-table-column>
              <el-table-column prop="state" :label="$t('table.Status')"  min-width="130"       >
                <template slot-scope="scope">
                  <el-tag :type="scope.row.state | EquipmentState">{{scope.row.state| formatEquipmentState}}</el-tag>
                </template>
              </el-table-column>
              </el-table-column>
            </el-table>
            </el-scrollbar>
            <!--工具条-->
            <div class="block">
              <el-pagination @size-change="deviceHandleSizeChange" @current-change="deviceHandleCurrentChange" :current-page="DevicelistQeury.pageNo" :page-sizes="[9, 10, 20, 30]" :page-size="DevicelistQeury.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="DeviceTotal">
              </el-pagination>
            </div>
            <br>
          </el-tab-pane>
          <!-- 查询私有云id列表 -->
          <el-tab-pane :label="$t('pushMg.SearchprivatecloudIDlist')" name="eigth" v-if="this.addeditForm.type == 3">
              <el-form :inline="true">
                <el-form-item>
                  <el-input class="client-input" v-model="privateListQuery.private_cloud_name"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="privateCloudList">
                    {{$t('table.Search')}}</el-button>
                </el-form-item>
              </el-form>
            <!-- <p>查询私有云id列表</p> -->
            <el-scrollbar class="commonScrollbar" style="height: 560px;">
            <el-table  :data="prvitelist" highlight-current-row style="width: 100%;" @selection-change="handleSelectionChangePrivateCloud">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="private_cloud_name" :label="$t('pushMg.Privatecloudname')" width="160"         >
              </el-table-column>
              <el-table-column prop="state" :label="$t('pushMg.OnlineOffline')" width="160" :formatter="formatPrivateCloludState"         >
              </el-table-column>
              <el-table-column prop="create_time" :label="$t('table.Date')" width="170"         >
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
              </el-table-column>
            </el-table>
            </el-scrollbar>
            <!--工具条-->
            <div class="block">

              <el-pagination @size-change="PrivatehandleSizeChange" @current-change="PrivatehandleCurrentChange" :current-page="privateListQuery.page_no" :page-sizes="[9, 10, 20, 30]" :page-size="privateListQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="PrivateCloudTotal">
              
              </el-pagination>
              
            </div>
          </el-tab-pane>
          <!--用户,设备分组-->
          <el-tab-pane :label="$t('pushMg.Groups')" name="ten" v-if="this.addeditForm.type == 4 ||this.addeditForm.type == 6 ">
            <div class="SelectedGroup-title top-commonborder">
              <div class="common-title">{{$t('behaviorMg.Selecteddevicegroup')}}&nbsp;&nbsp;
                <span>{{ theCurrentlySelectedGroup }}</span>
              </div>
            </div>
            <div class="expand">
              <div>
                <!-- :render-content="renderContent" -->
                <el-tree accordion ref="expandMenuList" class="expand-tree" v-if="isLoadingTree" :data="setTree" node-key="id" highlight-current :props="defaultProps" :expand-on-click-node="false" :default-expanded-keys="defaultExpandKeys" @node-click="handleNodeClick"></el-tree>
              </div>
            </div>
          </el-tab-pane>
          <br>
          </el-tab-pane>
          <!--查询班级-->
          <el-tab-pane :label="$t('systemMg.Grade')" name="eleveh" v-if="this.addeditForm.type === 8">
            <el-scrollbar class="commonScrollbar" style="height: 560px;">
            <el-table  :data="gradesList" highlight-current-row style="width: 100%;" @selection-change="handleSelectionChangeGrades">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="user_group_id" :label="$t('pushMg.Class')" width="260"         >
              </el-table-column>
              <el-table-column prop="user_group_name" :label="$t('pushMg.Classname')" width="150"         >
              </el-table-column>
            </el-table>
            </el-scrollbar>
          </el-tab-pane>
          <!--查询学生-->
          <el-tab-pane :label="$t('pushMg.Studentname')" name="twelve" v-if="this.addeditForm.type === 9">
            <el-scrollbar class="commonScrollbar" style="height: 560px;">
            <el-table  :data="studeList" highlight-current-row style="width: 100%;" @selection-change="handleSelectionChangeStudet">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="user_name" :label="$t('pushMg.Studentnamex')" width="140"         >
              </el-table-column>
              <el-table-column prop="login_account" :label="$t('pushMg.Account')" width="140"         >
              </el-table-column>
            </el-table>
            </el-scrollbar>
            <div class="block">
              <el-pagination @size-change="studethandleSizeChange" @current-change="studethandleCurrentChange" :current-page="StudetListQuery.page_no" :page-sizes="[9, 10, 20, 30]" :page-size="StudetListQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="studentListTotal_count">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>

        <span slot="footer" class="dialog-footer">
          <el-button @click="publishDialogVisible = false;pushObjectDialogWidth = '56%'">{{$t('table.Cancel')}}</el-button>
          <el-button type="primary" @click="selectedPrivate_cloudButton" v-if="this.addeditForm.type == 3">{{$t('table.OK')}}</el-button>
          <el-button type="primary" @click="selectedDeviceButton" v-if="this.addeditForm.type == 5">{{$t('table.OK')}}</el-button>
          <el-button type="primary" @click="selectedDeviceGroupOrUserGroupButton" v-if="this.addeditForm.type == 4 ||this.addeditForm.type == 6 ">{{$t('table.OK')}}</el-button>
          <el-button type="primary" @click="selectedUserListiceButton" v-if="this.addeditForm.type == 7">{{$t('table.OK')}}</el-button>
          <el-button type="primary" @click="seletedTeacherListButton" v-if="this.addeditForm.type == 8 ">{{$t('table.OK')}}</el-button>
          <el-button type="primary" @click="seletedStduetListButton" v-if="this.addeditForm.type == 9">{{$t('table.OK')}}</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <!--推送计划详情-->
    <el-dialog width="50%" height="400px !important;" :title="$t('pushMg.Details')" :visible.sync="PushDialogShow" append-to-body>
      <el-form :inline="true" :model="PusheditForm" :rules="editFormRules" ref="PusheditForm" class="demo-form-inline" label-position="left" label-width="150px" style='width: 500px; margin-left:50px;'>
        <el-form-item :label="$t('pushMg.Schedulenames')">
          <el-input name="release_plan_name" v-model="PusheditForm.release_plan_name" class="client-input" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.Status')" prop="state">
          <el-input name="state" v-model="commonStatus" class="client-input" :readonly="true"></el-input>
        </el-form-item>

        <el-form-item :label="$t('table.Date')" prop="create_time">
          <el-date-picker style="width:200px;" v-model="PusheditForm.create_time" type="date" :placeholder="$t('table.Date')" :readonly="true">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('pushMg.Publishers')" prop="user_name">
          <el-input name="user_name" v-model="PusheditForm.user_name" class="client-input" :readonly="true"></el-input>
        </el-form-item>

         <el-form-item  :label="$t('table.Type')"   prop="formatPushType" >
          <el-input name="type" v-model="formatPushType" class="client-input" :readonly="true" ></el-input>
        </el-form-item>

      </el-form>
      <el-table :data="pushDetaillist" border height="200" highlight-current-row style="width: 500px" @selection-change="pushHandleSelectionChange">
        <el-table-column prop="file_name" :label="$t('pushMg.Filename')" width="300">
        </el-table-column>
        <el-table-column prop="create_time" :label="$t('table.Date')" width="198" >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="PushDialogShow = false">{{$t('table.OK')}}</el-button>
      </span>
    </el-dialog>
    <!--老师上传文件弹出框-->
    <el-dialog width="30%" height="400px !important;" :title="$t('pushMg.Uploadfile')" :visible.sync="TeacheFormVisible" append-to-body>
      <el-form>
        <el-form-item :label="$t('content.Pleaseselectfiletype')">
          <el-radio-group v-model="upLoadData.content_type_code">
            <el-radio :label=1>{{$t('content.File')}}</el-radio>
            <el-radio :label=2>{{$t('content.APP')}}</el-radio>
           
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-upload ref="upload" class="upload-demo" :limit="fileLimt"  :before-upload="beforeAvatarUpload" :data="upLoadData" drag :action="importFileUrl" :onSuccess="uploadSuccess" :on-exceed="limtExceed" :on-error="uploadError">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">{{$t('content.Dragfiletohereor')}}
          <em>{{$t('content.Upload')}}</em>
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeTeacheFileDialog">{{$t('table.Close')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  releasePlan_pagedQuery_page_no_page_size_token_get,
  releasePlan_update_release_plan_id_token,
  releasePlan_insert_token_post,
  releasePlan_delete_release_plan_id_token_get,
  releasePlan_queryInfo_release_plan_id_token
} from '@/api/releasePlan/releasePlan'

import {
  equipmentGroup_queryEquipmentGroup_get,
  equipment_queryEquipment_pageNo_pageSize_equipmentID_get
} from '@/api/equipment/equipment'
import { file_pagedQuery_page_no_page_size_token_get } from '@/api/file/file'
import {
  getUserinfo,
  userGroup_queryPrivatecloud_token_get
} from '@/api/user/user'
import { formatType, formatPrivateCloludState } from '@/utils/format'
import { valideFileNameAndSize } from '@/utils/validate'
import { uploadFileRespError } from '@/utils/response'
import { privateCloud_pagedQuery_page_no_page_size_token_get } from '@/api/privateCloud/privateCloud'
export default {
  name: 'PushManagement',
  data() {
    return {
      fileLimt: 1, // 最大允许上传数量
      fileList: [], // 文件上传list
      pushObjectDialogWidth: '56%', // 添加发布对象的弹框dialog宽度

      // 要查询的文件类型下拉框选项
      fielTypeOptions: [
        { fielType_num: 1, fielType_name: this.$t('pushMg.File') },
        { fielType_num: 2, fielType_name: this.$t('pushMg.APP') }

      ],

      // 根据状态查询推送详情
      StateOptons: [
        { state: 1, role_name: this.$t('pushMg.Publishing') },
        { state: 2, role_name: this.$t('pushMg.Authorizing') },
        { state: 3, role_name: this.$t('pushMg.Approved') },
        { state: 4, role_name: this.$t('pushMg.Notallowed') },
        { state: 5, role_name: this.$t('pushMg.Publishsuccessed') },
        { state: 6, role_name: this.$t('pushMg.Publishfailed') },
        { state: '', role_name: this.$t('pushMg.All') }
      ],

      publishDialogVisible: false, // 是否显示发布对象弹出框

      // 用户下拉框
      Useroptions: [
        { role_code: 3, role_name: this.$t('pushMg.Studentname') },
        { role_code: 4, role_name: this.$t('pushMg.Teachername') },
        { role_code: 5, role_name: this.$t('pushMg.Parentname') },
        { role_code: 9, role_name: this.$t('pushMg.Presidentname') }
      ],
      PushOptions: [], // 推送下拉框

      // 私有云下拉框
      privateCloudOption: [
        { type: 2, role_name: this.$t('pushMg.APPStore') },
        { type: 6, role_name: this.$t('pushMg.Usergroup') },
        { type: 7, role_name: this.$t('pushMg.User') }
      ],

      // 老师类型下拉框
      teacherOption: [
        { type: 8, role_name: this.$t('systemMg.Grade') },
        { type: 9, role_name: this.$t('pushMg.Studentname') }
      ],

      // 公有云下拉框
      publicCloudOption: [
        { type: 1, role_name: this.$t('pushMg.Subscriptionlist') },
        { type: 2, role_name: this.$t('pushMg.APPStore') },
        { type: 3, role_name: this.$t('pushMg.ContentStore') },
        { type: 4, role_name: this.$t('pushMg.Devicegroup') },
        { type: 5, role_name: this.$t('pushMg.Devicenamex') }
      ],

      prviateDialogStstus: '', // 私有云弹出框状态

      PushDialogShow: false, // 推送计划弹出框

      // 弹出框状态有编辑和新增
      textMap: {
        update: this.$t('pushMg.Edit'),
        create: this.$t('pushMg.Created')

      },

      // 老师上传文件
      upLoadData: {
        content_type_code: 1
      },

      importFileUrl: 'mdm/file/upload/',

      prvitelist: [], // 私有云表格数据

      Devicelist: [], // 设备列表数据

      gradesList: [], // 班级表格数据

      studeList: [], // 学生表格数据

      // 查询用户列表数据
      tableCols: [
        { prop: 'student_code', label: this.$t('userMg.StudentID') },
        { prop: 'user_name', label: this.$t('userMg.Name') }
      ],

      pushrelease_plan_id: [], // 批量删除数据

      editPushForm: false, // 弹出框属性修改

      addeditFormVisible: false, // 新增发布计划属性

      TeacheFormVisible: false, // 老师上传文件属性

      // form表单属性元素
      PusheditForm: {
        release_plan_id: '',
        release_plan_name: '',
        type: '',
        state: '',
        create_time: ''
      },

      file_idsHeavy: [], // 选中的文件id数组去重

      addeditForm: {
        release_plan_name: '',
        type: '', // 发布类型
        publish: [], // 发布对象
        file_type: '',
        file_ids: [],
        parent_topic: 'MQTT_QHMDM'
      },

      theCurrentlySelectedGroup: this.$t('userMg.Null'), // 当前选中用户分组

      // 判断是否为空
      editFormRules: {
        release_plan_name: [
          {
            required: true,
            message: this.$t('pushMg.Pleaseinputtheschedulename'),
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: this.$t('pushMg.Type'),
            trigger: 'blur'
          }
        ]
      },

      // 新增判断是否为空
      AddeditFormRules: {
        release_plan_name: [
          {
            required: true,
            message: this.$t('pushMg.Pleaseinputtheschedulename'),
            trigger: 'blur'
          }
        ]
      },

      client_activeName: 'first', // 默认显示当前面板

      release_plan_ids: [], // 推送计划id数组

      detailsIsdisableButto: true, // 推送详情是否禁用

      planIsdisableButton: true, // 推送计划是否禁用

      addPushmultipleSelection: [], // 添加推送机会多选数组

      addPushPrivateCloudmultipleSelection: [], // 添加计划里面的私有云列表多选数组对象

      addUserListMultipleSelection: [], // 添加计划里面的用户列表多选数组对象

      addPushDevicemultipleSelection: [], // 添加计划里面的设备列表多选数组对象

      GradesmultipleSelection: [], // 添加计划班级多选数组

      StudetmultipleSelection: [], // 添加计划学生多选数组

      pushmultipleSelection: [], // 推送计划多选数组

      pushlist: [], // 推送计划表格

      list: [], // 新增文件表格显示数据

      UserList: [], // 查询用户表格显示数据

      pushDetaillist: [], // 查询推送详情数据表格

      // 新增计划分页参数
      contentlistQuery: {
        page_no: 1,
        page_size: 9,
        file_name: '',
        file_type: 1,
        create_time: '',
        file_id: '',
        eq_state: 2
      },

      studentListTotal_count: null, // 学生信息分页

      PushTotal: null, // 推送计划分页

      Filetotal_count: null, // 文件分页

      DeviceTotal: null, // 设备分页

      UserListTotal_count: null, // 查询用户分页表格总数

      PrivateCloudTotal: null, // 查询私有云分页表格总数

      // 私有分页数据
      privateListQuery: {
        page_no: 1,
        page_size: 9,
        private_cloud_name: ''
      },

      // 推送计划分页参数
      PushListQuery: {
        page_no: 1,
        page_size: 9,
        release_plan_name: '',
        user_name: '',
        role_code: 3,
        state: ''
      },

      // 设备参数
      DevicelistQeury: {
        pageNo: 1,
        pageSize: 9,
        equipment_name: '',
        equipmentCode: '',
        theCurrentlySelectedGroup_id: '',
        state: '',
        equipment_configuration_item_name: ''
      },

      // 用户查询
      userListQuery: {
        page_no: 1,
        page_size: 9,
        user_name: '',
        role_code: 3
      },

      // 查询学生信息
      StudetListQuery: {
        page_no: 1,
        page_size: 9,
        user_name: '',
        role_code: 3
      },

      crumbs: this.$t('Breadcrumb.PushSchedule'), // 面包屑 当前所在位置

      theCurrentlySelectedGroup_id: '', // 当前选中的分组id

      // 下面的是 tree 配置
      isLoadingTree: false, // 是否加载节点树

      setTree: [], // 节点树数据

      // 设备树形菜单参数
      DeviceDefaultProps: {
        children: 'sub_group',
        label: 'equipment_group_name'
      },
      // 共有树形菜单
      defaultProps: {},

      // 用户树形菜单参数
      UserDefaultProps: {
        children: 'sub_user_group',
        label: 'user_group_name'
      },

      defaultExpandKeys: [] // 默认展开节点列表
    }
  },

  computed: {
    // 发布状态（1：未发布, 2：待审核, 3：审核通过, 4：审核失败, 5：发布成功, 6：发布失败）
    commonStatus() {
      if (this.PusheditForm.state === 1) {
        return '未发布'
      } else if (this.PusheditForm.state === 2) {
        return '待审核'
      } else if (this.PusheditForm.state === 3) {
        return '审核通过'
      } else if (this.PusheditForm.state === 4) {
        return '审核失败'
      } else if (this.PusheditForm.state === 5) {
        return '发布成功'
      } else if (this.PusheditForm.state === 6) {
        return '发布失败'
      }
    },
    // 格式化发布对象
    formatPushType() {
      return formatType(this.PusheditForm)
    }

  },
  created() {
    // 页面加载调用查询推送计划方法
    this.pushQuery()
    // 文件上传url+token
    const token = this.$store.getters.token
    this.importFileUrl += token

    this.role_code = this.$store.getters.roles
    if (this.role_code.includes(1)) {
      var fielType = { fielType_num: 3, fielType_name: this.$t('pushMg.Updatepackage') }
      this.fielTypeOptions.push(fielType)
      // 查询设备分组id集合
      this.equipment_queryEquipmentGroup_get()
      this.PushOptions = this.publicCloudOption
    } else if (this.role_code.includes(2)) {
      // 查询私有云用户分组
      this.userGroup_queryPrivatecloud_token_get()
      this.PushOptions = this.privateCloudOption
    } else if (this.role_code.includes(4)) {
      // 老师
      this.PushOptions = this.teacherOption
    }
  },
  watch: {
    // 推送详情是否禁用
    multipleSelection(curVal, oldVal) {
      if (curVal.length === 0) {
        this.detailsIsdisableButto = true
      } else if (curVal.length !== 0) {
        this.detailsIsdisableButto = false
      }
    },
    // 推送计划是否禁用
    pushmultipleSelection(curVal, oldVal) {
      if (curVal.length === 0) {
        this.planIsdisableButton = true
      } else if (curVal.length !== 0) {
        this.planIsdisableButton = false
      }
    }
  },

  mounted() {
    // 树形菜单初始化
    this.initExpand()
  },
  methods: {

    // 文件超出个数限制时的钩子
    limtExceed(files, fileList) {
      alert(this.$t('message.Youcanonlyuploadonefileonce'))
    },

    // 上传文件关闭事件方法
    closeTeacheFileDialog() {
      this.TeacheFormVisible = false
      this.getFileList()
    },

    // 推送下拉框选中查询方法
    selectPushQuery() {
      this.getFileList()
    },

    // 上传成功后的回调
    uploadSuccess(response, file, fileList) {
      if (response.errorCode === 10) {
        uploadFileRespError(response.errorMessage)
      } else {
        this.$message.success(this.$t('pushMg.Uploadsuccessed'))
        this.getFileList()
      }
      this.fileList = []
      // this.$refs.upload.clearFiles()
    },
    // 上传失败后的回调
    uploadError(errorMessage, file, fileList) {
      this.$message.error(errorMessage)
      this.fileList = []
    },
    // 上传前文件校验
    beforeAvatarUpload(file) {
      if (this.upLoadData.content_type_code === 0) {
        this.$message.error(
          this.$t('pushMg.Pleaseselectthefiletypefirst')
        )
        return false
      }
      if (this.upLoadData.content_type_code === 2) {
        return valideFileNameAndSize(file)
      }
    },
    // 推送对象弹框关闭前
    handleClosePushObjectDialog(done) {
      this.pushObjectDialogWidth = '56%'
      done()
    },
    // 查询学生信息
    queryStudet() {
      getUserinfo(this.StudetListQuery).then(response => {
        this.studeList = response.result.list
        this.studentListTotal_count = response.result.total_count
      })
    },
    // 添加私有云id数组给发布对象
    selectedPrivate_cloudButton() {
      var ids = this.addPushPrivateCloudmultipleSelection
        .map(item => item.private_cloud_id)
        .join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.addeditForm.publish = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.addeditForm.publish.push(strs[i])
        }
      }
      this.publishDialogVisible = false
    },
    // 添加用户id数组给发布对象
    selectedUserListiceButton() {
      var ids = this.addUserListMultipleSelection
        .map(item => item.user_id)
        .join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.addeditForm.publish = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.addeditForm.publish.push(strs[i])
        }
      }
      this.publishDialogVisible = false
    },
    // 添加设备数组给发布对象
    selectedDeviceButton() {
      var ids = this.addPushDevicemultipleSelection
        .map(item => item.equipment_code)
        .join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.addeditForm.publish = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.addeditForm.publish.push(strs[i])
        }
      }
      this.publishDialogVisible = false
    },
    // 添加班级ID给发布对象
    seletedTeacherListButton() {
      var ids = this.GradesmultipleSelection.map(
        item => item.user_group_id
      ).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.addeditForm.publish = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.addeditForm.publish.push(strs[i])
        }
      }
      this.publishDialogVisible = false
    },
    // 添加学生ID给发布对象
    seletedStduetListButton() {
      var ids = this.StudetmultipleSelection.map(
        item => item.user_group_id
      ).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.addeditForm.publish = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.addeditForm.publish.push(strs[i])
        }
      }
      this.publishDialogVisible = false
    },
    // 添加设备或者用户分组id给发布对象
    selectedDeviceGroupOrUserGroupButton() {
      this.addeditForm.publish = []
      this.addeditForm.publish.push(
        this.DevicelistQeury.theCurrentlySelectedGroup_id
      )
      this.publishDialogVisible = false
    },
    // 查询私有云用户分组
    userGroup_queryPrivatecloud_token_get() {
      userGroup_queryPrivatecloud_token_get().then(response => {
        this.setTree = response.result
      })
    },
    // 查询设备分组
    equipment_queryEquipmentGroup_get() {
      equipmentGroup_queryEquipmentGroup_get().then(response => {
        this.setTree = response.result
      })
    },
    // renderContent(h, { node, data, store }) {
    //   // 加载节点
    //   // 设置每个节点是否可编辑fslse为默认不可编辑
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
    handleNodeClick(d, n, s) {
      if (d.equipment_group_id === '' || d.equipment_group_id === undefined) {
        // 选中的用户分组的id
        this.theCurrentlySelectedGroup = d.user_group_name
        this.DevicelistQeury.theCurrentlySelectedGroup_id = d.user_group_id
      } else {
        this.theCurrentlySelectedGroup = d.equipment_group_name
        // 选中的设备分组的id
        this.DevicelistQeury.theCurrentlySelectedGroup_id = d.equipment_group_id
      }
    },

    initExpand() {
      this.setTree.map(a => {
        if (a.equipment_group_id === undefined) {
          this.defaultExpandKeys.push(a.user_group_id)
        } else {
          this.defaultExpandKeys.push(a.equipment_group_id)
        }
      })
      this.isLoadingTree = true
    },
    // 查询私有云数据
    privateCloudList() {
      this.privateQuery()
    },
    // 查询私有云方法
    privateQuery() {
      privateCloud_pagedQuery_page_no_page_size_token_get(
        this.privateListQuery
      ).then(response => {
        this.prvitelist = response.result.list
        this.PrivateCloudTotal = response.result.total_count
      })
    },
    // 关闭添加计划Dialog前执行的事件
    handleCloseAddReleasePlan(done) {
      this.client_activeName = 'first'
      done()
    },
    // 查询设备列表信息
    searcheQuipment() {
      this.getDeviceList()
    },
    getDeviceList() {
      equipment_queryEquipment_pageNo_pageSize_equipmentID_get(
        this.DevicelistQeury
      ).then(response => {
        this.Devicelist = response.result.list
        this.DeviceTotal = response.result.total_count
      })
    },
    // 查询用户信息
    searchUserinfo() {
      this.getUserList()
    },
    getUserList() {
      getUserinfo(this.userListQuery).then(response => {
        this.UserList = response.result.list
        this.UserListTotal_count = response.result.total_count
      })
    },
    // 下拉框状态选中查询
    selectRoleChange() {
      // esc事件
      this.$nextTick(() => this.$refs.selectPush.blur())
      this.pushQuery()
    },
    // 发布对象下拉框change事件
    changePushType() {
      if (this.addeditForm.type !== 1 && this.addeditForm.type !== 2) {
        // this.contentlistQuery.file_type = 1
        // 选择的发布类型为内容仓库
        this.publishDialogVisible = true
        if (this.addeditForm.type === 3) {
          this.privateQuery()
          this.client_activeName = 'eigth'
        }
        if (this.addeditForm.type === 4) {
          // 选择对象为设备组
          // 设置添加发布对象的弹框dialog宽度
          this.pushObjectDialogWidth = '36%'
          // 设备树形菜单分组显示
          this.defaultProps = this.DeviceDefaultProps
          this.addeditForm.file_type = this.contentlistQuery.file_type
          // 显示设备组信息面板
          this.client_activeName = 'ten'
        }
        if (this.addeditForm.type === 5) {
          // 选择发布对象为设备
          this.addeditForm.file_type = this.contentlistQuery.file_type
          // 调用设备查询方法
          this.getDeviceList()
          // 显示设备信息面板
          this.client_activeName = 'seven'
        }
        if (this.addeditForm.type === 6) {
          // 选择发布对象为用户组
          // 设置添加发布对象的弹框dialog宽度
          this.pushObjectDialogWidth = '36%'
          // 显示用户菜单分组
          this.defaultProps = this.UserDefaultProps
          this.addeditForm.file_type = this.contentlistQuery.file_type
          // 显示用户组信息面板
          this.client_activeName = 'ten'
        }
        if (this.addeditForm.type === 7) {
          // 选择发布类型为用户
          this.addeditForm.file_type = this.contentlistQuery.file_type
          // 调用查询用户方法
          this.getUserList()
          // 显示用户信息面板
          this.client_activeName = 'six'
        }
        if (this.addeditForm.type === 8) {
          // 选择发布类型为班级
          this.addeditForm.file_type = this.contentlistQuery.file_type
          // 调用查询班级方法
          this.gradesList = this.$store.getters.teachingClass
          // 显示班级信息面板
          this.client_activeName = 'eleveh'
        }
        if (this.addeditForm.type === 9) {
          // 选择发布类型为学生
          this.addeditForm.file_type = this.contentlistQuery.file_type
          // 调用查询学生方法
          this.queryStudet()
          // 显示学生信息面板
          this.client_activeName = 'twelve'
        }
        // 如果选中的是应用商店则文件列表全为应用
      } else if (this.addeditForm.type === 2) {
        this.contentlistQuery.file_type = 2
        // 调用查询文件
        this.getFileList()
      }
    },
    // 重置按钮
    resetPush() {
      this.$refs['addeditForm'].resetFields()
    },
    // 取消 新增计划
    cancelAddPlan() {
      this.addeditFormVisible = false
      this.client_activeName = 'first'
    },
    // 新增发布计划
    addPlan() {
      if (this.addeditForm.release_plan_name === '') {
        this.$message.error(this.$t('pushMg.Pleaseinputtheschedulename'))
        return false
      }
      if (this.contentlistQuery.file_type === 3) {
        if (this.addeditForm.publish.length > 1) {
          this.$message.error('升级包只能选择一个')
          return false
        }
      }
      if (this.addeditForm.type === '') {
        this.$message.error(this.$t('pushMg.Publishingtype'))
        return false
      }
      if (this.addeditForm.type === 8) {
        this.addeditForm.type = 6
      }
      if (this.addeditForm.type === 9) {
        this.addeditForm.type = 7
      }
      if (this.addeditForm.type !== 1 && this.addeditForm.type !== 2) {
        if (this.addeditForm.publish.length === 0) {
          this.$message.error(this.$t('pushMg.Publishingobjects'))
          return false
        }
      }
      if (this.addeditForm.file_ids.length === 0) {
        this.$message.error(this.$t('pushMg.Pushingfile'))
        return false
      }
      this.$refs.addeditForm.validate(vaild => {
        if (vaild) {
          this.addeditForm.file_type = this.contentlistQuery.file_type
          releasePlan_insert_token_post(this.addeditForm).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Addsuccessed'))
              // 添加成功查询推送数据
              this.pushQuery()
              // 添加成功后取消掉勾选的表格
              if (this.list) {
                this.list.forEach(row => {
                  this.$refs.listMultipleTable.toggleRowSelection(row, false)
                })
              }
              this.publishDialogVisible = false
              // 重置表单
              this.resetPush()
              return false
            } else {
              this.$message.error(response.errorMessage)
              return false
            }
          })
        }
      })
    },
    // 私有云状态
    formatPrivateCloludState(row, column) {
      return formatPrivateCloludState(row, column)
    },
    // 显示新增界面
    AddPushdit() {
      this.prviateDialogStstus = 'create'
      this.editPushForm = true
    },
    // 查询文件列表
    searchFile() {
      // 分页模糊查询默认第一页
      this.contentlistQuery.page_no = 1
      this.getFileList()
    },
    // 查询文件搜索
    getFileList() {
      file_pagedQuery_page_no_page_size_token_get(this.contentlistQuery).then(
        response => {
          this.list = response.result.list
          this.Filetotal_count = response.result.total_count
        }
      )
    },
    // 新增发布计划显示界面
    addPush() {
      this.addeditFormVisible = true
      // 点击新增查询文件
      this.getFileList()
    },
    // 修改推送计划
    updatePush() {
      this.$refs.PusheditForm.validate(valid => {
        if (valid) {
          this.$confirm(
            this.$t('message.Areyousuretoeditit'),
            this.$t('message.Notification'),
            {
              type: 'warning'
            }
          )
            .then(() => {
              console.log('修改计划' + this.PusheditForm.release_plan_name)
              releasePlan_update_release_plan_id_token(this.PusheditForm).then(
                response => {
                  if (response.errorCode === 0) {
                    this.$message.success(
                      this.$t('message.Editsuccessed')
                    )
                  }
                  this.editPushForm = false
                }
              )
              this.pushQuery()
            })
            .catch(() => {})
        }
      })
    },
    // 显示编辑界面传值
    handleEdit(index, row) {
      this.prviateDialogStstus = 'update'
      this.editPushForm = true
      this.PusheditForm = Object.assign({}, row)
    },
    // 查看详情
    queryDeta(index, row) {
      this.PushDialogShow = true
      this.detailPush(index, row)
      this.PusheditForm = Object.assign({}, row)
    },
    // 查询推送计划方法
    pushPlanquery() {
      // 分页模糊查询默认第一页
      this.PushListQuery.page_no = 1
      this.pushQuery()
    },
    // 查询推送计划数据
    pushQuery() {
      releasePlan_pagedQuery_page_no_page_size_token_get(
        this.PushListQuery
      ).then(response => {
        this.pushlist = response.result.list
        this.PushTotal = response.result.total_count
      })
    },
    // 查询推送文件详情数据
    detailPush(index, row) {
      releasePlan_queryInfo_release_plan_id_token(row.release_plan_id).then(
        response => {
          this.pushDetaillist = response.result.file_list
        }
      )
    },
    // 推送计划删除单行数据
    pushDelete(row) {
      this.$confirm(
        this.$t('message.Areyousuretodelete'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.release_plan_ids.push(row.release_plan_id)
          releasePlan_delete_release_plan_id_token_get(this.release_plan_ids)
            .then(response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Deletesuccessed'))
              }
              // 调用查询推送计划方法
              this.pushQuery()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    // 推送计划批量删除
    pushDeletes() {
      if (this.pushmultipleSelection.length === 0) {
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
          var ids = this.pushmultipleSelection
            .map(item => item.release_plan_id)
            .join() // 获取所有选中行的id组成的字符串，以逗号分隔
          this.pushrelease_plan_id = ids
        })
        .catch(() => {})
    },

    // 格式化发布对象
    formatObjectType(row) {
      return formatType(row)
    },
    // 私有查询列表
    PrivatehandleSizeChange(val) {
      this.privateListQuery.page_size = val
      this.privateQuery()
    },
    PrivatehandleCurrentChange(val) {
      this.privateListQuery.page_no = val
      this.privateQuery()
    },
    // 学生信息分页
    studethandleSizeChange(val) {
      this.StudetListQuery.page_size = val
      this.queryStudet()
    },
    studethandleCurrentChange(val) {
      this.StudetListQuery.page_no = val
      this.queryStudet()
    },
    // 推送计划
    PushhandleSizeChange(val) {
      this.PushListQuery.page_size = val
      this.pushQuery()
    },
    PushhandleCurrentChange(val) {
      this.PushListQuery.page_no = val
      this.pushQuery()
    },

    // 用户查询
    userHandleSizeChange(val) {
      this.userListQuery.page_size = val
      this.getUserList()
    },
    userHandleCurrentChange(val) {
      this.userListQuery.page_no = val
      this.getUserList()
    },

    // 新增计划
    addFielhandleSizeChange(val) {
      this.contentlistQuery.page_size = val
      this.getFileList()
    },
    addFielhandleCurrentChange(val) {
      this.contentlistQuery.page_no = val
      this.getFileList()
    },
    // 设备管理列表
    deviceHandleSizeChange(val) {
      this.DevicelistQeury.pageSize = val
      this.getDeviceList()
    },
    deviceHandleCurrentChange(val) {
      this.DevicelistQeury.pageNo = val
      this.getDeviceList()
    },
    handleClick(tab, event) {
      this.crumbs = tab.label
    },
    handleSelectionChange(val) {
      this.addPushmultipleSelection = val
      var ids = this.addPushmultipleSelection.map(item => item.file_id).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.file_idsHeavy = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.file_idsHeavy.push(strs[i])
        }
      }
      this.addeditForm.file_ids = Array.from(new Set(this.file_idsHeavy))
    },
    // 私有云表格全选
    handleSelectionChangePrivateCloud(val) {
      this.addPushPrivateCloudmultipleSelection = val
    },
    // 用户表格全选
    handleSelectionChangeUserList(val) {
      this.addUserListMultipleSelection = val
    },
    // 设备表格全选
    handleSelectionChangeDevice(val) {
      this.addPushDevicemultipleSelection = val
    },
    // 班级表格全选
    handleSelectionChangeGrades(val) {
      this.GradesmultipleSelection = val
    },
    // 学生表格全选
    handleSelectionChangeStudet(val) {
      this.StudetmultipleSelection = val
    },
    // 推送计划
    pushHandleSelectionChange(val) {
      this.pushmultipleSelection = val
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'static/css/userAndDeviceCommon.scss';
</style>