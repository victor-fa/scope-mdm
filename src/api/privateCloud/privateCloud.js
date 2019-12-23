import { convertRESTAPI } from '@/utils/mockutil'
import request from '@/utils/request'
import store from '@/store'

/** 公有云接入私有云 <br><br> 权限：<br>无限制 */
function privateCloud_PublicCloudAccessToPrivateCloud_registration_code_get(opts) {
  return request({
    method: 'get',
    url: convertRESTAPI('/privateCloud/PublicCloudAccessToPrivateCloud/{registration_code}', opts),
    opts: opts
  })
}

/** 删除私有云数据 <br><br> 权限：<br>1、公有云系统管理员 */
function privateCloud_delete_private_cloud_id_token_get(opts) {
  return request({
    method: 'get',
    url: convertRESTAPI('/privateCloud/delete/{private_cloud_id}/{token}', opts),
    opts: opts
  })
}

/** 插入私有云数据 <br><br> 权限：<br>1、公有云系统管理员 */
function privateCloud_insert_token_post(opts) {
  return request({
    method: 'post',
    url: '/privateCloud/insert/' + store.getters.token,
    data: {
      private_cloud_name: opts.private_cloud_name,
      length_of_schooling: opts.length_of_schooling,
      access_provider_id: opts.access_provider_id,
      remark: opts.remark
    }
  })
}

/** 分页查询私有云数据 <br><br> 权限：<br>1、公有云系统管理员 */
/** 返回的状态(1：不可用，2：未绑定，3：在线，4：离线， 5：异常，6：可用)*/
function privateCloud_pagedQuery_page_no_page_size_token_get(opts) {
  return request({
    method: 'get',
    url: '/privateCloud/pagedQuery/' + opts.page_no + '/' + opts.page_size + '/' + store.getters.token,
    params: opts
  })
}

/** 私有云接入公有云 <br><br> 权限：<br>无限制 */
function privateCloud_privateCloudAccessToPublicCloud_registration_code_get(opts) {
  return request({
    method: 'get',
    url: convertRESTAPI('/privateCloud/privateCloudAccessToPublicCloud/{registration_code}', opts),
    opts: opts
  })
}

/** 修改私有云数据 <br><br> 权限：<br>1、公有云系统管理员 */
function privateCloud_update_private_cloud_id_token_post(opts) {
  return request({
    method: 'post',
    url: '/privateCloud/update/' + opts.private_cloud_id + '/' + store.getters.token,
    data: {
      private_cloud_id: opts.private_cloud_id,
      private_cloud_name: opts.private_cloud_name,
      access_provider_id: opts.access_provider_id,
      remark: opts.remark,
      frozen: opts.frozen
    }
  })
}

export {
  privateCloud_PublicCloudAccessToPrivateCloud_registration_code_get,
  privateCloud_delete_private_cloud_id_token_get,
  privateCloud_insert_token_post,
  privateCloud_pagedQuery_page_no_page_size_token_get,
  privateCloud_privateCloudAccessToPublicCloud_registration_code_get,
  privateCloud_update_private_cloud_id_token_post
}
