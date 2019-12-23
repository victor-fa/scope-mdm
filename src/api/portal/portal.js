import request from '@/utils/request'
// import { convertRESTAPI } from '@/utils/mockutil'
import store from '@/store'

/** 分页查询接入商数据 <br><br> 权限：<br>1、公有云系统管理员 */
function accessProvider_pagedQuery_page_no_page_size_token_get(opts) {
  return request({
    method: 'get',
    url: '/accessProvider/pagedQuery/' + opts.page_no + '/' + opts.page_size + '/' + store.getters.token,
    params: opts
  })
}

/** 修改接入商数据 <br><br> 权限：<br>1、公有云系统管理员 */
function accessProvider_update_access_provider_id_token_post(opts) {
  return request({
    method: 'post',
    url: '/accessProvider/update/' + opts.access_provider_id + '/' + store.getters.token,
    data: {
      access_provider_id: opts.access_provider_id,
      access_provider_name: opts.access_provider_name,
      access_provider_address: opts.access_provider_address,
      remark: opts.remark
    }
  })
}

/** 删除接入商数据 <br><br> 权限：<br>1、公有云系统管理员 */
function accessProvider_delete_access_provider_id_token_get(opts) {
  return request({
    method: 'get',
    url: '/accessProvider/delete/' + opts + '/' + store.getters.token,
    params: opts
  })
}

/** 插入接入商数据 <br><br> 权限：<br>1、公有云系统管理员 */
function accessProvider_insert_token_post(opts) {
  return request({
    method: 'post',
    url: '/accessProvider/insert/' + store.getters.token,
    data: {
      access_provider_name: opts.access_provider_name, //
      access_provider_address: opts.access_provider_address, //
      remark: opts.remark //
    }
  })
}

export {
  accessProvider_pagedQuery_page_no_page_size_token_get,
  accessProvider_update_access_provider_id_token_post,
  accessProvider_delete_access_provider_id_token_get,
  accessProvider_insert_token_post
}
