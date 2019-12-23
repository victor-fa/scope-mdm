import { convertRESTAPI } from '@/utils/mockutil'
import request from '@/utils/request'
import store from '@/store'
/** 分页查询用户数据 <br><br> 权限：<br>1、公有云系统管理员 <br> 2、私有云系统管理员 */
function getUserinfo(opts) {
  return request({
    method: 'get',
    url: '/user/pagedQuery/' + opts.page_no + '/' + opts.page_size + '/' + store.getters.token,
    params: { user_name: opts.user_name,
      role_code: opts.role_code, user_group_id: opts.user_group_id }
  })
}

/** 修改用户数据 <br><br> 权限：<br>1、公有云系统管理员 <br> 2、私有云系统管理员 */
function user_update_user_id_token_post(opts) {
  return request({
    method: 'post',
    url: '/user/update/' + opts.user_id + '/' + store.getters.token,
    data: {
      user_id: opts.user_id, // 用户id
      user_name: opts.user_name, // 用户姓名
      mobile: opts.mobile, // 用户电话
      email: opts.email, // 用户邮箱
      student_code: opts.student_code, // 学生号
      parent_user_id: opts.parent_user_id, // 学生号
      remark: opts.remark, // 备注
      password: opts.password, // 密码
      role_codes: opts.role_codes// 权限
    }
  })
}
/** 添加老师任教班级
权限：
2、私有云系统管理员  */
function user_addTeachingClass_token(opts) {
  return request({
    method: 'post',
    url: '/user/addTeachingClass/' + store.getters.token,
    data: {
      user_ids: opts.user_ids,
      user_group_ids: opts.user_group_ids
    }
  })
}
/** 删除老师任教班级
权限：
2、私有云系统管理员 */
function user_delTeachingClass_user_id_token(opts) {
  return request({
    method: 'post',
    url: '/user/delTeachingClass/' + opts.user_id + '/' + store.getters.token,
    data: {
      user_group_ids: opts.user_group_ids
    }
  })
}
/** 用户修改密码
权限：
*所有角色可用
返回以下错误信息时需要重新发送邮件：
链接无效:Link invalid
链接过期:Link expired */
function user_updatePassword(opts) {
  return request({
    method: 'post',
    url: '/user/updatePassword/',
    data: {
      reset_password: opts.reset_password,
      password: opts.password
    }
  })
}
/** 获取指定用户绑定设备的二维码
权限：
1、公有云系统管理员
2、私有云系统管理员
4、老师
返回信息：
equipment_code：设备唯一标识符
bind_path：绑定链接
png_path：二维码图片地址
错误信息：
user_id set exception：用户ID设置异常
equipment_code is empty：用户未绑定设备
Parameters */
function user_getBindingEquipmentQRCode_user_id_token(user_id) {
  return request({
    method: 'get',
    url: '/user/getBindingEquipmentQRCode/' + user_id + '/' + store.getters.token
  })
}
/** 导出指定用户组下家长绑定的设备二维码的Excel
权限：
1、公有云系统管理员
2、私有云系统管理员
4、老师
错误信息：
user_group_id cannot be empty ：用户组ID不能为空
user_group_id set exception ：用户组ID设置异常
user is empty ：无用户信息 */
function user_getBindingEquipmentQRCodeExcel_user_group_id_token(user_group_id) {
  return request({
    method: 'get',
    url: '/user/getBindingEquipmentQRCodeExcel/' + user_group_id + '/' + store.getters.token
    // responseType: 'blob'
    // respnoseType: 'application/octet-stream'
  })
}
/**
 *客户异常日志端
 */
function crashLog_pagedQuery_page_no_page_size(opts) {
  return request({
    method: 'get',
    url: '/crashLog/pagedQuery/' + opts.page_no + '/' + opts.page_size
  })
}
/** 家长绑定学生设备
权限：
5、家长
错误信息：
login_account, password and equipment_code cannot be empty ： 账号，密码或设备唯一标识不能为空
account or password error ： 账号或密码错误
equipment_code set exception ： 设备唯一标识不存在 */
/** 注册一个或多个学生用户数据  <br><br> 权限：<br>1、公有云系统管理员 <br> 2、市场专员 <br>传用户集合 */
function user_parentBindingEquipment(opts) {
  return request({
    method: 'post',
    url: '/user/parentBindingEquipment/',
    data: {
      equipment_code: opts.equipment_code,
      login_account: opts.login_account,
      password: opts.password
    }

  })
}
function user_registrationStudent_private_cloud_id_user_group_id_token_post(opts) {
  return request({
    method: 'post',
    url: '/user/registrationStudent/' + opts.private_cloud_id + '/' + opts.user_group_id + '/' + store.getters.token,
    data: opts.excelStudentData
  })
}
/** 用户重置密码
权限：
*所有角色可用
已绑定邮箱的用户，可通过邮箱重置密码。
返回错误信息：
账号不存在:Account number does not exist
未绑定邮箱:Unbound mailbox*/
function user_retrivevPassword(login_account) {
  return request({
    method: 'post',
    url: '/user/resetPassword/',
    data: { login_account: login_account }
  })
}
/** 注册一个或多个用户数据 <br><br> 权限：<br>1、公有云系统管理员 <br> 2、私有云系统管理员 <br><br> 传用户集合 */
function user_userRegistration_token_post(opts) {
  return request({
    method: 'post',
    url: '/user/registration/' + store.getters.token,
    data: opts
  })
}
/** 注册多个老师账号  */
function user_registration_token(opts) {
  return request({
    method: 'post',
    url: '/user/registration/' + store.getters.token,
    data: opts
  })
}
/** 查询角色数据 <br><br> 权限：<br> *所有角色可用 */
function role_query_token_get() {
  return request({
    method: 'get',
    url: '/role/query/' + store.getters.token
  })
}

/** 删除用户数据 权限：1、公有云系统管理员 2、私有云系统管理员 6、市场专员*/
function user_delete_token(user_ids) {
  return request({
    method: 'post',
    url: '/user/delete/' + store.getters.token,
    data: { user_ids: user_ids }
  })
}
/** 获取当前登录用户信息 <br><br> 权限：<br>*所有角色可用 */
function user_info_token_get(token) {
  return request({
    method: 'get',
    url: '/user/info/' + token
  })
}

/** 用户登录 <br><br> 权限：<br> *所有角色可用 <br><br> 登录成功后会返回Token，Token需添加在访问地址最后/token...，会根据Token进行用户及权限验证 <br><br> 验证错误返回的错误信息： <br>1：Token无效<br>2：Token过期 <br>3：无权访问 */
function user_login_post(login_account, password, remark) {
  return request({
    method: 'post',
    url: '/user/login',
    data: {
      login_account,
      password,
      remark
    },
    transformRequest: [function(data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/** 删除用户组数据 <br><br> 权限：<br>1、公有云系统管理员 */
function userGroup_deletePublicCloud_user_group_id_token_get(user_group_id) {
  return request({
    method: 'get',
    url: '/userGroup/deletePublicCloud/' + user_group_id + '/' + store.getters.token
  })
}
/** 根据分组查询用户  权限：<br>1、公有云系统管理员 2、私有云系统管理员  */
function userGroup_queryUser_user_group_id_token_get(user_group_id) {
  return request({
    method: 'get',
    url: '/userGroup/queryUser/' + user_group_id + '/' + store.getters.token
  })
}
/** 删除用户组数据 <br><br> 权限：<br> 2、私有云系统管理员 */
function userGroup_deletePrivatecloud_user_group_id_token_get(user_group_id) {
  return request({
    method: 'get',
    url: '/userGroup/deletePrivatecloud/' + user_group_id + '/' + store.getters.token
  })
}
/** 用户组迁移用户
权限：
1、公有云系统管理员
2、私有云系统管理员 */
function userGroup_migratoryUser_token_get(opts) {
  return request({
    method: 'post',
    url: '/userGroup/migratoryUser/' + store.getters.token,
    data: {
      parent_group_id: opts.parent_group_id,
      user_group_id: opts.user_group_id,
      user_ids: opts.user_ids
    }
  })
}

/** 私有云插入用户组数据 <br><br> 权限： <br> 2、私有云系统管理员 */
function userGroup_insertPrivatecloud_type_token_post(opts) {
  return request({
    method: 'post',
    url: '/userGroup/insertPrivatecloud/' + store.getters.token,
    data: opts
  })
}

/** 公有云插入用户组数据 <br><br> 权限：<br>1、公有云系统管理员 */
function userGroup_insertPublicCloud_token_post(opts) {
  return request({
    method: 'post',
    url: '/userGroup/insertPublicCloud/' + store.getters.token,
    data: opts
  })
}

/** 私有云用户分组查询 <br><br> 权限：<br> 1、公有云系统管理员 <br> 2、私有云系统管理员 */
function userGroup_queryPrivatecloud_token_get(opts) {
  return request({
    method: 'get',
    url: '/userGroup/queryPrivatecloud/' + store.getters.token
  })
}

/** 公有云用户分组查询 <br><br> 权限：<br> 1、公有云系统管理员 */
function userGroup_queryPublicCloud_token_get() {
  return request({
    method: 'get',
    url: '/userGroup/queryPublicCloud/' + store.getters.token
  })
}

/** 修改用户组父组 <br><br> 权限：<br>1、公有云系统管理员 <br> 2、私有云系统管理员 */
function userGroup_rename_user_group_id_user_group_name_token_get(opts) {
  return request({
    method: 'get',
    url: convertRESTAPI('/userGroup/rename/{user_group_id}/{user_group_name}/{token}', opts),
    opts: opts
  })
}

/** 公有云修改用户组父组或名称 <br><br> 权限：<br>1、公有云系统管理员 */
function userGroup_updatePublicCloud_user_group_id_token_get(user_group_id, user_group_name) {
  return request({
    method: 'Post',
    url: '/userGroup/updatePublicCloud/' + user_group_id + '/' + store.getters.token,
    params: {
      user_group_name
    }
  })
}
/** 私有云修改用户组父组或名称 <br><br> 权限：<br>1、私有云系统管理员 */
function userGroup_updatePrivatecloud_user_group_id_token_get(user_group_id, user_group_name) {
  return request({
    method: 'Post',
    url: '/userGroup/updatePrivatecloud/' + user_group_id + '/' + store.getters.token,
    params: {
      user_group_name
    }
  })
}
/** 根据用户分组id查询网络白名单 */
function equipment_queryWriteNetListUserGroup_token(opts) {
  return request({
    method: 'get',
    url: '/equipment/queryWriteNetListUserGroup/' + store.getters.token,
    params: { user_group_id: opts.user_group_id, parentTopic: opts.parentTopic }
  })
}
/** 根据用户分组id查询应用信息 */
function equipment_queryAPKUserGroup_token(opts, parentTopic) {
  return request({
    method: 'get',
    url: '/equipment/queryAPKUserGroup/' + store.getters.token,
    params: { user_group_id: opts, parentTopic: parentTopic }
  })
}
/** 分页查询用户操作日志数据  */
function userOperationLog_pagedQuery_page_no_page_size_token(opts) {
  return request({
    method: 'get',
    url: '/userOperationLog/pagedQuery/' + opts.page_no + '/' + opts.page_size + '/' + store.getters.token,
    params: { user_name: opts.user_name, create_time: opts.create_time, update_time: opts.update_time, execution_state: opts.execution_state }
  })
}
/** 下载批量注册学生Excel模板  */
function file_download_studentExcelTemplate_token() {
  return request({
    method: 'get',
    url: '/file/download/studentExcelTemplate/' + store.getters.token,
    responseType: 'blob'
  })
}
/** 下载批量注册老师Excel模板  */
function file_download_teacherExcelTemplate_token() {
  return request({
    method: 'get',
    url: '/file/download/teacherExcelTemplate/' + store.getters.token,
    responseType: 'blob'
  })
}
/** 账号验证
 */
function user_accountVerification_login_account_token(login_account) {
  return request({
    method: 'get',
    url: '/user/accountVerification/' + login_account + '/' + store.getters.token
  })
}
export {
  getUserinfo,
  user_update_user_id_token_post,
  user_registrationStudent_private_cloud_id_user_group_id_token_post,
  user_userRegistration_token_post,
  role_query_token_get,
  user_delete_token,
  user_info_token_get,
  user_login_post,
  userGroup_deletePublicCloud_user_group_id_token_get,
  userGroup_insertPrivatecloud_type_token_post,
  userGroup_insertPublicCloud_token_post,
  userGroup_queryPrivatecloud_token_get,
  userGroup_queryPublicCloud_token_get,
  userGroup_rename_user_group_id_user_group_name_token_get,
  userGroup_updatePublicCloud_user_group_id_token_get,
  userGroup_updatePrivatecloud_user_group_id_token_get,
  userGroup_deletePrivatecloud_user_group_id_token_get,
  userGroup_migratoryUser_token_get,
  userGroup_queryUser_user_group_id_token_get,
  equipment_queryWriteNetListUserGroup_token,
  equipment_queryAPKUserGroup_token,
  userOperationLog_pagedQuery_page_no_page_size_token,
  file_download_studentExcelTemplate_token,
  user_registration_token,
  user_accountVerification_login_account_token,
  file_download_teacherExcelTemplate_token,
  user_retrivevPassword,
  user_updatePassword,
  user_addTeachingClass_token,
  user_delTeachingClass_user_id_token,
  user_getBindingEquipmentQRCode_user_id_token,
  user_getBindingEquipmentQRCodeExcel_user_group_id_token,
  user_parentBindingEquipment,
  crashLog_pagedQuery_page_no_page_size
}
