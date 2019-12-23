<template>
  <div class="Publiccloud-home">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <span class="postion-befor-long">|</span>
        <span class="client-postion">{{$t('Breadcrumb.Fuction')}}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('Breadcrumb.DeviceManagement')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ crumbs }}</el-breadcrumb-item>
    </el-breadcrumb> -->
  <the-breadcrumb>
       <el-breadcrumb-item>{{$t('Breadcrumb.DeviceManagement')}}</el-breadcrumb-item>
    </the-breadcrumb>

    <el-container>
      <el-aside v-if="this.role_code.includes(1)">
        <div class="Group-title top-commonborder">

          <div class="common-title">{{$t('equipmentMg.Devicegroup')}}</div>
          <el-scrollbar class="commonScrollbar" style="height: 620px;">

            <div class="expand">
              <div>
                <el-tree accordion ref="expandMenuList" class="expand-tree" v-if="isLoadingTree" :data="setTree" node-key="equipment_group_id" highlight-current :props="defaultProps" :expand-on-click-node="false" :render-content="renderContent" :default-expanded-keys="defaultExpandKeys" @node-click="handleNodeClick"></el-tree>
              </div>
            </div>
            
          </el-scrollbar>

        </div>
      </el-aside>
      <el-main>
        <div class="SelectedGroup-title top-commonborder" v-if="this.role_code.includes(1)">
          <div class="common-title">{{$t('equipmentMg.Selectedgroupofdevice')}} &nbsp;&nbsp;
            <span>{{ theCurrentlySelectedGroup }}</span>
          </div>
        </div>

        <el-tabs v-model="client_activeName" @tab-click="handleClick" style="height:600px;">
          <el-tab-pane :label="$t('Breadcrumb.DeviceLists')" name="first">
            <el-form :inline="true">

              <el-form-item>
                <el-input class="client-input"   style="width:290px;" :placeholder="$t('equipmentMg.DeviceGuidAccountUserName')" v-model="DevicelistQuery.equipmentCode" @keyup.enter.native="searchEquipment"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="searchEquipment">
                  {{$t('table.Search')}}</el-button>
              </el-form-item>

              <el-form-item>
                <el-button class="client-buttom" type="primary" icon="el-icon-setting" :disabled="isdisableButton" @click="DeviceGroupDialogShow = true">{{$t('equipmentMg.Setupgroup')}}</el-button>
              </el-form-item>

            </el-form>
            <el-scrollbar class="commonScrollbar" style="height: 450px;">
            <!--列表-->
            <el-table :data="Devicelist" highlight-current-row style="" @selection-change="handleSelectionChange">

              <el-table-column type="selection" width="55">
              </el-table-column>

              <el-table-column prop="equipment_code" :label="$t('equipmentMg.GUID')" width="210" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="login_account" :label="$t('equipmentMg.Bindedaccount')" width="130">

              </el-table-column>

              <el-table-column prop="online"  :label="$t('equipmentMg.Isitonline')" width="130" align="center">
                <template slot-scope="scope">
                    {{scope.row.online | formatBindDeviceonlie}}
                  </template>
              </el-table-column>
              <!-- <el-table-column :label="$t('table.Date')" width="180">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
              </el-table-column> -->

              <el-table-column prop="user_name" :label="$t('equipmentMg.Bindeduser')" width="130" align="center">
                 <template slot-scope="scope">
                    {{scope.row.user_name | formatBindDeviceUser}}
                  </template>
              </el-table-column>
              <el-table-column prop="state" :label="$t('table.Status')" min-width="130">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.state | EquipmentState">{{scope.row.state| formatEquipmentState}}</el-tag>
                </template>
              </el-table-column>

              <el-table-column :label="$t('table.Operation')" width="130" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" icon="el-icon-more" @click="deviceDetails(scope.$index,scope.row)">{{$t('table.Details')}}</el-button>
                </template>
              </el-table-column>
              
            </el-table>
             </el-scrollbar>

            <!--工具条-->
            <div class="block">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="DevicelistQuery.pageNo" :page-sizes="[7, 10, 20, 30]" :page-size="DevicelistQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="DeviceTotal">

              </el-pagination>
            </div>

          </el-tab-pane>
          
          <el-tab-pane :label="$t('Breadcrumb.Models')" name="second">
            <el-form :inline="true" ref="formInline" class="demo-form-inline" @submit.native.prevent>
              <el-form-item>
                <el-input autofocus="autofocus" :placeholder="$t('equipmentMg.Model')" v-model="formInline.equipment_model_name" @keyup.enter.native="modelQuery"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="modelQuery">
                  {{$t('table.Search')}}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button class="client-buttom" type="primary" icon="el-icon-circle-plus-outline" @click="addModle">{{$t('table.Add')}}</el-button>
              </el-form-item>
            </el-form>
            
             <el-scrollbar class="commonScrollbar" style="height:450px;">
            <!-- <p>型号列表:</p> -->
            <el-table :data="Modellist" highlight-current-row style="width:100%;" @selection-change="modelhandleSelectionChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column v-for="(col,index) in tableModel " :key="index" :prop="col.prop" :label="col.label" width="120">
              </el-table-column>
              <el-table-column prop="equipment_model_name" :label="$t('equipmentMg.Model')" width="100">
              </el-table-column>
              <el-table-column :label="$t('table.Operation')" width="300" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="modelEdit(scope.$index,scope.row)">{{$t('table.Edit')}}</el-button>
                  <el-button type="danger" size="small" icon="el-icon-delete" @click="modelDelete(scope.row)">{{$t('table.Delete')}}</el-button>
                  <el-button size="small" type="primary" icon="el-icon-more" @click="viewThemodel (scope.$index,scope.row)">{{$t('table.Details')}}</el-button>
                </template>

              </el-table-column>
            </el-table>
          </el-scrollbar>
           
          </el-tab-pane>
          
        </el-tabs>
      </el-main>
    </el-container>

    <!--设备详情-->
    <el-dialog width="50%" height="400px !important;" :title="$t('equipmentMg.Details')" :visible.sync="DeviceDialogShow" append-to-body>
      <el-form :inline="true" :model="DeviceeditForm" :rules="editFormRules" ref="DeviceeditForm" class="demo-form-inline" label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
        <el-form-item width="200" :label="$t('equipmentMg.DeviceGUID')" prop="equipment_code">
          <el-input name="equipment_code" v-model="DeviceeditForm.equipment_code" class="client-input" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item width="200" :label="$t('equipmentMg.UserID')" prop="user_id">
          <el-input name="user_id" v-model="DeviceeditForm.user_id" class="client-input" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item width="200" :label="$t('equipmentMg.DeviceID')" prop="equipment_id">
          <el-input name="equipment_id" v-model="DeviceeditForm.equipment_id" class="client-input" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item width="200" :label="$t('equipmentMg.Devicename')" prop="equipment_name">
          <el-input name="equipment_name" v-model="DeviceeditForm.equipment_name" class="client-input" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item width="200" :label="$t('equipmentMg.Devicetype')" prop="model">
          <el-input name="model" v-model="DeviceeditForm.model" class="client-input" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.Date')" prop="create_time">
          <el-date-picker v-model="DeviceeditForm.create_time" type="date" style="width:92%;" :placeholder="$t('table.Date')" :readonly="true">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="DeviceDialogShow = false">{{$t('table.OK')}}</el-button>
      </span>
    </el-dialog>
    <!--设备分组弹出框-->
    <el-dialog width="30%" height="50%" :title="$t('equipmentMg.Modelgroup')" :visible.sync="DeviceGroupDialogShow" top="8vh" append-to-body>
      <div class="Group-title top-commonborder">
        <div class="common-title">{{$t('equipmentMg.Selectedthereceiveddevicegroup')}}: &nbsp;&nbsp;
          <span>{{ rmeovtheCurrentlySelectedGroup }}</span>
        </div>
      </div>
      <div class="expand">
        <div>
          <el-tree accordion ref="setExpandMenuList" class="expand-tree" v-if="isLoadingTree" :data="SelectedSetTree" node-key="id" highlight-current :props="defaultProps" :expand-on-click-node="false" :default-expanded-keys="defaultExpandKeys" @node-click="DevicehandleNodeClick"></el-tree>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DeviceGroupDialogShow = false">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary" @click="setDeviceGroping">{{$t('table.OK')}}</el-button>
      </span>
    </el-dialog>

    <!--查看编辑型号弹出框-->
    <el-dialog width="39%" height="400px !important;" :title="textMap[deviceDialogStstus]" :visible.sync="DeviceModelDialogShow" append-to-body>
      <el-form :inline="true" :model="DeviceModeleditForm" ref="DeviceModeleditForm" class="demo-form-inline" label-position="left" label-width="120px" style='width: 400px; margin-left:50px;' @submit.native.prevent>
        <el-form-item :label="$t('equipmentMg.ModelID')" prop="equipment_model_id" v-if="this.deviceDialogStstus=='detail'">
          <el-input name="equipment_model_id" v-model="DeviceModeleditForm.equipment_model_id" class="client-input" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('equipmentMg.Devicename')" prop="equipment_model_name">
          <el-input name="equipment_model_name" v-model="DeviceModeleditForm.equipment_model_name" class="client-input" :readonly="DeviceReadonly"></el-input>
        </el-form-item>
        <el-form-item :label="$t('equipmentMg.Devicetype')" prop="equipment_model_code" v-if="this.deviceDialogStstus=='detail'">
          <el-input name="equipment_model_code" v-model="DeviceModeleditForm.equipment_model_code" class="client-input" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.Date')" prop="create_time" v-if="this.deviceDialogStstus=='detail'">
          <el-date-picker v-model="DeviceModeleditForm.create_time" type="date" :placeholder="$t('table.Date')" :readonly="true">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('equipmentMg.Comments')" prop="remark" v-if="this.deviceDialogStstus=='detail'">
          <el-input name="remark" v-model="DeviceModeleditForm.remark" class="client-input" :readonly="true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="this.deviceDialogStstus=='detail'" type="primary" @click="DeviceModelDialogShow = false">{{$t('table.OK')}}</el-button>
        <el-button v-if="this.deviceDialogStstus=='update'" type="primary" @click="DeviceModelDialogShow = false">{{$t('table.Cancel')}}</el-button>
        <el-button v-if="this.deviceDialogStstus=='update'" type="primary" @click="updateModel()">{{$t('table.OK')}}</el-button>
      </span>
    </el-dialog>

    <!--新增型号弹出框-->
    <el-dialog width="50%" height="400px !important;" :title="$t('equipmentMg.NewModel')" :visible.sync="addDeviceModelFormVisible" top="8vh" append-to-body>
      <el-form :inline="true" :model="formInlines" :rules="rules" ref="formInlines" class="demo-form-inline" label-position="left" label-width="110px" style='width: 400px; margin-left:50px;'>
        <el-form-item prop="equipment_model_name" :label="$t('equipmentMg.Devicetype')">
          <el-input autofocus="autofocus" v-model="formInlines.equipment_model_name" style="width:200px;" maxlength="10"></el-input><br>
           <!-- <font  color="#C0C0C0">限输入12个汉字包括标点</font> -->
        </el-form-item>
        <h4 style="text-align: left;">{{$t('equipmentMg.More')}}</h4>
        <el-form-item prop="frequency" :label="$t('equipmentMg.CPU')">
          <el-input v-model="formInlines.frequency" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="ram" :label="$t('equipmentMg.Memory')">
          <el-input v-model="formInlines.ram" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="operate_system" :label="$t('equipmentMg.OS')">
          <el-input v-model="formInlines.operate_system" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="battery_capacity" :label="$t('equipmentMg.Battery')">
          <el-input v-model="formInlines.battery_capacity" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="resolution" :label="$t('equipmentMg.Dimension')">
          <el-input v-model="formInlines.resolution" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item :label="$t('equipmentMg.WIFI')">

          <el-radio-group v-model="formInlines.wifi">
            <el-radio label="1">{{$t('equipmentMg.YES')}}</el-radio>
            <el-radio label="0">{{$t('equipmentMg.NO')}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('equipmentMg.RearCamera')">

          <el-radio-group v-model="formInlines.rear_camera">
            <el-radio label="1">{{$t('equipmentMg.YES')}}</el-radio>
            <el-radio label="0">{{$t('equipmentMg.NO')}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('equipmentMg.FrontCamera')">

          <el-radio-group v-model="formInlines.front_camera">
            <el-radio label="1">{{$t('equipmentMg.YES')}}</el-radio>
            <el-radio label="0">{{$t('equipmentMg.NO')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('equipmentMg.Bluetooth')">

          <el-radio-group v-model="formInlines.blue_tooth">
            <el-radio label="1">{{$t('equipmentMg.YES')}}</el-radio>
            <el-radio label="0">{{$t('equipmentMg.NO')}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('equipmentMg.USB')">

          <el-radio-group v-model="formInlines.usb">
            <el-radio label="1">{{$t('equipmentMg.YES')}}</el-radio>
            <el-radio label="0">{{$t('equipmentMg.NO')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDeviceModelFormVisible = false">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary" class="client-buttom" @click="reset"> {{$t('form.reset')}} </el-button>
        <el-button type="primary" class="client-buttom" @click="addDevice">{{$t('table.Add')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import treeRender from '@/components/common/treerender'
import {
  equipment_queryEquipment_pageNo_pageSize_equipmentID_get,
  equipmentGroup_queryEquipmentGroup_get,
  equipmentGroup_addEquipmentGroup_post,
  equipmentGroup_deleteEquipmentGroupById_groupId_get,
  equipmentGroup_migratoryEquipment_post, // 设备分组
  equipmentModel_queryEquipmentModel_token_get,
  equipmentModel_updateEquipmentModel_token_post,
  equipmentGroup_queryEquipmentsForGroup_token,
  equipmentModel_deleteEquipmentModel_equipment_model_id_token,
  equipmentModel_enrollmentEquipmentModel_post
} from '@/api/equipment/equipment'
export default {
  name: 'DeviceManagement',
  data() {
    return {
      DeviceReadonly: false, // 输入框是否可输入

      // 新增型号非空验证
      rules: {
        equipment_model_name: [
          {
            required: true,
            message: this.$t('equipmentMg.PleaseinputtheModelname'),
            trigger: 'blur'
          }
        ],
        frequency: [
          {
            required: true,
            message: this.$t('equipmentMg.PleaseinputtheCPUname'),
            trigger: 'blur'
          }
        ],
        ram: [
          {
            required: true,
            message: this.$t('equipmentMg.Pleaseinputthememorysize'),
            trigger: 'blur'
          }
        ],
        operate_system: [
          {
            required: true,
            message: this.$t('equipmentMg.PleaseinputtheOS'),
            trigger: 'blur'
          }
        ],
        battery_capacity: [
          {
            required: true,
            message: this.$t('equipmentMg.Pleaseinputthebatterysize'),
            trigger: 'blur'
          }
        ],
        resolution: [
          {
            required: true,
            message: this.$t('equipmentMg.Pleaseinputthedimension'),
            trigger: 'blur'
          }
        ]
      },

      // 新增型号from
      formInlines: {
        ram: '', // 内存
        frequency: '', // 主屏
        equipment_model_name: '', // 设备型号name
        battery_capacity: '', // 电池容量
        front_camera: '0', // 前置摄像头
        rear_camera: '0', // 后置摄像头
        blue_tooth: '0', // 蓝牙
        resolution: '', // 分辨率
        wifi: '0', // wifi
        usb: '0', // 设备接口
        operate_system: '' // 系統
      },

      DeviceGroupDialogShow: false, // 设置设备分组弹出框

      DeviceModelDialogShow: false, // 查看设备型号

      DeviceModeleditForm: {}, // 查看编辑型号from

      DeviceDialogShow: false, // 查看设备详情弹出框属性

      // 设备详情form表单元素
      DeviceeditForm: {
        equipment_name: '',
        model: '',
        create_time: '',
        equipment_id: '',
        user_id: ''
      },

      deviceDialogStstus: '', // 编辑新增公用属性
      textMap: {
        update: this.$t('table.Edit'),
        detail: this.$t('table.Details')
      },

      theCurrentlySelectedGroup: this.$t('equipmentMg.Allgroups'), // 当前选中的分组

      theCurrentlySelectedGroup_id: '', // 当前选中的分组id

      DevicetheCurrentlySelectedGroup_id: '', // 当前选中ID设备分组弹出框

      rmeovtheCurrentlySelectedGroup: this.$t('userMg.Null'), // 设备分组弹出框选中分组

      addDeviceModelFormVisible: false, // 新增型号弹出框

      // 设备表单验证属性
      editFormRules: {},

      Modellist: [], // 型号表格数据

      equipmentIds: [], // 批量操作设备数组

      role_code: [], // 判断权限id

      isdisableButton: true, // 设备列表按钮是否禁用

      // 型号查询条件
      formInline: {
        equipment_model_name: '' // 设备型号name
      },

      client_activeName: 'first', // 调设备分组多选数组

      deviceMultipleSelection: [],

      Devicelist: [], // 设备列表数据表格

      multipleSelection: [], // 设备列表多选数组

      ModelmentmultipleSelection: [], // 型号列表多选数组

      updatementmultipleSelection: [], // 设备分组

      DeviceTotal: null, // 设备配置分页

      // 设备列表分页参数
      DevicelistQuery: {
        pageNo: 1,
        pageSize: 7,
        equipmentCode: '',
        equipment_group_id: ''
      },

      crumbs: this.$t('Breadcrumb.DeviceLists'), // 面包屑 当前所在位置

      tableModel: [], // 型号列表属性

      // 下面的是 tree 配置
      isLoadingTree: false, // 是否加载节点树

      SelectedSetTree: [], // 要迁移的树节点数据

      setTree: [], // 节点树数据

      // 树形菜单参数
      defaultProps: {
        children: 'sub_group',
        label: 'equipment_group_name'
      },
      defaultExpandKeys: [] // 默认展开节点列表
    }
  },
  created() {
    // 查询设备分组
    this.equipment_queryEquipmentGroup_get()

    // var client_activeName = this.$route.query.client_activeName

    // if (client_activeName === undefined) {
    //   this.client_activeName = 'first'
    // } else {
    //   this.client_activeName = client_activeName
    // }

    // 查询设备列表信息
    this.getDeviceList()

    // 查询型号信息
    this.getModellist()

    // 得到当前用户权限code
    this.role_code = this.$store.getters.roles
  },
  watch: {
    // 设备列表按钮是否禁用
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
  },
  methods: {
    // 限制输入框长度

    // 新增型号重置表单文本信息
    reset() {
      this.$refs['formInlines'].resetFields()
    },

    // 添加型号显示
    addModle() {
      this.addDeviceModelFormVisible = true
    },

    // 添加设备型号
    addDevice() {
      this.$refs.formInlines.validate(valid => {
        if (valid) {
          var deviceInfo = {}
          deviceInfo.ram = this.formInline.ram // 内存
          deviceInfo.frequency = this.formInlines.frequency // 主屏
          deviceInfo.equipment_model_name = this.formInlines.equipment_model_name // 设备型号name
          deviceInfo.battery_capacity = this.formInlines.battery_capacity // 电池容量
          deviceInfo.front_camera = this.formInlines.front_camera // 前置摄像头
          deviceInfo.rear_camera = this.formInlines.rear_camera // 后置摄像头
          deviceInfo.blue_tooth = this.formInlines.blue_tooth // 蓝牙
          deviceInfo.resolution = this.formInlines.resolution // 分辨率
          deviceInfo.wifi = this.formInlines.wifi // 型号wifi
          deviceInfo.operate_system = this.formInlines.operate_system // 系統
          deviceInfo.usb = this.formInlines.usb // 型号的usb
          equipmentModel_enrollmentEquipmentModel_post(deviceInfo).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Addsuccessed'))
                // 调用查询型号方法
                this.getModellist()
                // 调用查询型号分组
                this.equipment_queryEquipmentGroup_get()
                // 重置
                this.reset()
                return false
              } else {
                this.$message.error(response.errorMessage)
              }
            }
          )
        }
      })
    },
    // 查看型号详情
    viewThemodel(index, row) {
      this.DeviceModelDialogShow = true
      this.DeviceReadonly = true
      this.deviceDialogStstus = 'detail'

      this.DeviceModeleditForm = Object.assign({}, row)
    },
    // 编辑按钮弹出框
    modelEdit(index, row) {
      this.deviceDialogStstus = 'update'

      this.DeviceModelDialogShow = true
      this.DeviceReadonly = false
      this.DeviceModeleditForm = Object.assign({}, row)
    },
    // 查看设备详情
    deviceDetails(index, row) {
      this.DeviceDialogShow = true

      this.DeviceeditForm = Object.assign({}, row)
    },

    // 删除型号单行数据方法
    modelDelete(row) {
      var equipment_model_id = new Array(0)
      equipment_model_id.push(row.equipment_model_id)
      this.$confirm(
        this.$t('message.Areyousuretodelete'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          equipmentModel_deleteEquipmentModel_equipment_model_id_token(
            equipment_model_id
          ).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Deletesuccessed'))
            }
            // 调用查询型号方法
            this.getModellist()
            // 调用查询型号分组
            this.equipment_queryEquipmentGroup_get()
          })
        })
        .catch(() => {})
    },

    // 修改型号方法
    updateModel() {
      this.$refs.DeviceModeleditForm.validate(valid => {
        if (valid) {
          this.$confirm(
            this.$t('message.Areyousuretoeditit'),
            this.$t('message.Notification'),
            {
              type: 'warning'
            }
          ).then(() => {
            equipmentModel_updateEquipmentModel_token_post(
              this.DeviceModeleditForm
            ).then(response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Editsuccessed'))
                this.getModellist()
              } else {
                this.$message.error(response.errorMessage)
              }
              this.DeviceModelDialogShow = false
            })
          })
          this.getModellist()
          // 调用查询型号分组
          this.equipment_queryEquipmentGroup_get()
        }
      }).catch(() => {
        return false
      })
    },

    deviceAdjustmenthandleSelectionChange(val) {
      this.deviceMultipleSelection = val
    },

    // 根据设备groupid查询出设备分组
    deviceGroping() {
      if (this.DevicelistQuery.equipment_group_id === '') {
        this.getDeviceList()
      } else {
        equipmentGroup_queryEquipmentsForGroup_token(this.DevicelistQuery).then(
          response => {
            if (response.errorCode === 0) {
              this.Devicelist = response.result.list
              this.DeviceTotal = response.result.total_count
            } else {
              // this.$message.error(response.errorMessage)
              this.Devicelist = []
              this.DeviceTotal = 0
            }
          }
        )
      }
    },

    // 查询设备分组
    equipment_queryEquipmentGroup_get() {
      equipmentGroup_queryEquipmentGroup_get().then(response => {
        this.setTree = []
        this.SelectedSetTree = []
        this.SelectedSetTree = response.result
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
        }
      })
    },

    // 查询型号信息
    modelQuery() {
      this.getModellist()
    },

    // 查询型号方法
    getModellist() {
      equipmentModel_queryEquipmentModel_token_get(
        this.formInline.equipment_model_name
      ).then(response => {
        // this.Modellist === []
        this.Modellist = response.result
      })
    },

    // 查询设备列表信息
    searchEquipment() {
      this.DevicelistQuery.pageNo = 1
      this.getDeviceList()
    },

    // 查询设备信息。
    getDeviceList() {
      if (this.DevicelistQuery.equipment_group_id === '') {
        equipment_queryEquipment_pageNo_pageSize_equipmentID_get(
          this.DevicelistQuery
        ).then(response => {
          if (response.errorCode === 0) {
            this.Devicelist = response.result.list
            console.log(this.Devicelist)
            this.DeviceTotal = response.result.total_count
          } else {
            this.$message.error(response.errorMessage)
            this.Devicelist = []
            this.DeviceTotal = 0
          }
        })
      } else {
        this.deviceGroping()
      }
    },

    // 查询设备配置表格数据
    querydeviceConfing() {
      this.deviceConfingactionQuery()
    },

    // 设置分组
    setDeviceGroping() {
      // 设备分组参数
      var migratoryEquipment = {
        groupId: '',
        equipmentIds: []
      }
      migratoryEquipment.equipmentIds = this.equipmentIds
      migratoryEquipment.groupId = this.DevicetheCurrentlySelectedGroup_id
      if (this.role_code.includes(1)) {
        equipmentGroup_migratoryEquipment_post(migratoryEquipment).then(
          response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('equipmentMg.Setupgroupsuccessed'))
            } else {
              this.$message.error(response.errorMessage)
            }
            this.DeviceGroupDialogShow = false
          }
        )
      }
    },
    // 设备列表table
    handleSizeChange(val) {
      this.DevicelistQuery.pageSize = val
      this.getDeviceList()
    },

    handleCurrentChange(val) {
      this.DevicelistQuery.pageNo = val
      this.getDeviceList()
    },

    // tab click
    handleClick(tab, event) {
      this.crumbs = tab.label
    },
    // 设备列表多选数组
    handleSelectionChange(val) {
      this.multipleSelection = val
      var ids = this.multipleSelection.map(item => item.equipment_id).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.equipmentIds = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.equipmentIds.push(strs[i])
        }
      }
    },
    // 型号列表多选数组
    modelhandleSelectionChange(val) {
      this.ModelmentmultipleSelection = val
    },
    initExpand() {
      this.setTree.map(a => {
        this.defaultExpandKeys.push(a.equipment_group_id)
      })
      this.isLoadingTree = true
    },
    handleNodeClick(d, n, s) {
      // 设备列表分页参数
      this.DevicelistQuery = {
        pageNo: 1,
        pageSize: 7,
        equipmentCode: '',
        equipment_group_id: ''
      }
      // 选中的设备分组的名称显示出来
      this.theCurrentlySelectedGroup = d.equipment_group_name

      // 选中的设备分组的id
      this.theCurrentlySelectedGroup_id = d.equipment_group_id

      this.DevicelistQuery.equipment_group_id = d.equipment_group_id

      // 根据设备分组id查询设备信息。
      this.deviceGroping()
      // 点击节点
      d.isEdit = false // 放弃编辑状态
    },
    // 设置分组弹出框菜单
    DevicehandleNodeClick(d, n, s) {
      // 选中的迁移设备分组的名称显示出来
      this.rmeovtheCurrentlySelectedGroup = d.equipment_group_name
      // 选中的设备分组的id
      this.DevicetheCurrentlySelectedGroup_id = d.equipment_group_id
    },
    // 查询选中的设备组id
    selectDeviceGroup_id(d, n, s) {
      // 选中的设备分组的名称显示出来
      this.rmeovtheCurrentlySelectedGroup = d.equipment_group_name
      // 选中的设备分组的id
      this.theCurrentlySelectedGroup_id = d.equipment_group_id
      // 得到根据用户分组id查询得到equipment_group_id条件
      this.DevicelistQuery.equipment_group_id = d.equipment_group_id
      // 根据设备分组id查询设备
      this.deviceGroping()
      // 点击节点
      d.isEdit = false // 放弃编辑状态
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
    handleAdd(s, d, n) {
      // 增加节点
      if (n.level >= 6) {
        this.$message.error(this.$t('equipmentMg.Onlysupport5levels'))
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
              this.SelectedSetTree.push(addEquipment_group) // 设置分组里面TreeDate也要加保持同步
              return false
            }
            d.sub_group.push(addEquipment_group)
          } else {
            this.$message.error(response.errorMessage)
            return false
          }
        }
      )
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


