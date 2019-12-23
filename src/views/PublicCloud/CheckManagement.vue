<template>
  <div class="Publiccloud-home">
    <the-breadcrumb>
       <el-breadcrumb-item>{{$t('Breadcrumb.AuthorizeManagement')}}</el-breadcrumb-item>
    </the-breadcrumb>
    <el-tabs v-model="client_activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('Breadcrumb.ApprovingLists')" name="first">
          <el-form :inline="true">
            <el-form-item>
              <el-input class="client-input" :placeholder="$t('checkMg.Schedulename')" v-model="AuditedListQuery.release_plan_name" @keyup.enter.native="queryAudit"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="queryAudit">
                {{$t('table.Search')}}</el-button>
            </el-form-item>

          </el-form>

        <!--待审核列表-->
        <el-scrollbar class="commonScrollbar" style="height:560px;">
        <el-table :data="TobeAuditedList"    highlight-current-row style="" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="release_plan_name" :label="$t('checkMg.Filename')" width="120"    >
          </el-table-column>
          <el-table-column prop="type" :label="$t('table.Type')" width="180" :formatter="formatType">
          </el-table-column>
          <el-table-column prop="state" :label="$t('table.Status')" width="120" >
            <template slot-scope="scope">
              <el-tag :type="scope.row.state | statusFilter">{{scope.row.state|formatCheckStata}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="user_name" :label="$t('checkMg.Publisher')" width="150"    >
          </el-table-column>
          <el-table-column prop="create_time" :label="$t('table.Date')" width="180"     >
             <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
          </el-table-column>
          <el-table-column :label="$t('table.Operation')" width="300" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="tadeQuery(scope.row)">{{$t('table.Approve')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-scrollbar>
        <!--工具条-->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="AuditedListQuery.page_no" :page-sizes="[9, 10, 20, 30]" :page-size="AuditedListQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="TobeAuditedTotal">

          </el-pagination>
        </div>

      </el-tab-pane>

      <el-tab-pane :label="$t('Breadcrumb.AuthorizedLists')"  name="second">
          <el-form :inline="true">
            <el-form-item>
              <el-input class="client-input" :placeholder="$t('checkMg.Schedulename')" v-model="AuditListQuery.release_plan_name" @keyup.enter.native="checkQuery"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" class="client-buttom" @click="checkQuery">
                {{$t('table.Search')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="deletionAudited" :disabled="checkIsdisableButton"  icon="el-icon-delete">{{$t('table.Deleteselected')}}</el-button>
            </el-form-item>
          </el-form>
        <!--已审核列表-->
        <el-scrollbar class="commonScrollbar" style="height:560px;">
        <el-table :data="checkedList"     highlight-current-row style="" @selection-change="aduitHandleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="release_plan_name" :label="$t('checkMg.Schedulename')" width="140"    >
          </el-table-column>
          <!-- <el-table-column prop="create_time" :label="$t('table.Date')" width="180"    >
             <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
          </el-table-column> -->
          <el-table-column prop="audit_time" :label="$t('table.Audittime')" width="180">
             <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span>{{scope.row.audit_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
          </el-table-column>
          <el-table-column prop="state" :label="$t('table.Status')" width="150"    >
            <template slot-scope="scope">
              <el-tag :type="scope.row.state | statusFilter">{{scope.row.state|formatCheckStata}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="type" :label="$t('table.Type')" width="180" :formatter="formatType"    >
          </el-table-column>
           <el-table-column prop="user_name" :label="$t('checkMg.Publisher')" width="150"     >
          </el-table-column>
          <el-table-column :label="$t('table.Operation')" width="300" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="danger" icon="el-icon-delete" @click="pushDelete(scope.row)">{{$t('table.Delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-scrollbar>
        <!--工具条-->
        <div class="block">
          <el-pagination @size-change="AduithandleSizeChange" @current-change="AduithandleCurrentChange" :current-page="AuditListQuery.page_no" :page-sizes="[9, 10, 20, 30]" :page-size="AuditListQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="AuditedTotal">
          </el-pagination>
        </div>
      </el-tab-pane>

      <!--审阅弹出框-->
      <el-dialog width="50%" height="400px !important;" :title="$t('table.Approve')" :visible.sync="AuditedDialogShowOrHide" append-to-body>
        <el-form :inline="true" :model="editAuditedForm" ref="editAuditedForm" class="demo-form-inline">
          <el-form-item :label="$t('checkMg.Schedulename')" prop="release_plan_name">
            <el-input name="release_plan_name" v-model="editAuditedForm.release_plan_name" class="client-input" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.Date')" prop="create_time">
           <el-date-picker v-model="editAuditedForm.create_time" type="date" :placeholder="$t('table.Date')" :readonly="true">
          </el-date-picker>
          </el-form-item >
          <el-form-item :label="$t('table.Type')" prop="type">
           <el-input name="type" v-model="formatPushType" class="client-input" :readonly="true" ></el-input>
          </el-form-item>
        </el-form>
        <!--待审核数据-->
        <el-table :data="Reviewlist" highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
          <el-table-column prop="file_name" :label="$t('checkMg.Filename')" width="380"    >
          </el-table-column>
          <el-table-column prop="create_time" :label="$t('table.Date')" width="180"     >
             <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="danger" @click="planReviewcheck(4)">{{$t('checkMg.NotAllowed')}}</el-button>
          <el-button size="small" type="primary" @click="planReviewcheck(3)">{{$t('checkMg.Approved')}}</el-button>
        </span>
      </el-dialog>

    </el-tabs>

  </div>
</template>

<script>

import {
  releasePlan_pagedQuery_page_no_page_size_token_get,
  releasePlan_updateState_release_plan_id_state_post,
  releasePlan_delete_release_plan_id_token_get,
  releasePlan_queryInfo_release_plan_id_token
} from '@/api/releasePlan/releasePlan'

import { formatType } from '@/utils/format'
export default {
  name: 'CheckManagement',
  data() {
    return {
      detailsrows: {}, // 审核的文件

      value: '',
      client_activeName: 'first', // 默认显示面板

      checkIsdisableButton: true, // 按钮禁用

      AuditedDialogShowOrHide: false, // 审核弹出框

      // 待审核编辑form
      editAuditedForm: {
        release_plan_name: '',
        create_time: ''
      },

      multipleSelection: [], // 多选数组

      aduitMultipleSelection: [], // 已审核多选数组

      TobeAuditedList: [], // 待审核管理表格数据

      Reviewlist: [], // 审阅表格数据

      checkedList: [], // 已经审核管理表格数据

      release_plan_ids: [], // 删除已审核数据

      TobeAuditedTotal: null, // 待审核分页属性

      AuditedTotal: null, // 已审核分页属性

      // 待审核分页参数
      AuditedListQuery: {
        page_no: 1,
        page_size: 9,
        user_name: '',
        state: 2,
        release_plan_name: ''
      },

      // 已审核分页参数
      AuditListQuery: {
        page_no: 1,
        page_size: 9,
        state: 3456,
        release_plan_name: '',
        user_name: ''
      },
      crumbs: this.$t('Breadcrumb.ApprovingLists') // 面包屑 当前所在位置
    }
  },

  // 页面加载显示
  created() {
    // 待审核方法
    this.getAuditedList()
    // this.checkQuery()
    this.queryAuditing()
    // 获取下拉框角色类型list
  },
  computed: {
    // 格式化发布对象
    formatPushType() {
      return formatType(this.editAuditedForm)
    }
  },

  watch: {
    multipleSelection(curVal, oldVal) {
      if (curVal.length === 0) {
        this.checkIsdisableButton = true
      } else if (curVal.length !== 0) {
        this.checkIsdisableButton = false
      }
    },
    aduitMultipleSelection(curVal, oldVal) {
      if (curVal.length === 0) {
        this.checkIsdisableButton = true
      } else if (curVal.length !== 0) {
        this.checkIsdisableButton = false
      }
    }
  },
  methods: {

    // 弹出显示
    tadeQuery(row) {
      this.AuditedDialogShowOrHide = true
      this.releasePlanqueryInfo(row)
      this.editAuditedForm = Object.assign({}, row)
      this.detailsrows = Object.assign({}, row)
    },

    // 删除已审核数据
    pushDelete(row) {
      this.$confirm(this.$t('message.Areyousuretodelete'), this.$t('message.Notification'), {
        type: 'warning'
      })
        .then(() => {
          this.release_plan_ids.push(row.release_plan_id)
          releasePlan_delete_release_plan_id_token_get(this.release_plan_ids)
            .then(response => {
              if (response.errorCode === 0) {
                this.$message.success(this.$t('message.Deletesuccessed'))
              }
              this.queryAuditing()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },

    // 批量删除已审核数据
    deletionAudited(row) {
      if (this.aduitMultipleSelection.length === 0) {
        return
      }
      this.$confirm(this.$t('message.Areyousuretodelete'), this.$t('message.Notification'),
        {
          type: 'warning'
        }
      ).then(() => {
        this.release_plan_ids.push(row.release_plan_id)
        releasePlan_delete_release_plan_id_token_get(this.release_plan_ids).then(response => {
          if (response.errorCode === 0) {
            this.$message.success(this.$t('message.Deletesuccessed'))
          } else {
            this.$message.error(response.errorMessage)
          }
          this.queryAuditing()
        })
      }).catch(() => {
        return false
      })
    },

    // 审核计划
    planReviewcheck(state) {
      var param = {}
      param.state = state
      param.release_plan_id = this.detailsrows.release_plan_id
      releasePlan_updateState_release_plan_id_state_post(param).then(
        response => {
          if (response.errorCode === 0) {
            this.$message.success(this.$t('message.Operationsuccessed'))
            this.AuditedDialogShowOrHide = false
            this.getAuditedList()
          }
          this.queryAuditing()
        }
      )
    },
    formatType(row, column) {
      return formatType(row, column)
    },

    // 查询待审核管理数据
    queryAudit() {
      this.AuditedListQuery.page_no = 1
      this.getAuditedList()
    },
    // 查询待审核数据
    getAuditedList() {
      releasePlan_pagedQuery_page_no_page_size_token_get(this.AuditedListQuery).then(
        response => {
          this.TobeAuditedList = response.result.list
          this.TobeAuditedTotal = response.result.total_count
        }
      )
    },

    // 查询带审阅数据
    releasePlanqueryInfo(row) {
      releasePlan_queryInfo_release_plan_id_token(row.release_plan_id).then(response => {
        this.Reviewlist = response.result.file_list
      })
    },

    // 查询已审核数据
    checkQuery() {
      // 分页模糊查询默认第一页
      this.AuditListQuery.page_no = 1
      this.queryAuditing()
    },
    // 查询已审核数据
    queryAuditing() {
      releasePlan_pagedQuery_page_no_page_size_token_get(
        this.AuditListQuery
      ).then(response => {
        this.checkedList = response.result.list
        this.AuditedTotal = response.result.total_count
      })
    },

    // 待审核分页
    handleSizeChange(val) {
      this.AuditedListQuery.page_size = val
      this.getAuditedList()
    },
    handleCurrentChange(val) {
      this.AuditedListQuery.page_no = val
      this.getAuditedList()
    },
    // 已审核
    AduithandleSizeChange(val) {
      this.AuditListQuery.page_size = val
      this.queryAuditing()
    },
    AduithandleCurrentChange(val) {
      this.AuditListQuery.page_no = val
      this.queryAuditing()
    },
    // 批量删除已审核数据
    aduitHandleSelectionChange(val) {
      this.aduitMultipleSelection = val
      // 先得到已审核ID
      var ids = this.aduitMultipleSelection.map(item => item.release_plan_id).join() // 获取所有选中行的id组成的字符串，以逗号分隔
      var strs = ids.split(',') // 字符分割
      this.release_plan_ids = []
      for (var i = 0; i < strs.length; i++) {
        // 如果为空不添加
        if (strs[i] !== '') {
          this.release_plan_ids.push(strs[i])
        }
      }
    },
    handleClick(tab, event) {
      this.crumbs = tab.label
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
