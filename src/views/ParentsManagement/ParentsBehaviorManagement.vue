<template>
  <div class="Publiccloud-home">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <span class="postion-befor-long">|</span>
        <span class="client-postion">{{$t('Breadcrumb.Fuction')}}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('Breadcrumb.RemoteControl')}}</el-breadcrumb-item>
     <el-breadcrumb-item>{{ crumbs}}</el-breadcrumb-item>
    </el-breadcrumb>
     <br>
        <el-form :inline="true">
          <el-select v-model="children_equipment_code" :placeholder="$t('message.SelectDevice')" v-for="user in childrenInfoOptions"  :key="user.id" :label="user.name" :value="user"  style="width:400px">
          <el-option  v-for="code in user.equipment_code" :key="code" :label="user.user_name + ' ( ' + code + ' )'" :value="code"></el-option>
     </el-select>
       
       <!-- <el-form-item label="设备ID:">
          <el-input name="date" v-model="this.DeviceParma.equipmentCode" class="client-input" :readonly="true"></el-input>
        </el-form-item> -->
        </el-form>
        <el-form>
         <el-form-item>
         <el-button  class="client-buttom order-buttom" @click="equipmentRestoreFactorySettings" type="primary">{{$t('behaviorMg.RestoreFactorySettings')}}</el-button>

          <el-button class="client-buttom order-buttom" @click="deviceunbundling" type="primary">{{$t('behaviorMg.Unbind')}}</el-button>

          <el-button  class="client-buttom order-buttom" @click="devicereset" type="primary">{{$t('behaviorMg.Release')}}</el-button>

          <el-button class="client-buttom order-buttom" @click="deviceShutdown" type="primary">{{$t('behaviorMg.Poweroff')}}</el-button>

          <el-button class="client-buttom order-buttom" @click="devicerestart" type="primary">{{$t('behaviorMg.Reboot')}}</el-button>

          <el-button  class="client-buttom order-buttom" @click="devicelock" type="primary">{{$t('behaviorMg.Lock')}}</el-button>

          <el-button  class="client-buttom order-buttom" @click="deviceunlok" type="primary">{{$t('behaviorMg.Unlock')}}</el-button>

          <!-- <el-button class="client-buttom" type="primary" @click="showTiem">{{$t('behaviorMg.Setuptheexpiretimeofoperation')}}</el-button> -->
        </el-form-item>
        </el-form>
    <!-- <el-tabs v-model="client_activeName" @tab-click="handleClick">
      默认应用
      <el-tab-pane :label="$t('Breadcrumb.DefaultAPPs')" name="first">
              <el-form :inline="true">
                <el-form-item>
                  <el-select @change='selectRoleChange' :placeholder="$t('table.Type')" v-model="AppListQuery.configuration_item_type">
                    <el-option v-for="item in DefaultApplicationOptions" :key="item.configuration_item_type" :label="item.role_name" :value="item.configuration_item_type">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
      默认应用数据表格
       <el-scrollbar class="commonScrollbar" style="height:450px;">
      <el-table :data="ApplcationList"  ref="multipleSelection" style="width:100%" @selection-change="handleSelectionChange">
     
        <el-table-column prop="equipment_configuration_item_name" :label="$t('behaviorMg.APPName')" width="150"> </el-table-column>
        <el-table-column :label="$t('table.Operation')"  align="center" width="200">
          <template slot-scope="scope">
          <el-select @change="switchChange(scope.row)" v-model="scope.row.status_bool" :placeholder="$t('message.Select')">
                    <el-option v-for="item in StatusOptions"  :disabled="item.disabled" :key="item.status_bool" :label="item.state_name" :value="item.status_bool">
                    </el-option>
        </el-select>
          </template>
        </el-table-column>
      </el-table>
       </el-scrollbar>
      </el-tab-pane>
      网络白名单
       <el-tab-pane :label="$t('Breadcrumb.WebsiteWhitelists')" name="seven">
         列表
          <el-form :inline="true">
            <el-form-item>
              <el-button class="client-buttom" icon="el-icon-circle-plus-outline" type="primary" @click="addNewtwrok">{{$t('table.Add')}}</el-button>
            </el-form-item>
              <el-form-item>
                  <el-button type="danger" :disabled="isdisableButton" @click="" icon="el-icon-delete">{{$t('table.Deleteselected')}}</el-button>
              </el-form-item>
          </el-form>
           <el-scrollbar class="commonScrollbar" style="height:450px;">
        <el-table :data="WebSiteList"     highlight-current-row style="width: 100%;"  @selection-change="whiteSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="write_net_name" :label="$t('behaviorMg.Websitewhitelist')" width="150"> </el-table-column>
        <el-table-column :label="$t('table.Operation')"  align="center" width="200">
          <template slot-scope="scope">
                  <el-button size="small" type="danger" @click="deleteNewtwork(scope.row)">{{$t('table.Delete')}}</el-button>
         </template>
        </el-table-column>
      </el-table>
           </el-scrollbar>
       </el-tab-pane>
    </el-tabs> -->
 <!-- 添加网络白名单-->
    <!-- <el-dialog width="30%" :title="$t('behaviorMg.Addwebsitetowhitelist')" :visible.sync="NetWrokDialogShow" append-to-body>
      <el-form :inline="true" :model="WhiteAddForm" label-position="left" label-width="150px" style='width: 400px; margin-left:50px;' :rules="newteditFormRules" ref="WhiteAddForm" class="demo-form-inline">
        <el-form-item :label="$t('behaviorMg.Websitewhitelist')" prop="NetListName">
          <el-input name="NetListName" v-model="WhiteAddForm.NetListName" class="client-input"></el-input>
        </el-form-item>
        <el-form-item :label="$t('behaviorMg.websiteaddress')" prop="NetListUrl">
          <el-input name="NetListUrl" v-model="WhiteAddForm.NetListUrl" class="client-input"></el-input>
        </el-form-item>
        <help></help>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="NetWrokDialogShow = false">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary" @click="restNetwrok">{{$t('form.reset')}}</el-button>
        <el-button type="primary" @click="addNewtwok">{{$t('table.OK')}}</el-button>
      </span>

    </el-dialog> -->
  </div>

</template>

<script>
import {
  equipment_restoreMQEquipment,
  equipment_unRockMQEquipment_post,
  equipment_unBindMQEquipment_token,
  equipment_rockMQEquipment_post,
  equipment_rebootMQEquipment_post,
  equipment_resetMQEquipment_post,
  equipment_closeMQEquipment_post
// equipment_queryConfigList_token,
// equipment_queryWriteNetList_token,
// equipment_setNetWriteMQList,
// equipment_deleteNetWriteMQListLocal_token,
// equipment_manageEquipmentConfig_token
} from '@/api/equipment/equipment'
// import { GetLength } from '@/utils/format'
export default {
  name: 'ParentsBehaviorManagement',

  handleClick(row) {
  },
  data() {
    // const validateNetListUrl = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error(this.$t('behaviorMg.Pleaseinputthewhitelistnames')))
    //   } else {
    //     if (GetLength(value) === 1) {
    //       callback(new Error(this.$t('message.Input2lettersatleast')))
    //     }
    //     callback()
    //   }
    // }
    return {

      // 设备唯一标识符
      // DeviceParma: {
      //   // equipment_code: '1274cc0a620ba633a
      //   equipmentCode: '1274cc0a620ba633a'
      // },

      children_equipment_code: [], // 用户下拉框

      // PulbicTeachingClass: '',

      // whitemultipleSelection: [], // 白名单多选数组

      // isdisableButton: true, // 按钮是否禁用

      // // 默认应用
      // AppListQuery: {
      //   equipmentCodes: [],
      //   configuration_item_type: 1
      // },

      // 默认应用下拉框
      // DefaultApplicationOptions: [
      //   {
      //     configuration_item_type: 1,
      //     role_name: this.$t('behaviorMg.Software')
      //   },
      //   {
      //     configuration_item_type: 2,
      //     role_name: this.$t('behaviorMg.Hardware')
      //   }
      // ],

      // // 默认应用状态
      // StatusOptions: [
      //   { status_bool: true, state_name: this.$t('behaviorMg.On') },
      //   { status_bool: false, state_name: this.$t('behaviorMg.Off') },
      //   { status_bool: 'null', state_name: this.$t('behaviorMg.OnorOff'), disabled: true }
      // ],
      // NetWrokDialogShow: false, // 白名单弹出框属性

      // // 添加百名单非空验证
      // newteditFormRules: {
      //   NetListName: [
      //     {
      //       required: true,
      //       message: this.$t('behaviorMg.Pleaseinputthename'),
      //       trigger: 'blur'
      //     }
      //   ],
      //   NetListUrl: [
      //     {
      //       required: true,
      //       trigger: 'blur',
      //       validator: validateNetListUrl
      //     }
      //   ]
      // },

      MQEquipment: {
        parentTopic: 'MQTT_QHMDM',
        equipmentCode: [],
        validTime: -1,
        endTime: ''
      },
      // 白名单from
      // WhiteAddForm: {
      //   parentTopic: 'MQTT_QHMDM',
      //   NetListUrl: '', // 网址
      //   NetListName: '', // 网址对应的名称
      //   equipmentCode: [],
      //   NetList: []
      // },

      // // 显示参数
      // privatelistQuery: {
      //   private_cloud_name: ''
      // },
      // token: '',

      // multipleSelection: [], // 多选数组

      crumbs: this.$t('Breadcrumb.DefaultAPPs') // 面包屑 当前所在位置

      // ApplcationList: [], // 默认应用列表数据表格

      // WebSiteList: [], // 网络白名单数据列表

      // client_activeName: 'first'

    }
  },
  watch: {
    // 白名单是否选中
    // whitemultipleSelection(curVal, oldVa) {
    //   if (curVal.length === 0) {
    //     this.isdisableButton = true
    //   } else if (curVal.length !== 0) {
    //     this.isdisableButton = false
    //   }
    // }
  },
  // 页面加载时
  created() {
  // // 查询默认应用
  //   this.queryConfigLis()
  //   // 查询网络白名单
  //   this.queryWriteNetList()

    this.childrenInfoOptions = this.$store.getters.childrenInfoOptions // 得到用户id
    // console.log('输出是' + this.childrenInfoOptions)
  },
  mounted() {},
  computed: {},

  methods: {
    // 选中用户下拉框事件方法
    pulbicistlectRoleChange() {

    },

    // // 默认应用开关事件方法
    // switchChange(row) {
    //   var configParmet = {}
    //   var equipmentCodes = new Array(0)
    //   equipmentCodes.push(this.DeviceParma.equipmentCode)
    //   configParmet.equipmentCode = equipmentCodes
    //   configParmet.parentTopic = 'MQTT_QHMDM'
    //   var equipment_configuration_item_en_name = row.equipment_configuration_item_en_name
    //   var configApp = row.status_bool
    //   var configParmetConf = {}
    //   var configKey = equipment_configuration_item_en_name
    //   var configValue = configApp
    //   configParmetConf[configKey] = configValue
    //   configParmet.config = configParmetConf
    //   equipment_manageEquipmentConfig_token(configParmet).then(response => {
    //     if (response.errorCode === 0) {
    //       this.$message.success(this.$t('message.Successed'))
    //     } else {
    //       this.$message.error(response.errorMessage)
    //     }
    //   })
    // },

    // // 下拉框事件
    // selectRoleChange() {
    //   this.queryConfigLis()
    // },

    // // 根据设备ID查询默认应用
    // queryConfigLis() {
    //   // 清空数组
    //   this.AppListQuery.equipmentCodes = []
    //   this.AppListQuery.equipmentCodes.push(this.DeviceParma.equipmentCode)
    //   equipment_queryConfigList_token(this.AppListQuery).then(response => {
    //     this.ApplcationList = response.result.equipment_item
    //   })
    // },
    // // 白名单添加事件
    // addNewtwrok() {
    //   this.NetWrokDialogShow = true
    // },
    // // 网络白名单重置按钮
    // restNetwrok() {
    //   this.$refs['WhiteAddForm'].resetFields()
    // },
    // // 根据设备唯一标识符查询白名单
    // queryWriteNetList() {
    //   equipment_queryWriteNetList_token(this.DeviceParma).then(response => {
    //     if (response.errorCode === 0) {
    //       if (response.result != null || response.result !== {}) {
    //         this.WebSiteList = response.result.write_nets
    //       }
    //     }
    //   })
    // },
    // // 根据设备id添加网络白名单
    // addNewtwok() {
    //   this.$refs.WhiteAddForm.validate(vaild => {
    //     if (vaild) {
    //       var addnetwrk = {}
    //       var equipmentCode = new Array(0)
    //       var oneNetList = {}
    //       var NetListUrl = this.WhiteAddForm.NetListUrl
    //       var NetListName = this.WhiteAddForm.NetListName
    //       oneNetList[NetListName] = NetListUrl
    //       addnetwrk.NetList = oneNetList

    //       equipmentCode.push(this.DeviceParma.equipmentCode)
    //       addnetwrk.equipmentCode = equipmentCode
    //       addnetwrk.parentTopic = this.WhiteAddForm.parentTopic
    //       equipment_setNetWriteMQList(addnetwrk).then(response => {
    //         if (response.errorCode === 0) {
    //           this.$message.success(this.$t('message.Addsuccessed'))
    //           // 添加成功后查询一遍白名单数据
    //           this.queryWriteNetList()
    //           this.restNetwrok()
    //           return false
    //         } else {
    //           this.$message.error(response.errorMessage)
    //           this.restNetwrok()
    //           return false
    //         }
    //       })
    //     }
    //   })
    // },
    // // 根据设备ID删除网络白名单
    // deleteNewtwork(row) {
    //   this.$confirm(
    //     this.$t('message.Areyousuretodelete'),
    //     this.$t('message.Notification'),
    //     {
    //       type: 'warning'
    //     }
    //   ).then(response => {
    //     // 每次刪除前清空之前数组
    //     this.WhiteAddForm.NetList = []
    //     this.WhiteAddForm.equipmentCode = []
    //     this.WhiteAddForm.NetList.push(row.write_net_id)
    //     this.WhiteAddForm.equipmentCode.push(this.DeviceParma.equipmentCode)
    //     equipment_deleteNetWriteMQListLocal_token(this.WhiteAddForm).then(
    //       response => {
    //         if (response.errorCode === 0) {
    //           this.$message.success(this.$t('message.Deletesuccessed'))
    //           this.queryWriteNetList()
    //         } else {
    //           this.$message.error(response.errorMessage)
    //         }
    //       }
    //     )
    //   }).catch(() => {
    //     return false
    //   })
    // },
    // // 白名单多选数组
    // whiteSelectionChange(val) {
    //   this.whitemultipleSelection = val
    //   // 先得到设备分组id
    //   var ids = this.whitemultipleSelection.map(item => item.write_net_id).join() // 获取所有选中行的id组成的字符串，以逗号分隔
    //   var strs = ids.split(',') // 字符分割
    //   this.WhiteAddForm.NetList = []
    //   for (var i = 0; i < strs.length; i++) {
    //     // 如果为空不添加
    //     if (strs[i] !== '') {
    //       this.WhiteAddForm.NetList.push(strs[i])
    //     }
    //   }
    // },
    // handleClick(tab, event) {
    //   this.crumbs = tab.label
    // },
    // handleSelectionChange(val) {
    //   this.multipleSelection = val
    // }
    // 设备恢复出厂设置
    equipmentRestoreFactorySettings() {
      if (this.children_equipment_code <= 0) {
        this.$message.error(this.$t('message.SelectDevice'))
        return false
      }
      this.$confirm(
        this.$t('message.IsItSureToRestoreTheFactorySetting'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.MQEquipment.equipmentCode.push(this.children_equipment_code)
          console.log('输出是:' + this.children_equipment_code)
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
      if (this.children_equipment_code <= 0) {
        this.$message.error(this.$t('message.SelectDevice'))
        return false
      }
      this.$confirm(
        this.$t('message.Areyousuretounlockselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.MQEquipment.equipmentCode.push(this.children_equipment_code)
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
      if (this.children_equipment_code <= 0) {
        this.$message.error(this.$t('message.SelectDevice'))
        return false
      }
      this.$confirm(
        this.$t('message.Areyousuretoreleaseselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.MQEquipment.equipmentCode.push(this.children_equipment_code)
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
      if (this.children_equipment_code <= 0) {
        this.$message.error(this.$t('message.SelectDevice'))
        return false
      }
      this.$confirm(
        this.$t('message.Areyousuretolockselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.MQEquipment.equipmentCode.push(this.children_equipment_code)
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
      if (this.children_equipment_code <= 0) {
        this.$message.error(this.$t('message.SelectDevice'))
        return false
      }
      this.$confirm(
        this.$t('message.Areyousuretorebootselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.MQEquipment.equipmentCode.push(this.children_equipment_code)
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
      if (this.children_equipment_code <= 0) {
        this.$message.error(this.$t('message.SelectDevice'))
        return false
      }
      this.$confirm(
        this.$t('message.Areyousuretorecallselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.MQEquipment.equipmentCode.push(this.children_equipment_code)
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
      if (this.children_equipment_code <= 0) {
        this.$message.error(this.$t('message.SelectDevice'))
        return false
      }
      this.$confirm(
        this.$t('message.Areyousuretopoweroffselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.MQEquipment.equipmentCode.push(this.children_equipment_code)
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
    }

  }
}
</script>
<style lang='scss' scoped>
</style>