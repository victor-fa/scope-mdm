<template>
  <div class="Publiccloud-home">
     <the-breadcrumb>
       <el-breadcrumb-item>{{$t('Breadcrumb.SubsidiariesManagement')}}</el-breadcrumb-item>
    </the-breadcrumb>
    <el-tabs v-model="client_activeName" @tab-click="handleClick">
      <!--接入商管理 -->
      <el-tab-pane :label="$t('Breadcrumb.AgentsManagement')" name="first">

          <el-form :inline="true">
            <el-form-item>
              <el-input class="client-input" :placeholder="$t('clientMg.Agentname')" v-model="AccessProviderListQuery.access_provider_name" @keyup.enter.native="merchantsUserinfo"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="merchantsUserinfo">
                {{$t('table.Search')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="client-buttom" icon="el-icon-circle-plus-outline" type="primary" @click="addAccessProvider">{{$t('table.Add')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="client-buttom" type="primary" @click="handleDownload">{{$t('clientMg.Exportedlist')}}</el-button>
            </el-form-item>
          </el-form>
        <!--接入商列表-->
        <el-scrollbar class="commonScrollbar" style="height:560px;">
        <el-table :data="AccessProviderlist"  highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column v-for="(col,index) in tablecols " :key="index" :prop="col.prop" :label="col.label" width="180">
          </el-table-column>
          <el-table-column prop="access_provider_name" :label="$t('clientMg.Agentname')" width="190">
          </el-table-column>
          <el-table-column prop="access_provider_address" :label="$t('clientMg.Locationofagent')" width="260">
          </el-table-column>
          <el-table-column prop="remark" :label="$t('clientMg.Comments')" width="130">
          </el-table-column>
         
          <el-table-column :label="$t('table.Operation')" width="380" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="addAccessprivte(scope.row)">{{$t('clientMg.NewPrivateCloud')}}</el-button>
              <el-button size="small" type="primary" icon="el-icon-edit-outline" @click="portalEditor(scope.$index,scope.row)">{{$t('table.Edit')}}</el-button>
              <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteClinet(scope.row)">{{$t('table.Delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-scrollbar>
        <!--工具条-->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="AccessProviderListQuery.page_no" :page-sizes="[9, 10, 20, 30]" :page-size="AccessProviderListQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="AccessProvideTotal">

          </el-pagination>
        </div>

      </el-tab-pane>
      <!-- 私有云管理 -->
      <el-tab-pane :label="$t('Breadcrumb.PrivateCloudManagement')" name="second">
          <el-form :inline="true">
            <el-form-item>
              <el-input class="client-input" :placeholder="$t('clientMg.Privatecloudname')" v-model="privatelistQeruy.private_cloud_name" @keyup.enter.native="privateCloudList"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="privateCloudList">
                {{$t('table.Search')}}</el-button>
            </el-form-item>
          </el-form>

        <!--私有云列表-->
        <el-scrollbar class="commonScrollbar" style="height:560px;">
        <el-table :data="prvitelist"   highlight-current-row style="width: 100%;" @selection-change="privtehandleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column v-for="(col,index) in tablecols " :key="index" :prop="col.prop" :label="col.label" width="120">
          </el-table-column>
          <el-table-column prop="private_cloud_name" :label="$t('clientMg.Privatecloudname')" width="160">
          </el-table-column>
          <el-table-column prop="access_provider_name" :label="$t('clientMg.Agentnames')" width="260">
          </el-table-column>
          <el-table-column prop="state" :label="$t('clientMg.OnlineOffline')" width="140" :formatter="formatPrivateCloludState">
          </el-table-column>
          <el-table-column prop="create_time" :label="$t('table.Date')" width="170">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.Operation')" width="300" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="primary" icon="el-icon-edit-outline" @click="privateEditor(scope.$index,scope.row)">{{$t('table.Edit')}}</el-button>
              <el-button v-if="scope.row.frozen === 1 || scope.row.frozen === undefined" size="small" type="danger" icon="el-icon-close" @click="privateCloudUpdate(scope.row)">{{$t('clientMg.Unfreeze')}}</el-button>
              <el-button v-if="scope.row.frozen === 2 "size="small" type="primary" icon="el-icon-check" @click="thawPrivateCloudUpdate(scope.row)">{{$t('clientMg.Freezed')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-scrollbar>
        <!--工具条-->
        <div class="block">

          <el-pagination @size-change="privatehandleSizeChange" @current-change="privatehandleCurrentChange" :current-page="privatelistQeruy.page_no" :page-sizes="[9, 10, 20, 30]" :page-size="privatelistQeruy.page_size" layout="total, sizes, prev, pager, next, jumper" :total="privteTotal">
          </el-pagination>

        </div>

      </el-tab-pane>
    </el-tabs>
    <!--接入商弹出框-->
    <el-dialog width="30%" height="400px !important;" :title="textMap[dialogStatus]" :visible.sync="AccessProviderDialogShow" append-to-body>
      <el-tabs v-model="client_activeName" @tab-click="handleClick">
        <el-form :inline="true" :model="AccessProvidereForm" :rules="editFormRules" ref="AccessProvidereForm" class="demo-form-inline" label-position="left" label-width="230px" style='width: 460px; margin-left:50px;'>
          <el-form-item :label="$t('clientMg.Agentname')" prop="access_provider_name">
            <el-input name="access_provider_name" v-model="AccessProvidereForm.access_provider_name" class="client-input"></el-input>
          </el-form-item>
          <el-form-item :label="$t('clientMg.Locationofagent')" prop="access_provider_address">
            <el-input name="access_provider_address" v-model="AccessProvidereForm.access_provider_address" class="client-input"></el-input>
          </el-form-item>
          <el-form-item :label="$t('clientMg.Comments')" prop="remark">
            <el-input class="client-input" name="remark" v-model="AccessProvidereForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="AccessProviderDialogShow = false">{{$t('table.Cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" key="form-reset" type="primary" @click="resetPoatal">{{$t('form.reset')}}</el-button>
        <el-button v-if="dialogStatus=='create'" key="table-confirm" type="primary" @click="Addpoatal">{{$t('table.OK')}}</el-button>
        <el-button v-else type="primary" @click="updatePortal">{{$t('table.OK')}}</el-button>
      </span>

    </el-dialog>
    <!-- 私有云弹出框-->
    <el-dialog width="35%" height="400px !important;" :title="textMap[prviateDialogStstus]" :visible.sync="privateeditFormVisible" append-to-body>
      <el-form :inline="true" :model="privateeditForm" :rules="privateeditFormRules" ref="privateeditForm" class="demo-form-inline" label-position="left" label-width="230px" style='width: 540px; margin-left:50px;'>

        <el-form-item prop="private_cloud_name" :label="$t('clientMg.Privatecloudname')">
          <el-input style="width:260px;" name="private_cloud_name" v-model="privateeditForm.private_cloud_name" class="client-input"></el-input>
        </el-form-item>
    
        <el-form-item prop="length_of_schooling" :label="$t('clientMg.Lengthofschooling')" v-if="prviateDialogStstus=='create'">
          <el-select style="width:260px;" :placeholder="$t('clientMg.Lengthofschooling')" v-model="privateeditForm.length_of_schooling">
            <el-option v-for="item in SchoolOptions" :key="item.length_of_schooling" :label="item.role_name" :value="item.length_of_schooling">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-show="false" :label="$t('clientMg.Agentname')" prop="access_provider_id" >
          <el-input  style="width:260px;" class="client-input" name="access_provider_id" v-model="privateeditForm.access_provider_id"></el-input>
        </el-form-item>
        <el-form-item :label="$t('clientMg.Comments')" prop="remark">
          <el-input style="width:260px;" class="client-input" name="remark" v-model="privateeditForm.remark"></el-input>
        </el-form-item>
          <el-form-item prop="registration_code" :label="$t('clientMg.Key')" v-if="prviateDialogStstus=='update'">
          <el-input   name="registration_code"  v-model="privateeditForm.registration_code" class="client-input" :readonly="true"></el-input>
          <el-button type="primary" icon="document" @click='handleCopy(privateeditForm.registration_code,$event)'>{{ $t('clientMg.Copy') }}</el-button>
        </el-form-item> 
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="privateeditFormVisible = false">{{$t('table.Cancel')}}</el-button>
        <el-button v-if="prviateDialogStstus=='create'" type="primary" @click="reseprivate">{{$t('form.reset')}}</el-button>
        <el-button v-if="prviateDialogStstus=='create'" type="primary" @click="Addprivate">{{$t('table.OK')}}</el-button>
        <el-button v-else type="primary" @click="privateUpdate()">{{$t('table.OK')}}</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import {
  accessProvider_pagedQuery_page_no_page_size_token_get,
  accessProvider_update_access_provider_id_token_post,
  accessProvider_insert_token_post,
  accessProvider_delete_access_provider_id_token_get
} from '@/api/portal/portal'

import {
  formatPrivateCloludState
} from '@/utils/format'

import {
  privateCloud_pagedQuery_page_no_page_size_token_get,
  privateCloud_update_private_cloud_id_token_post,
  privateCloud_insert_token_post
} from '@/api/privateCloud/privateCloud'
import clip from '@/utils/clipboard'
export default {
  name: 'ClientManagement',
  data() {
    // 接入商非空验证
    const validateaccess_provider_name = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('clientMg.Pleaseinputtheagentname')))
      } else {
        callback()
      }
    }
    const validatoraccess_provider_address = (rule, value, callback) => {
      if (value === '') {
        callback(
          new Error(this.$t('clientMg.Pleaseinputtheagentaddres'))
        )
      } else {
        callback()
      }
    }
    return {

      SchoolOptions: [
        { length_of_schooling: '1', role_name: this.$t('clientMg.Elementaryschool') },
        { length_of_schooling: '2', role_name: this.$t('clientMg.Juniorhighschool') },
        { length_of_schooling: '3', role_name: this.$t('clientMg.Seniorhighschool') },
        { length_of_schooling: '12', role_name: this.$t('clientMg.ElementarytoJunior') },
        { length_of_schooling: '123', role_name: this.$t('clientMg.ElementarytoSenior') }
      ],

      dialogStatus: '', // 接入商弹出框状态

      prviateDialogStstus: '', // 私有云弹出框状态

      // 弹出框状态有编辑和新增
      textMap: {
        update: this.$t('clientMg.Edit'),
        create: this.$t('clientMg.Create')
      },

      // 接入商form
      AccessProvidereForm: {
        access_provider_id: '',
        access_provider_name: '',
        access_provider_address: '',
        remark: ''
      },

      // 私有云from
      privateeditForm: {
        private_cloud_id: '',
        private_cloud_name: '',
        access_provider_id: '',
        length_of_schooling: '',
        remark: ''
      },

      // 冻结私有云
      privatefreeze: {
        private_cloud_id: '',
        private_cloud_name: '',
        access_provider_id: '',
        frozen: 2
      },

      // 接入商表单验证
      editFormRules: {
        access_provider_name: [
          {
            required: true,
            trigger: 'blur',
            validator: validateaccess_provider_name
          }
        ],
        access_provider_address: [
          {
            required: true,
            trigger: 'blur',
            validator: validatoraccess_provider_address
          }
        ]
      },

      // 添加私有云非空验证
      privateeditFormRules: {
        private_cloud_name: [
          {
            required: true,
            message: this.$t('clientMg.Pleaseinputtheprivatecloudname'),
            trigger: 'blur'
          }
        ],
        length_of_schooling: [
          {
            required: true,
            message: this.$t('clientMg.Lengthofschooling'),
            trigger: 'blur'
          }
        ]
        // remark: [
        //   {
        //     required: true,
        //     message: this.$t('clientMg.Pleaseinputthecomments'),
        //     trigger: 'blur'
        //   }
        // ]
      },

      privateeditFormVisible: false, // 私有云弹出框是否显示

      AccessProviderDialogShow: false, // 接入商弹出框是否显示属性

      isdisableButton: true, // 按钮是否禁用

      privateIsdisableButton: true, // 私有云按钮禁用

      parentisdisableButton: true, // 家长按钮禁用

      client_activeName: 'first', // 默认面板显示

      AccessProviderlist: [], // 接入商表格

      prvitelist: [], // 私有云表格

      parentsList: [], // 家长管理表格

      multipleSelection: [], // 接入商多选数组

      poatalaccess_provider_id: [], // 接入商批量删除

      prviteSelection: [], // 私有云多选数组

      prantSelection: [], // 家长多选数组

      AccessProvideTotal: null, // 接入商分页

      privteTotal: null, // 私有云分页参数

      // 接入商分页带参数
      AccessProviderListQuery: {
        page_no: 1,
        page_size: 9,
        access_provider_name: '', // 接入商名称
        private_cloud_name: '', // 私有云名称
        access_provider_id: '', // 接入商id
        length_of_schooling: ''
      },

      // 私有云分页参数
      privatelistQeruy: {
        page_no: 1,
        page_size: 9,
        private_cloud_name: '', // 私有云名称
        access_provider_id: '', // 接入商id
        length_of_schooling: ''
      },
      crumbs: this.$t('Breadcrumb.AgentsManagement'), // 面包屑 当前所在位置
      tablecols: []
    }
  },
  created() {
    // 查询接入商
    this.getAccessProviderList()
    // 查询私有云
    this.privateQuery()
    // var client_activeName = this.$route.query.client_activeName
  //   if (client_activeName === undefined) {
  //     this.client_activeName = 'first'
  //   } else {
  //     this.client_activeName = client_activeName
  //   }
  // },
  },
  computed: {},
  watch: {
    // 接入商选中按钮事件
    multipleSelection(curVal, oldVal) {
      if (curVal.length === 0) {
        this.isdisableButton = true
      } else if (curVal.length !== 0) {
        this.isdisableButton = false
      }
    },

    // 私有云选中按钮事件
    prviteSelection(curVal, oldVal) {
      if (curVal.length === 0) {
        this.privateIsdisableButton = true
      } else if (curVal.length !== 0) {
        this.privateIsdisableButton = false
      }
    },

    // 家长选中按钮事件
    prantSelection(curVal, oldVal) {
      if (curVal.length === 0) {
        this.parentisdisableButton = true
      } else if (curVal.length !== 0) {
        this.parentisdisableButton = false
      }
    }
  },
  methods: {

    // 复制注册码方法
    handleCopy(text, event) {
      clip(text, event)
    },

    // 导出接入商数据
    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [this.$t('clientMg.Agentname')]
        const filterVal = ['access_provider_name']
        const lists = this.AccessProviderlist
        const data = this.formatJson(filterVal, lists)
        excel.export_json_to_excel(tHeader, data, this.$t('clientMg.Agentinformation'))
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    },

    // 接入商重置按钮事件
    resetPoatal() {
      this.$refs['AccessProvidereForm'].resetFields()
    },

    // 私有云重置按钮
    reseprivate() {
      this.$refs['privateeditForm'].resetFields()
    },

    // 添加私有云方法
    Addprivate() {
      if (this.privateeditForm.length_of_schooling === '') {
        this.$message.error(this.$t('clientMg.Lengthofschooling'))
        return false
      }
      this.$refs.privateeditForm.validate(vaild => {
        if (vaild) {
          var addprivate = {}
          addprivate.private_cloud_name = this.privateeditForm.private_cloud_name
          addprivate.length_of_schooling = this.privateeditForm.length_of_schooling
          addprivate.access_provider_id = this.privateeditForm.access_provider_id
          addprivate.remark = this.privateeditForm.remark
          privateCloud_insert_token_post(addprivate).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Addsuccessed'))
              // 重置方法
              this.reseprivate()
              return false
            }

            this.privateQuery()
          })
        }
      })
    },

    // 添加接入商方法
    Addpoatal() {
      this.$refs.AccessProvidereForm.validate(vaild => {
        if (vaild) {
          var addpoatalinfon = {}
          addpoatalinfon.access_provider_name = this.AccessProvidereForm.access_provider_name
          addpoatalinfon.access_provider_address = this.AccessProvidereForm.access_provider_address
          addpoatalinfon.remark = this.AccessProvidereForm.remark
          accessProvider_insert_token_post(addpoatalinfon).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Addsuccessed'))
            }
            this.getAccessProviderList()
            this.resetPoatal()
          })
        }
      })
    },

    // 接入商显示新增界面
    addAccessProvider() {
      this.dialogStatus = 'create'
      this.AccessProviderDialogShow = true
    },

    // 接入商 编辑弹出框显示方法
    portalEditor(index, row) {
      this.dialogStatus = 'update'
      this.AccessProviderDialogShow = true
      this.AccessProvidereForm = Object.assign({}, row)
    },

    // 私有云显示新增界面
    addAccessprivte(row) {
      this.privateeditForm.access_provider_id = row.access_provider_id
      this.prviateDialogStstus = 'create'
      this.privateeditFormVisible = true
    },

    // 私有云显示编辑弹出框
    privateEditor(index, row) {
      this.prviateDialogStstus = 'update'
      this.privateeditFormVisible = true
      this.privateeditForm = Object.assign({}, row)
    },

    // 冻结私有云方法
    privateCloudUpdate(row) {
      this.$confirm(
        this.$t('message.Areyousuretofreezeit'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      ).then(() => {
        this.privatefreeze.private_cloud_id = row.private_cloud_id
        privateCloud_update_private_cloud_id_token_post(
          this.privatefreeze
        ).then(response => {
          if (response.errorCode === 0) {
            this.$message.success(this.$t('message.Freezesuccessed'))
          } else {
            this.$message.error(response.errorMessage)
          }
          this.privateQuery()
        })
      }).catch(() => {
        return false
      })
    },
    // 解冻私有云方法
    thawPrivateCloudUpdate(row) {
      this.$confirm(
        this.$t('message.Areyousuretounfreezeselecteddevices'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      ).then(() => {
        var ThawPrivatefreeze = {}
        ThawPrivatefreeze.private_cloud_id = row.private_cloud_id
        ThawPrivatefreeze.frozen = 1
        privateCloud_update_private_cloud_id_token_post(
          ThawPrivatefreeze
        ).then(response => {
          if (response.errorCode === 0) {
            this.$message.success(this.$t('message.Unfreezesuccessed'))
          } else {
            this.$message.error(response.errorMessage)
          }
          this.privateQuery()
        })
      }).catch(() => {
        return false
      })
    },
    // 私有云修改方法
    privateUpdate() {
      this.$refs.privateeditForm.validate(valid => {
        if (valid) {
          this.$confirm(
            this.$t('message.Areyousuretoeditit'),
            this.$t('message.Notification'),
            {}
          ).then(() => {
            privateCloud_update_private_cloud_id_token_post(
              this.privateeditForm
            ).then(response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Editsuccessed'))
              }
              this.privateeditFormVisible = false
            })
          })
        }
      }).catch(() => {
        return false
      })
    },

    // 修改接入商方法
    updatePortal() {
      this.$refs.AccessProvidereForm.validate(valid => {
        if (valid) {
          this.$confirm(
            this.$t('message.Areyousuretoeditit'),
            this.$t('message.Notification'),
            {
              type: 'warning'
            }
          ).then(() => {
            accessProvider_update_access_provider_id_token_post(
              this.AccessProvidereForm
            ).then(response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Editsuccessed'))
              }
              this.AccessProviderDialogShow = false
            })
            this.getAccessProviderList()
          })
        }
      }).catch(() => {
        return false
      })
    },

    // 查询接入商管理
    merchantsUserinfo() {
      this.getAccessProviderList()
    },

    // 查询接入商数据
    getAccessProviderList() {
      accessProvider_pagedQuery_page_no_page_size_token_get(
        this.AccessProviderListQuery
      ).then(response => {
        this.AccessProviderlist = response.result.list
        this.AccessProvideTotal = response.result.total_count
      })
    },

    // 删除接入商数据
    deleteClinet(row) {
      this.$confirm(
        this.$t('message.Areyousuretodelete'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          accessProvider_delete_access_provider_id_token_get(
            row.access_provider_id
          )
            .then(response => {
              if (response.errorCode === 0) {
                if (response.errorCode === 10) {
                  this.$message.error(this.$t('clientMg.Theagenthasboundtoprivatecloud'))
                }
                this.$message.success(this.$t('message.Deletesuccessed'))
              } else {
                this.$message.error('接入商已绑定私有云不能删除')
              }
              this.getAccessProviderList()
            })
            .catch(() => {
              return false
            })
        })
        .catch(() => {
          return false
        })
    },

    // 批量删除接入商数据
    deletesclinet() {
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
          var ids = this.multipleSelection
            .map(item => item.access_provider_id)
            .join() // 获取所有选中行的id组成的字符串，以逗号分隔
          this.poatalaccess_provider_id = ids
        })
        .catch(() => {
          return false
        })
    },

    // 查询私有云数据
    privateCloudList() {
      this.privateQuery()
    },

    // 查询私有云方法
    privateQuery() {
      privateCloud_pagedQuery_page_no_page_size_token_get(
        this.privatelistQeruy
      ).then(response => {
        this.prvitelist = response.result.list
        this.privteTotal = response.result.total_count
      })
    },

    formatPrivateCloludState(row, column) {
      return formatPrivateCloludState(row, column)
    },
    handleSizeChange(val) {
      this.AccessProviderListQuery.page_size = val
      this.getAccessProviderList()
    },
    handleCurrentChange(val) {
      this.AccessProviderListQuery.page_no = val
      this.getAccessProviderList()
    },

    // 私有云
    privatehandleSizeChange(val) {
      this.privatelistQeruy.page_size = val
      this.privateQuery()
    },
    privatehandleCurrentChange(val) {
      this.privatelistQeruy.page_no = val
      this.privateQuery()
    },
    handleClick(tab, event) {
      this.crumbs = tab.label
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 私有云按钮禁用
    privtehandleSelectionChange(val) {
      this.prviteSelection = val
    },
    // 家长按钮禁用
    parenthandleSelectionChange(val) {
      this.prantSelection = val
    }
  }
}
</script>
<style lang="scss" scoped>

</style>