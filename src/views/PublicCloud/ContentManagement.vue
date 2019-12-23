<template>
  <div class="Publiccloud-home">
    <!-- begin 当前位置面包屑 -->
     <the-breadcrumb>
       <el-breadcrumb-item>{{$t('Breadcrumb.FilesAPPs')}}</el-breadcrumb-item>
    </the-breadcrumb>
    <!--当前位置面包屑 end -->

    <el-tabs v-model="client_activeName" @tab-click="handleClick" style="height:600px;">
      
      <!--内容仓库面板 -->
      <el-tab-pane :label="$t('Breadcrumb.ContentStore')" name="first">

        <el-form :inline="true" @submit.native.prevent>

          <el-form-item>

      <el-input type="text" style="width:210px;" class="client-input" :placeholder="$t('content.FilenameUploader')" v-model="ContentListQuery.file_name"
              @keyup.enter.native="searchFile()">
    </el-input>

          </el-form-item>

          <el-form-item>
            <el-select ref="selectPush" @change="selectPushQuery" :placeholder="$t('pushMg.Filetype')" v-model="ContentListQuery.file_type">
              <el-option v-for="item in fielTypeOptions" :key="item.fielType_num" :label="item.fielType_name" :value="item.fielType_num" >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="searchFile()">
              {{$t('table.Search')}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="batchDeletefile" :disabled="isdisableButton" icon="el-icon-delete">{{$t('table.Deleteselected')}}</el-button>
          </el-form-item>

          <el-form-item>
            <el-button class="client-buttom" type="primary" icon="el-icon-upload" @click="FlieUploadDialogShow=true">{{$t('content.Uploadedcontent')}}</el-button>
          </el-form-item>
        </el-form>
        <!--内容仓库列表-->
        <el-scrollbar class="commonScrollbar" style="height:560px;">
          <el-table :data="list"  highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
            <el-table-column :selectable="canICheckIt" type="selection" width="55">
            </el-table-column>

            <el-table-column prop="file_name" :label="$t('content.Filename')" width="280" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.file_name}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="upload_user_name" :label="$t('content.Uploader')" width="200">
            </el-table-column>
             <!-- <el-table-column prop="DevType"  :label="$t('content.EquipmentModel')" width="150">
            </el-table-column>
             <el-table-column prop="LatestVersion"  :label="$t('content.AfterrenewalEdition')" width="180">
            </el-table-column>
            <el-table-column prop="NewestVersion"  :label="$t('content.Uploader')" width="180">
            </el-table-column> -->
            <el-table-column prop="create_time" :label="$t('table.Uploadtime')" width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="content_type_code" :label="$t('table.Type')" width="100" :formatter="formatContentType">
            </el-table-column>

            <el-table-column prop="file_size" :label="$t('content.Size')" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.file_size | fileSizeConventMB }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.Operation')" width="300" align="center">
              <template slot-scope="scope">
                <el-button size="small" type="primary" icon="el-icon-edit-outline" @click="handleEdit(scope.$index, scope.row)">{{$t('table.Edit')}}</el-button>
                <el-button size="small" type="primary" icon="el-icon-download" @click="download(scope.$index, scope.row)">{{$t('table.Download')}}</el-button>
                <el-button size="small" v-if="(scope.row.upload_user_id!==undefined ||scope.row.upload_user_id!=='') && scope.row.upload_user_name!=='公有云'" type="danger" icon="el-icon-delete" @click="deleteFile(scope.row)">{{$t('table.Delete')}}</el-button>
                <el-button :disabled="true" v-else size="small" type="danger" icon="el-icon-delete">{{$t('table.Delete')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>

        <!--工具条-->
        <div class="block">

          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="ContentListQuery.page_no" :page-sizes="[9, 15, 20, 30]" :page-size="ContentListQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="FileTotal">
          </el-pagination>
        </div>
      </el-tab-pane>

      <!--订阅列表-->
      <el-tab-pane :label="$t('Breadcrumb.SubscriptionList')" name="second" v-if="this.role_code.includes(1)">
        <el-form :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input class="client-input" style="width:290px;" :placeholder="$t('content.SubscriptionlistnameUploader')" v-model="publicListQuery.file_name" @keyup.enter.native="stoneQuery()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="stoneQuery()">
              {{$t('table.Search')}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="deletsePublicAppction" :disabled="isdisableButton" icon="el-icon-delete">{{$t('table.Deleteselected')}}</el-button>
          </el-form-item>
        </el-form>
        <!--列表-->
        <el-scrollbar class="commonScrollbar" style="height:560px;">
        <el-table  :data="pulibcList" highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column :selectable="canICheckIt" type="selection" width="55">
          </el-table-column>
          <el-table-column prop="file_name" :label="$t('content.Subscriptionlistame')" width="280">
          </el-table-column>
          <el-table-column prop="upload_user_name" :label="$t('content.Uploader')" width="200">
          </el-table-column>
          <el-table-column prop="create_time" :label="$t('table.Uploadtime')" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.Operation')" width="226" align="center">
            <template slot-scope="scope">
              <el-button v-if="(scope.row.upload_user_id!==undefined ||scope.row.upload_user_id!=='') && scope.row.upload_user_name!=='公有云'" size="small" type="danger" icon="el-icon-delete" @click="deletePublicAppction(scope.row)">{{$t('table.Delete')}}</el-button>
              <el-button :disabled="true" v-else size="small" type="danger" icon="el-icon-delete">{{$t('table.Delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-scrollbar>
        <!--工具条-->
        <div class="block">
          <el-pagination @size-change="publichandleSizeChange" @current-change="pulichandleCurrentChange" :current-page="publicListQuery.page_no" :page-sizes="[9, 15, 20, 30]" :page-size="publicListQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="PulicTotal">
          </el-pagination>
        </div>
      </el-tab-pane>

      <!--应用商店-->
      <el-tab-pane :label="$t('Breadcrumb.APPStore')" name="sex">
        <el-form :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input class="client-input" style="width:300px;" :placeholder="$t('content.APPStorenameUploader')" v-model="privateListQuery.file_name" @keyup.enter.native="applactionQuery()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="applactionQuery()">
              {{$t('table.Search')}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="deletesPrivateAppction" :disabled="isdisableButton" icon="el-icon-delete">{{$t('table.Deleteselected')}}</el-button>
          </el-form-item>
        </el-form>
        <!--应用商店列表-->
        <el-scrollbar class="commonScrollbar" style="height:560px;">
          <el-table :data="privatelist" highlight-current-row @selection-change="handleSelectionChange">
            <el-table-column :selectable="canICheckIt" type="selection" width="55">
            </el-table-column>
            <el-table-column prop="file_name" :label="$t('content.Filename')" width="300" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="upload_user_name" :label="$t('content.Uploader')" width="200">
            </el-table-column>
            <el-table-column prop="create_time" :label="$t('table.Uploadtime')" width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.Operation')" width="226" align="center">
              <template slot-scope="scope">
                <el-button v-if="(scope.row.upload_user_id!==undefined ||scope.row.upload_user_id!=='') && scope.row.upload_user_name!=='公有云'" size="small" type="danger" icon="el-icon-delete" @click="deleteprivateAppction(scope.row)">{{$t('table.Delete')}}</el-button>
                <el-button :disabled="true" v-else size="small" type="danger" icon="el-icon-delete">{{$t('table.Delete')}}</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-scrollbar>
        <!--工具条-->
        <div class="block">
          <el-pagination @size-change="privatehandleSizeChange" @current-change="privatehandleCurrentChange" :current-page="privateListQuery.page_no" :page-sizes="[9, 15, 20, 30]" :page-size="privateListQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="privateTotal">
          </el-pagination>
        </div>
      </el-tab-pane>

      <!--私有云获取公有云订阅列表-->
      <el-tab-pane :label="$t('content.Publiccloudsubscriptionlist')" name="Four" v-if=" this.role_code.includes(2) ||  this.role_code.includes(7)">
        <el-form :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input class="client-input" :placeholder="$t('content.Filename')" v-model="Privateloudaccesslist.file_name" @keyup.enter.native="pagedQueryPublicCould()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="pagedQueryPublicCould()">
              {{$t('table.Search')}}</el-button>
          </el-form-item>
        </el-form>
        <!--列表-->
        <el-scrollbar class="commonScrollbar" style="height:560px;">
        <el-table  :data="privateTopublicList" highlight-current-row>
          <el-table-column prop="file_name" :label="$t('content.Publiccloudsubscriptionlist')" width="430">
          </el-table-column>
          <el-table-column prop="create_time" :label="$t('table.Uploadtime')" width="200">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.Operation')" width="226" align="center">
            <template slot-scope="scope">
              <!-- <el-button size="small" type="danger" icon="el-icon-delete" @click="deletefile(scope.row)">删除</el-button> -->
              <el-button key="export-push" v-if="(scope.row.upload_user_id!==undefined ||scope.row.upload_user_id!=='') && (scope.row.upload_user_name!=='公有云') && scope.row.isBoolean" size="small" type="primary" @click="exportPush(scope.row)">{{$t('content.Addtocontentstore')}}</el-button>
              <el-button key="export-pushed" :disabled="true" v-else size="small" type="primary">{{$t('content.Addedtoprivatecloud')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-scrollbar>
        <!--工具条-->
        <div class="block">
          <el-pagination @size-change="privateTopublichandleSizeChangeh" @current-change="privateTopublichandleCurrentChangeh" :current-page="Privateloudaccesslist.page_no" :page-sizes="[9, 15, 20, 30]" :page-size="Privateloudaccesslist.page_size" layout="total, sizes, prev, pager, next, jumper" :total="Topublictotal_count">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--内容编辑弹出框-->
    <el-dialog width="30%" height="400px !important;" :title="$t('content.Editfile')" :visible.sync="FileEditDialogShow" append-to-body>

      <el-form :inline="true" @submit.native.prevent :model="editContentForm" :rules="editFormRules" ref="editContentForm" class="demo-form-inline">

        <el-form-item :label="$t('content.Filename')" prop="file_name">
          <el-input style="width:280px;" name="file_name" v-model="editContentForm.file_name" class="client-input" @keyup.enter.native="updateFile()"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="FileEditDialogShow = false">{{$t('table.Cancel')}}</el-button>
        <el-button type="primary" @click="updateFile()">{{$t('table.OK')}}</el-button>
      </span>

    </el-dialog>
    <!--文件上传-->
    <el-dialog width="30%" height="400px !important;" :title="$t('content.Uploadfile')" :visible.sync="FlieUploadDialogShow" append-to-body>
      <el-form>
        <el-form-item :label="$t('content.Pleaseselectfiletype')">
          <el-radio-group v-model="upLoadData.content_type_code">
            <el-radio :label=1>{{$t('content.File')}}</el-radio>
            <el-radio :label=2>{{$t('content.APP')}}</el-radio>
            <el-radio v-if="this.role_code.includes(1)" :label=3>{{$t('content.Updatepackage')}}</el-radio>
          </el-radio-group>
        </el-form-item>
          <el-form-item :label="$t('content.SubpackageName')" v-if="this.upLoadData.content_type_code===2">
          <el-input v-if="this.upLoadData.content_type_code===2" type="text" style="width:300px;" v-model="upLoadData.sub_package" :placeholder="$t('content.PleaseEnterASubpackageName')"></el-input>
        </el-form-item>
        <el-form-item>
           <el-select  :placeholder="$t('content.Pleasechoosethemodel')" v-model="upLoadData.DevType" v-if="this.upLoadData.content_type_code===3"  style="width:300px;">
             <el-option v-for="item in DivceTypeOptions" :key="item.equipment_model_id"  :label="item.DevType" :value="item.equipment_model_id"></el-option>
           </el-select>
          <!-- <el-input v-if="this.upLoadData.content_type_code===3" type="text" style="width:300px;" v-model="upLoadData.DevType" :placeholder="$t('content.Pleaseentertheupgradepackageversionnumber')"></el-input> -->
        </el-form-item>
        <el-form-item>
          <el-input v-if="this.upLoadData.content_type_code===3" type="text" style="width:300px;" v-model="upLoadData.LatestVersion" :placeholder="$t('content.Pleaseentertheversionnumberbeforetheupdate')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-if="this.upLoadData.content_type_code===3" type="text" style="width:300px;" v-model="upLoadData.NewestVersion" :placeholder="$t('content.Pleaseentertheupdatedversionnumber')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-if="this.upLoadData.content_type_code===3" type="text" style="width:300px;" v-model="upLoadData.Brand" :placeholder="$t('content.Manufacturer')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-if="this.upLoadData.content_type_code===3" type="text" style="width:300px;" v-model="upLoadData.BatchNo" :placeholder="$t('content.Factorybatch')"></el-input>
        </el-form-item>
      </el-form>
      <el-upload ref="upload"  class="upload-demo" :limit="fileLimt" :file-list="fileList" :on-exceed="limtExceed" :before-upload="beforeAvatarUpload" :data="upLoadData" drag :action="importFileUrl" :onSuccess="uploadSuccess" :on-error="uploadError">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">{{$t('content.Dragfiletohereor')}}
          <em>{{$t('content.Upload')}}</em>
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <!-- :auto-upload="false" <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
        <el-button type="primary" @click="flieUploadDialogClose">{{$t('table.Close')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  file_pagedQuery_page_no_page_size_token_get,
  file_update_file_id_token_post,
  file_updateAllState_token,
  subListAndAppStore_pagedQuery_type_page_no_page_size_token,
  subListAndAppStore_delete_type_token,
  subListAndAppStore_downloadPublicCouldFile_token,
  subListAndAppStore_pagedQueryPublicCould_type_page_no_page_size_token
} from '@/api/file/file'
import { iterationAddParmentTrue, formatContentTypeCode } from '@/utils/format'
import { uploadFileRespError } from '@/utils/response'
import { valideFileNameAndSize, valideFileNameZip } from '@/utils/validate'
import {
  userGroup_queryPublicCloud_token_get,
  userGroup_queryPrivatecloud_token_get
} from '@/api/user/user'

export default {
  name: 'ContentManagement',
  data() {
    return {
      fileLimt: 1, // 最大允许上传数量

      file_ids: [], // 文件id数组

      fileList: [], // 文件上传list

      // 要查询的文件类型下拉框选项
      fielTypeOptions: [
        { fielType_num: 1, fielType_name: this.$t('content.File') },
        { fielType_num: 2, fielType_name: this.$t('content.APP') }

      ],
      // 文件上传升级包下拉框选择
      DivceTypeOptions: [
        { equipment_model_id: 1, DevType: 'SP1099v' },
        { equipment_model_id: 2, DevType: 'F503H' },
        { equipment_model_id: 3, DevType: 'rk_3368H_64' }
      ],
      // 编辑界面数据
      editContentForm: {
        file_id: '',
        file_name: [],
        remark: [],
        create_time: ''
      },

      role_code: '', // 判断权限id

      // 表单验证
      editFormRules: {
        file_name: [
          {
            required: true,
            message: this.$t('content.Pleaseinputthefilename'),
            trigger: 'blur'
          }
        ]
      },

      isdisableButton: true, // 按钮是否禁用

      client_activeName: 'first', // 制定页面跳转

      FileEditDialogShow: false, //  文件编辑弹出框

      // 上传文件
      upLoadData: {
        content_type_code: 1,
        version_code: '',
        DevType: '',
        LatestVersion: '',
        NewestVersion: '',
        Brand: '',
        BatchNo: '',
        sub_package: ''
      },

      importFileUrl: 'mdm/file/upload/', // 文件上传

      FlieUploadDialogShow: false, // 文件上传弹出框属性

      list: [], // 文件表格数据data

      pulibcList: [], // 订阅列表数据data

      privatelist: [], // 应用列表数据data

      privateTopublicList: [], // 私有云获取公有云订阅列表数据

      privateTotal: null, // 私有分页

      FileTotal: null, // 内容仓库分页

      PulicTotal: null, // 公有云订阅列表

      Topublictotal_count: null, // 私有获取公有

      multipleSelection: [], // 多选数据数组

      deletefileid: [], // 批量删除文件数组

      // 内容仓库分页查询条件
      ContentListQuery: {
        page_no: 1,
        page_size: 9,
        file_name: '',
        file_id: '',
        eq_state: 2,
        file_type: 1

      },

      // 公有云查询订阅列表
      publicListQuery: {
        page_no: 1,
        page_size: 9,
        file_name: '',
        type: 1
      },

      // 私有云获取公有云订阅列表
      Privateloudaccesslist: {
        page_no: 1,
        page_size: 9,
        file_name: '',
        type: 1
      },

      // 私有云应用商店分页
      privateListQuery: {
        page_no: 1,
        page_size: 9,
        file_name: '',
        type: 2
      },

      // 内容仓库删除参数
      deleteParams: {
        state: 6,
        file_ids: []
      },

      crumbs: this.$t('Breadcrumb.ContentStore') // 面包屑 当前所在位置
    }
  },
  // 页面创建时
  created() {
    // 文件上传url+token
    const token = this.$store.getters.token

    this.importFileUrl += token

    // 查询应用商店
    this.privateQuery()

    this.publicQuery()

    // 内容仓库查询
    this.getContentList()

    this.role_code = this.$store.getters.roles

    if (this.role_code.includes(1)) {
      var fielType = { fielType_num: 3, fielType_name: this.$t('content.Updatepackage') }
      this.fielTypeOptions.push(fielType)
      this.userGroup_queryPublicCloud_token_get()
    } else if (this.role_code.includes(2)) {
      this.userGroup_queryPrivatecloud_token_get()
      this.privateTopublicQuery()
    }

    // var client_activeName = this.$route.query.client_activeName
    // if (client_activeName === undefined) {
    //   this.client_activeName = 'first'
    // } else {
    //   this.client_activeName = client_activeName
    // }
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
  computed: {},
  methods: {
    // 内容管理下拉框选中查询方法
    selectPushQuery() {
      // 下拉框失去焦点
      this.$nextTick(() => this.$refs.selectPush.blur())
      this.getContentList()
    },

    // 文件超出个数限制时的钩子
    limtExceed(files, fileList) {
      alert(this.$t('message.Youcanonlyuploadonefileonce'))
      return false
    },

    // 提交文件上传表单
    submitUpload() {
      this.$refs.upload.submit()
    },

    iterationAddParmentTrue, // 循环给某个属性添加 True

    // 关闭上传文件弹出框方法
    flieUploadDialogClose() {
      this.FlieUploadDialogShow = false
      this.getContentList()
    },

    // 判断这行是否可以勾选
    canICheckIt(row, index) {
      if (
        (row.upload_user_id !== undefined || row.upload_user_id !== '') &&
        row.upload_user_name !== '公有云'
      ) {
        return true
      }
    },

    // 上传成功后的回调
    uploadSuccess(response, file, fileList) {
      this.$refs.upload.clearFiles()
      this.fileList = []
      // this.fileList = fileList.slice(0, 0)
      if (response.errorCode === 10) {
        uploadFileRespError(response.errorMessage)
        // return false
      } else {
        this.$message.success(this.$t('pushMg.Uploadsuccessed'))
        // 调用内容仓库方法
        this.getContentList()
      }
    },
    // 上传失败后的回调
    uploadError(errmessage, file, fileList) {
      this.$message.error(errmessage)
      // this.$refs.upload.clearFiles()
      this.fileList = []
    },

    // 上传前文件校验
    beforeAvatarUpload(file) {
      if (this.upLoadData.content_type_code === 2) {
        return valideFileNameAndSize(file)
      }
      if (this.upLoadData.content_type_code === 3) {
        return valideFileNameZip(file, this.upLoadData.DevType, this.upLoadData.LatestVersion, this.upLoadData.NewestVersion)
      }
    },

    // 导出公有云数据
    exportPush(row) {
      this.$confirm(
        this.$t('message.Areyousuretoaddittothecontentstore'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          var exportfile = {}
          exportfile.file_id = row.file_id
          exportfile.file_name = row.file_name
          exportfile.path = row.path
          exportfile.content_type_code = row.content_type_code
          exportfile.package_name = row.package_name
          exportfile.version_number = row.version_number
          // 初始化为空
          this.file_ids = []
          this.file_ids.push(exportfile)
          subListAndAppStore_downloadPublicCouldFile_token(this.file_ids).then(
            response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Importsuccessed'))
                // 导出公有云数据的按钮隐藏。
                row.isBoolean = false
              } else {
                this.$message.error(response.errorMessage)
              }
              this.getContentList()
            }
          )
        })
        .catch(() => {})
    },

    // 查询公有云订阅列表数据
    stoneQuery() {
      this.publicListQuery.page_no = 1
      this.publicQuery()
    },
    publicQuery() {
      subListAndAppStore_pagedQuery_type_page_no_page_size_token(
        this.publicListQuery
      ).then(response => {
        this.pulibcList = response.result.list
        this.PulicTotal = response.result.total_count
      })
    },

    // 查询私有云应用商店
    applactionQuery() {
      this.privateListQuery.page_no = 1
      this.privateQuery()
    },
    privateQuery() {
      subListAndAppStore_pagedQuery_type_page_no_page_size_token(
        this.privateListQuery
      ).then(response => {
        this.privatelist = response.result.list
        this.privateTotal = response.result.total_count
      })
    },

    // 私有云获取公有云订阅列表数据
    pagedQueryPublicCould() {
      this.Privateloudaccesslist.page_no = 1
      this.privateTopublicQuery()
    },
    privateTopublicQuery() {
      subListAndAppStore_pagedQueryPublicCould_type_page_no_page_size_token(
        this.Privateloudaccesslist
      ).then(response => {
        if (response.result !== null) {
          if (response.result.length !== 0) {
            // 循环添加属性True给集合用来判断是否显示导入至内容仓库按钮。
            var newData = response.result.list
            this.iterationAddParmentTrue(newData)
            this.privateTopublicList = newData
            this.Topublictotal_count = response.result.total_count
          }
        }
      })
    },

    // 删除公有云订阅列表
    deletePublicAppction(row) {
      this.$confirm(
        this.$t('message.Areyousuretodelete'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.deleteParams.file_ids = []
          this.deleteParams.file_ids.push(row.file_id)
          subListAndAppStore_delete_type_token(
            this.deleteParams.file_ids,
            this.publicListQuery.type
          ).then(response => {
            if (response.errorCode === 0) {
              this.$message({
                message: this.$t('message.Deletesuccessed'),
                type: 'success'
              })
            }
            this.publicQuery()
          })
        })
        .catch(() => {})
    },

    // 批量删除公有云订阅列表
    deletsePublicAppction() {
      this.$confirm(
        this.$t('message.Areyousuretodelete'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          subListAndAppStore_delete_type_token(
            this.deleteParams.file_ids,
            this.publicListQuery.type
          ).then(response => {
            if (response.errorCode === 0) {
              this.$message({
                message: this.$t('message.Deletesuccessed'),
                type: 'success'
              })
            }
            this.publicQuery()
          })
        })
        .catch(() => {})
    },

    // 删除私有云应用商店
    deletePrivateAppction(row) {
      this.$confirm(
        this.$t('message.Areyousuretodelete'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.deleteParams.file_ids = []
          this.deleteParams.file_ids.push(row.file_id)
          subListAndAppStore_delete_type_token(
            this.deleteParams.file_ids,
            this.privateListQuery.type
          ).then(response => {
            if (response.errorCode === 0) {
              this.$message({
                message: this.$t('message.Deletesuccessed'),
                type: 'success'
              })
            }
            this.privateQuery()
          })
        })
        .catch(() => {})
    },

    // 删除私有云应用商店
    deletesPrivateAppction() {
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
          subListAndAppStore_delete_type_token(
            this.deleteParams.file_ids,
            this.privateListQuery.type
          ).then(response => {
            if (response.errorCode === 0) {
              this.$message({
                message: this.$t('message.Deletesuccessed'),
                type: 'success'
              })
            }
            this.privateQuery()
          })
        })
        .catch(() => {})
    },

    // 确认修改文件
    updateFile() {
      this.$refs.editContentForm.validate(valid => {
        if (valid) {
          this.$confirm(
            this.$t('message.Areyousuretoeditit'),
            this.$t('message.Notification'),
            {
              type: 'warning'
            }
          )
            .then(() => {
              file_update_file_id_token_post(this.editContentForm).then(
                response => {
                  if (response.errorCode === 0) {
                    this.$message({
                      message: this.$t('message.Editsuccessed'),
                      type: 'success'
                    })
                  }
                  this.FileEditDialogShow = false
                }
              )
              this.getContentList()
            })

            .catch(() => {})
        }
      })
    },

    // 内容仓库显示编辑界面
    handleEdit(index, row) {
      this.FileEditDialogShow = true
      this.editContentForm = Object.assign({}, row)
    },
    // 文件下载
    download(index, row) {
      window.open('mdm/file/download/' + row.file_id)
    },
    // 删除内容仓库单个按钮事件
    deleteFile(row) {
      this.$confirm(
        this.$t('message.Areyousuretodelete'),
        this.$t('message.Notification'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          // 删除单个
          this.deleteParams.file_ids = []
          this.deleteParams.file_ids.push(row.file_id)
          file_updateAllState_token(this.deleteParams).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Deletesuccessed'))
            }
            if (response.errorCode === 10) {
              this.$message.error(
                this.$t(
                  'message.Youarenotallowedtodeletetheusedfile'
                )
              )
            }
            this.getContentList()
          })
        })
        .catch(() => {})
    },

    // 批量删除内容仓库按钮事件
    batchDeletefile() {
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
          file_updateAllState_token(this.deleteParams).then(response => {
            if (response.errorCode === 0) {
              this.$message.success(this.$t('message.Deletesuccessed'))
            } else {
              this.$message.error(this.$t('content.Notalloweddeleteusedfile'))
            }
            this.getContentList()
          })
        })
        .catch(() => {})
    },

    // 查询公有云用户分组
    userGroup_queryPublicCloud_token_get() {
      userGroup_queryPublicCloud_token_get().then(response => {
        this.setTree = response.result
        // this.iteration(this.setTree)
      })
    },

    // 查询私有云用户分组
    userGroup_queryPrivatecloud_token_get() {
      userGroup_queryPrivatecloud_token_get().then(response => {
        this.setTree = response.result
      })
    },

    // 内容文件搜索
    searchFile() {
      this.ContentListQuery.page_no = 1
      this.getContentList()
    },
    getContentList() {
      file_pagedQuery_page_no_page_size_token_get(this.ContentListQuery).then(
        response => {
          if (response.errorCode === 0) {
            this.list = response.result.list
            this.FileTotal = response.result.total_count
          } else {
            this.message.error(response.errmessage)
          }
        }
      )
        .catch(() => {})
    },

    // 时间戳转换
    formatContentType(row, column) {
      return formatContentTypeCode(row, column)
    },

    // 内容仓库
    handleSizeChange(val) {
      this.ContentListQuery.page_size = val
      this.getContentList()
    },
    handleCurrentChange(val) {
      this.ContentListQuery.page_no = val
      this.getContentList()
    },

    // 公有云订阅列表
    publichandleSizeChange(val) {
      this.publicListQuery.page_size = val
      this.publicQuery()
    },
    pulichandleCurrentChange(val) {
      this.publicListQuery.page_no = val
      this.publicQuery()
    },

    // 应用商店
    privatehandleSizeChange(val) {
      this.privateListQuery.page_size = val
      this.privateQuery()
    },
    privatehandleCurrentChange(val) {
      this.privateListQuery.page_no = val
      this.privateQuery()
    },

    // 私有云获取公有云订阅列表
    privateTopublichandleSizeChangeh(val) {
      this.Privateloudaccesslist.page_size = val
      this.privateTopublicQuery()
    },
    privateTopublichandleCurrentChangeh(val) {
      this.Privateloudaccesslist.page_no = val
      this.privateTopublicQuery()
    },
    handleClick(tab, event) {
      this.crumbs = tab.label
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
      // 先得到文件ID
      var ids = this.multipleSelection.map(item => item.file_id).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.deleteParams.file_ids = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.deleteParams.file_ids.push(strs[i])
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>