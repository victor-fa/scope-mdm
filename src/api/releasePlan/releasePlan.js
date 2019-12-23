// import { convertRESTAPI } from '@/utils/mockutil'
import request from '@/utils/request'
import store from '@/store'

/** 插入发布计划数据 <br><br> 权限：<br>1、公有云系统管理员<br>2、私有云系统管理员 */
function releasePlan_insert_token_post(opts) {
  return request({
    method: 'post',
    url: '/releasePlan/insert/' + store.getters.token,
    data: {
      file_ids: opts.file_ids,
      release_plan_name: opts.release_plan_name,
      type: opts.type,
      publish: opts.publish,
      content_type_code: opts.file_type,
      parent_topic: opts.parent_topic
    }
  })
}

/** 分页查询发布计划数据 <br><br> 权限：<br>1、公有云系统管理员<br>2、私有云系统管理员 */
function releasePlan_pagedQuery_page_no_page_size_token_get(opts) {
  return request({
    method: 'get',
    url: '/releasePlan/pagedQuery/' + opts.page_no + '/' + opts.page_size + '/' + store.getters.token,
    params: {
      release_plan_name: opts.release_plan_name,
      state: opts.state
    }
  })
}

/** 删除发布计划数据 <br><br> 权限：<br>1、公有云系统管理员<br>2、私有云系统管理员 */
function releasePlan_delete_release_plan_id_token_get(release_plan_ids) {
  return request({
    method: 'post',
    url: '/releasePlan/delete/' + store.getters.token,
    data: { release_plan_ids: release_plan_ids }
  })
}
// /** 删除发布计划数据 <br><br> 权限：<br>1、公有云系统管理员<br>2、私有云系统管理员 */
// function releasePlan_delete_token(release_plan_ids) {
//   return request({
//     method: 'post',
//     url: '/releasePlan/delete/' + store.getters.token,
//     data: {
//       release_plan_ids: release_plan_ids
//     }
//   })
// }
/** 修改发布计划 */
/**
 * 发布状态
		1：未发布
		2：待审核
		3：审核通过
		4：审核失败
		5：发布成功
		6：发布失败
 */
function releasePlan_updateState_release_plan_id_state_post(opts) {
  return request({
    method: 'get',
    url: '/releasePlan/updateState/' + opts.release_plan_id + '/' + opts.state + '/' + store.getters.token,
    params: opts
  })
}

/** 修改发布计划 */
function releasePlan_update_release_plan_id_token(opts) {
  return request({
    method: 'post',
    url: '/releasePlan/update/' + opts.release_plan_id + '/' + store.getters.token,
    data: { release_plan_name: opts.release_plan_name }
  })
}
/** 查询发布计划详细信息  */
function releasePlan_queryInfo_release_plan_id_token(release_plan_id) {
  return request({
    method: 'get',
    url: '/releasePlan/queryInfo/' + release_plan_id + '/' + store.getters.token
  })
}
export {
  releasePlan_insert_token_post,
  releasePlan_pagedQuery_page_no_page_size_token_get,
  releasePlan_delete_release_plan_id_token_get,
  releasePlan_updateState_release_plan_id_state_post,
  releasePlan_update_release_plan_id_token,
  releasePlan_queryInfo_release_plan_id_token
}
