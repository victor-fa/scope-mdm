<template>
  <span icon="el-icon-more" class="tree-expand">
    <svg-icon icon-class="TreeUser" v-show="DATA.user_group_id!=null" />
    <svg-icon icon-class="TreeIPad" v-show="DATA.equipment_group_id!=null" />
    <span class="tree-label" v-show="NODE.isEdit">
      <el-input :maxlength=inputMaxleng v-show="DATA.user_group_id!=null" class="edit" size="mini" autofocus v-model="DATA.user_group_name" :ref="'treeInput'+DATA.user_group_id" @click.stop.native="nodeEditFocus" @blur.stop="nodeEditPass(STORE,DATA,NODE)" @keyup.enter.stop.native="keyupPass(STORE,DATA,NODE)"></el-input>
      <el-input :maxlength=inputMaxleng v-show="DATA.equipment_group_id!=null" class="edit" size="mini" autofocus v-model="DATA.equipment_group_name" :ref="'treeInput'+DATA.equipment_group_id" @click.stop.native="nodeEditFocus" @blur.stop="nodeEditPass(STORE,DATA,NODE)" @keyup.enter.stop.native="keyupPass(STORE,DATA,NODE)"></el-input>
    </span>
    <span v-show="!NODE.isEdit" :class="['tree-label']">
      <span v-show="DATA.user_group_id!=null">{{DATA.user_group_name}}</span>
      <span v-show="DATA.equipment_group_id!=null">{{DATA.equipment_group_name}}</span>
    </span>
    <span class="tree-btn" v-show="!NODE.isEdit">
      <!-- 私有云,市场专员
          年级 -- 可添加班级，不可修改名称，不可删除
          班级 -- 不可添加下级，可以修改名称， 可以删除 -->
      <i v-if="(this.role_code.includes(1) || this.role_code.includes(6)) || ( NODE.level ===1 && this.role_code.includes(2) && DATA.user_group_id!='')" class="el-icon-plus" @click.stop="nodeAdd(STORE,DATA,NODE)"></i>

      <i v-show="DATA.equipment_group_id!=null" v-if="((this.role_code.includes(1)|| this.role_code.includes(6)) && DATA.equipment_group_id!=0 ) || ( NODE.level >1 && this.role_code.includes(2))" class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)"></i>
      <i v-show="DATA.user_group_id!=null" v-if="((this.role_code.includes(1)|| this.role_code.includes(6)) && DATA.user_group_id!='' ) || ( NODE.level >1 && this.role_code.includes(2))" class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)"></i>

      <i v-show="DATA.equipment_group_id!=null" v-if="((this.role_code.includes(1)|| this.role_code.includes(6)) && DATA.equipment_group_id!=0 ) || ( NODE.level >1 && this.role_code.includes(2))" class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)"></i>
      <i v-show="DATA.user_group_id!=null" v-if="((this.role_code.includes(1)|| this.role_code.includes(6)) && DATA.user_group_id!='' ) || ( NODE.level >1 && this.role_code.includes(2))" class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)"></i>
    </span>
  </span>
</template>

<script>
import {
  userGroup_updatePublicCloud_user_group_id_token_get,
  userGroup_updatePrivatecloud_user_group_id_token_get
} from '@/api/user/user'
import { equipmentGroup_modifyEquipmentGroupById_post } from '@/api/equipment/equipment'
export default {
  name: 'treerender',
  props: ['NODE', 'DATA', 'STORE'],
  data() {
    return {
      role_code: '',
      inputMaxleng: 14
    }
  },
  methods: {
    nodeAdd(s, d, n) {
      // 新增
      this.$emit('nodeAdd', s, d, n)
    },
    nodeEdit(s, d, n) {
      // 编辑
      n.isEdit = true
      this.$nextTick(() => {
        if (d.user_group_id != null) {
          this.$refs['treeInput' + d.user_group_id].$refs.input.focus()
        } else if (d.equipment_group_id != null) {
          this.$refs['treeInput' + d.equipment_group_id].$refs.input.focus()
        }
      })
      this.$emit('nodeEdit', s, d, n)
    },
    nodeDel(s, d, n) {
      // 删除
      this.$emit('nodeDel', s, d, n)
    },
    keyupPass(s, d, n) {
      // 编辑完成
      n.isEdit = false
    },
    nodeEditPass(s, d, n) {
      // 编辑完成
      n.isEdit = false
      if (d.user_group_id != null) {
        if (this.role_code.includes(1) || this.role_code.includes(6)) {
          userGroup_updatePublicCloud_user_group_id_token_get(
            d.user_group_id,
            d.user_group_name
          ).then(response => {})
        } else if (this.role_code.includes(2)) {
          userGroup_updatePrivatecloud_user_group_id_token_get(
            d.user_group_id,
            d.user_group_name
          ).then(response => {})
        }
      } else if (d.equipment_group_id != null) {
        // 编辑设备分组方法
        equipmentGroup_modifyEquipmentGroupById_post(
          d.equipment_group_id,
          d.equipment_group_name
        )
      }
    },
    nodeEditFocus() {
      // 阻止点击节点的事件冒泡
    }
  },
  created() {
    this.role_code = this.$store.getters.roles
  }
}
</script>

<style>
.tree-expand {
  overflow: hidden;
}
.tree-expand .tree-label.tree-new {
  font-weight: 600;
}
.tree-expand .tree-label {
  font-size: 0.9em;
}
.tree-expand .tree-label .edit {
  width: 80%;
}
.tree-expand .tree-btn {
  display: none;
  float: right;
  margin-right: 20px;
}
.tree-expand .tree-btn i {
  color: #8492a6;
  font-size: 0.9em;
  margin-right: 3px;
}
</style>