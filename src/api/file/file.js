import request from '@/utils/request'
// import { convertRESTAPI } from '@/utils/mockutil'
import store from '@/store'

/** 下载文件 <br><br> 权限：<br> *所有角色可用 */
function file_download_file_id_token_get(opts) {
  return request({
    method: 'get',
    url: '/file/download/' + opts,
    responseType: 'blob',
    data: { token: store.getters.token }
  })
}
/** 删除文件数据*/
function file_updateAllState_token(opts) {
  return request({
    method: 'post',
    url: '/file/updateAllState/' + store.getters.token,
    data: {
      file_ids: opts.file_ids,
      state: opts.state
    }
  })
}

/** 分页查询文件数据 <br><br> 权限：<br>1、公有云系统管理员<br>2、私有云系统管理员<br>7、内容专员 */
function file_pagedQuery_page_no_page_size_token_get(opts) {
  return request({
    method: 'get',
    url: '/file/pagedQuery/' + opts.eq_state + '/' + opts.page_no + '/' + opts.page_size + '/' + store.getters.token,
    params: {
      content_type_code: opts.file_type,
      file_name: opts.file_name
    }
  })
}
/**
 * 远程查询文件
 */
function fileOperation_toke(opts) {
  return request({
    method: 'post',
    url: '/equipment/fileOperation/' + store.getters.token,
    data: {
      equipment_code: opts.equipment_code,
      path: opts.path,
      cmd: opts.cmd
    }
  })
}
/**
 * 查询设备定位
 */
function equipment_getTargeting_equipment_code_token(equipment_code) {
  return request({
    method: 'get',
    url: '/equipment/getTargeting/' + equipment_code + '/' + store.getters.token
  })
}

/** 修改文件数据 <br><br> 权限：<br>1、公有云系统管理员<br>2、私有云系统管理员<br>7、内容专员 */
function file_update_file_id_token_post(opts) {
  return request({
    method: 'post',
    url: '/file/update/' + opts.file_id + '/' + store.getters.token,
    data: { file_name: opts.file_name, remark: opts.remark }
  })
}
/** 公有云查询订阅列表数据和私有云查询应用商店 */
function subListAndAppStore_pagedQuery_type_page_no_page_size_token(opts) {
  return request({
    method: 'get',
    url: '/subListAndAppStore/pagedQuery/' + opts.type + '/' + opts.page_no + '/' + opts.page_size + '/' + store.getters.token,
    params: { file_name: opts.file_name }
  })
}
/** 删除订阅列表及应用商店数据  */
function subListAndAppStore_delete_type_token(publish, type) {
  return request({
    method: 'post',
    url: '/subListAndAppStore/delete/' + type + '/' + store.getters.token,
    data: {
      publish: publish
    }
  })
}
/** 私有云获取公有云订阅列表数据  */
function subListAndAppStore_queryPublicCouldSubList_token(opts) {
  return request({
    method: 'get',
    url: '/subListAndAppStore/queryPublicCould/' + opts + '/' + store.getters.token
  })
}
/** 私有云获取公有云订阅列表数据分页查询 */
function subListAndAppStore_pagedQueryPublicCould_type_page_no_page_size_token(opts) {
  return request({
    method: 'get',
    url: '/subListAndAppStore/pagedQueryPublicCould/' + opts.type + '/' + opts.page_no + '/' + opts.page_size + '/' + store.getters.token,
    params: { file_name: opts.file_name }
  })
}

/** 私有云获取公有云订阅列表数据  */
function subListAndAppStore_downloadPublicCouldFile_token(file_ids) {
  return request({
    method: 'post',
    url: '/subListAndAppStore/downloadPublicCouldFile/' + store.getters.token,
    data: file_ids
  })
}
export {
  file_download_file_id_token_get,
  file_pagedQuery_page_no_page_size_token_get,
  file_update_file_id_token_post,
  file_updateAllState_token,
  subListAndAppStore_pagedQuery_type_page_no_page_size_token,
  subListAndAppStore_delete_type_token,
  subListAndAppStore_queryPublicCouldSubList_token,
  subListAndAppStore_downloadPublicCouldFile_token,
  subListAndAppStore_pagedQueryPublicCould_type_page_no_page_size_token,
  fileOperation_toke,
  equipment_getTargeting_equipment_code_token
}
