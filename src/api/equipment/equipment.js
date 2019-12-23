import { convertRESTAPI } from '@/utils/mockutil'
import request from '@/utils/request'
import store from '@/store'
/** 对设备上自带的功能的禁用和启用分页*/
function equipment_queryEquipment_pageNo_pageSize_equipmentID_get(opts) {
  return request({
    method: 'get',
    url: '/equipment/queryEquipment/' + opts.pageNo + '/' + opts.pageSize + '/' + store.getters.token,
    params: { equipmentCode: opts.equipmentCode, login_account: opts.login_account, user_name: opts.user_name }
  })
}
/** 查询设备上默认应用列表*/
function equipment_queryEquipmentConfigAPP_pageNo_pageSize_equipmentID_get(opts) {
  return request({
    method: 'get',
    url: '/equipment/queryEquipmentConfigAPP/' + opts.pageNo + '/' + opts.pageSize + '/' + store.getters.token,
    params: { item_name: opts.item_name, state: opts.state }
  })
}
/** 根据guopid查询设备 */
function equipmentGroup_queryEquipmentsForGroup_token(opts) {
  return request({
    method: 'get',
    url: '/equipmentGroup/queryEquipmentsForGroup/' + store.getters.token,
    params: opts
  })
}
/** 根据guopid查询网络白名单 */
function equipment_queryWriteNetList_token(opts) {
  return request({
    method: 'get',
    url: '/equipment/queryWriteNetList/' + store.getters.token,
    params: opts
  })
}

/** 设备分组查询子分组或本身 两者都不输入查询所有 */
function equipmentGroup_queryEquipmentGroup_get() {
  return request({
    method: 'get',
    url: '/equipmentGroup/queryEquipmentGroup' + '/' + store.getters.token
  })
}

/** 设备重启 */
function equipment_rebootMQEquipment_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/rebootMQEquipment/' + store.getters.token,
    data: {
      equipmentCode: opts.equipmentCode,
      equipment_group_id: opts.equipment_group_id
    },
    params: {
      endTime: opts.endTime,
      validTime: opts.validTime,
      parentTopic: opts.parentTopic
    }
  })
}
/** 设备重启私有云权限 */
function equipment_rebootMQEquipmentLocal_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/rebootMQEquipmentLocal/' + store.getters.token,
    data: {
      equipmentCode: opts.equipmentCode,
      user_group_id: opts.user_group_id
    },
    params: {
      endTime: opts.endTime,
      validTime: opts.validTime,
      parentTopic: opts.parentTopic

    }
  })
}
/** 公有云根据设备id恢复出厂设置 */
function equipment_restoreMQEquipment(opts) {
  return request({
    method: 'post',
    url: '/equipment/restoreMQEquipment/' + store.getters.token,
    data: {
      equipmentCode: opts.equipmentCode,
      equipment_group_id: opts.equipment_group_id
    },
    params: {
      endTime: opts.endTime,
      validTime: opts.validTime,
      parentTopic: opts.parentTopic
    }
  })
}
/** 私有云根据用户id或者用户分组id设备恢复出厂设置 */
function equipment_restoreMQEquipmentUser(opts) {
  return request({
    method: 'post',
    url: '/equipment/restoreMQEquipmentUser/' + store.getters.token,
    data: {
      user_id: opts.user_ids,
      user_group_id: opts.user_group_id
    },
    params: {
      endTime: opts.endTime,
      validTime: opts.validTime,
      parentTopic: opts.parentTopic
    }
  })
}
/** 私有云根据用户id或者用户分组id设备重启 */
function equipment_rebootMQEquipmentLocalUser_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/rebootMQEquipmentLocalUser/' + store.getters.token,
    data: {
      user_id: opts.user_ids,
      user_group_id: opts.user_group_id
    },
    params: {
      endTime: opts.endTime,
      validTime: opts.validTime,
      parentTopic: opts.parentTopic

    }
  })
}
/** 设备重置 */
function equipment_resetMQEquipment_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/resetMQEquipment/' + store.getters.token,
    data: {
      equipmentCode: opts.equipmentCode,
      equipment_group_id: opts.equipment_group_id
    },
    params: {
      endTime: opts.endTime,
      validTime: opts.validTime,
      parentTopic: opts.parentTopic

    }
  })
}
/** 设备重置私有云权限 */
function equipment_resetMQEquipmentLocal_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/resetMQEquipmentLocal/' + store.getters.token,
    data: {
      equipmentCode: opts.equipmentCode,
      user_group_id: opts.user_group_id
    },
    params: {
      validTime: opts.validTime,
      parentTopic: opts.parentTopic
    }
  })
}
/** 私有云根据用户id或者用户分组id设备重置回收 */
function equipment_resetMQEquipmentLocalUser_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/resetMQEquipmentLocalUser/' + store.getters.token,
    data: {
      user_id: opts.user_ids,
      user_group_id: opts.user_group_id
    },
    params: {
      validTime: opts.validTime,
      parentTopic: opts.parentTopic
    }
  })
}
/** 设备锁定(设备回收) */
function equipment_rockMQEquipment_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/rockMQEquipment/' + store.getters.token,
    data: {
      equipmentCode: opts.equipmentCode,
      equipment_group_id: opts.equipment_group_id
    },
    params: {
      validTime: opts.validTime,
      parentTopic: opts.parentTopic

    }
  })
}
/** 设备锁定私有云权限 */
function equipment_rockMQEquipmentLocal_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/rockMQEquipmentLocal/' + store.getters.token,
    data: {
      equipmentCode: opts.equipmentCode
    },
    params: {
      validTime: opts.validTime,
      parentTopic: opts.parentTopic

    }
  })
}
/** 私有云根据用户id或者用户分组id设备重锁定*/
function equipment_rockMQEquipmentLocalUser_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/rockMQEquipmentLocalUser/' + store.getters.token,
    data: {
      user_id: opts.user_ids,
      user_group_id: opts.user_group_id
    },
    params: {
      validTime: opts.validTime,
      parentTopic: opts.parentTopic

    }
  })
}
/** 为未分发的设备设置分组 */
function equipmentGroup_migratoryEquipment_post(opts) {
  return request({
    method: 'post',
    url: '/equipmentGroup/migratoryEquipment/' + store.getters.token,
    data: {
      equipment_ids: opts.equipmentIds,
      equipment_group_id: opts.groupId
    }
  })
}

/** 设置网络白名单，调用该方法之前应先将设置的白名单生成的文件上传至服务器，将url传入 */
function equipment_setNetWriteMQList_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/setNetWriteMQList/' + store.getters.token,
    opts: opts
  })
}
/** 设备解绑 */
function equipment_unBindMQEquipment_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/unBindMQEquipment/' + store.getters.token,
    data: {
      equipmentCode: opts.equipmentCode,
      equipment_group_id: opts.equipment_group_id
    },
    params: {
      validTime: opts.validTime,
      parentTopic: opts.parentTopic

    }
  })
}
/** 设备解绑私有云权限 */
function equipment_unBindMQEquipmentLocal_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/unBindMQEquipmentLocal/' + store.getters.token,
    data: {
      equipmentCode: opts.equipmentCode
    },
    params: {
      validTime: opts.validTime,
      parentTopic: opts.parentTopic

    }
  })
}
/** 私有云根据用户id或者用户分组id设备解绑*/
function equipment_unBindMQEquipmentLocalUser_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/unBindMQEquipmentLocalUser/' + store.getters.token,
    data: {
      user_id: opts.user_ids,
      user_group_id: opts.user_group_id
    },
    params: {
      validTime: opts.validTime,
      parentTopic: opts.parentTopic

    }
  })
}

/** 设备解锁 */
function equipment_unRockMQEquipment_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/unRockMQEquipment/' + store.getters.token,
    data: {
      equipmentCode: opts.equipmentCode,
      equipment_group_id: opts.equipment_group_id
    },
    params: {
      validTime: opts.validTime,
      parentTopic: opts.parentTopic

    }
  })
}
/** 设备解锁私有云权限 */
function equipment_unRockMQEquipmentLocal_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/unRockMQEquipmentLocal/' + store.getters.token,
    data: {
      equipmentCode: opts.equipmentCode
    },
    params: {
      validTime: opts.validTime,
      parentTopic: opts.parentTopic

    }
  })
}
/** 私有云根据用户id或者用户分组id设备重解锁*/
function equipment_unRockMQEquipmentLocalUser_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/unRockMQEquipmentLocalUser/' + store.getters.token,
    data: {
      user_id: opts.user_ids,
      user_group_id: opts.user_group_id
    },
    params: {
      validTime: opts.validTime,
      parentTopic: opts.parentTopic

    }
  })
}
/** 设备在进行完控制台对 移动端调用 设备的即时行操作之后3:解锁4:锁定 5:解绑 */
function equipment_updateEquipmentState_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/updateEquipmentState',
    opts: opts
  })
}

/** 修改设备分组下的设备 */
function equipmentGroup_changeEquipmentGroup_post(opts) {
  return request({
    method: 'post',
    url: '/equipmentGroup/changeEquipmentGroup/' + store.getters.token,
    data: {
      equipmentIds: opts.equipmentIds
    },
    params: {
      oldGroupId: opts.oldGroupId,
      newGroupId: opts.newGroupId
    }
  })
}

/** 设备关机 */
function equipment_closeMQEquipment_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/closeMQEquipment/' + store.getters.token,
    data: {
      equipmentCode: opts.equipmentCode,
      equipment_group_id: opts.equipment_group_id
    },
    params: {
      endTime: opts.endTime,
      validTime: opts.validTime,
      parentTopic: opts.parentTopic

    }
  })
}
/** 设备关机权限私有云*/
function equipment_closeMQEquipmentLocal_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/closeMQEquipmentLocal/' + store.getters.token,
    data: {
      equipmentCode: opts.equipmentCode
    },
    params: {
      validTime: opts.validTime,
      parentTopic: opts.parentTopic

    }
  })
}
/** 私有云根据用户id或者用户分组id设备重关机*/
function equipment_closeMQEquipmentUser_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/closeMQEquipmentUser/' + store.getters.token,
    data: {
      user_id: opts.user_ids,
      user_group_id: opts.user_group_id
    },
    params: {
      endTime: opts.endTime,
      validTime: opts.validTime,
      parentTopic: opts.parentTopic

    }
  })
}
/** 根据分组id删除在设备分组中的设备id */
function equipmentGroup_deleteEquipmentForGroup_post(opts) {
  return request({
    method: 'post',
    url: '/equipmentGroup/deleteEquipmentForGroup',
    opts: opts
  })
}
/** 根据设备分组Id删除设备分组 */
function equipmentGroup_deleteEquipmentGroupById_groupId_get(equipment_group_id) {
  return request({
    method: 'get',
    url: '/equipmentGroup/deleteEquipmentGroupById/' + equipment_group_id + '/' + store.getters.token
  })
}

/** 对新的设备型号进行登记 */
function equipmentModel_enrollmentEquipmentModel_post(opts) {
  return request({
    method: 'post',
    url: '/equipmentModel/enrollmentEquipmentModel/' + store.getters.token,
    data: {
      equipment_model_name: opts.equipment_model_name, // 设备型号name
      ram: opts.ram, // 内存
      frequency: opts.frequency, // 主屏
      battery_capacity: opts.battery_capacity, // 电池容量
      front_camera: opts.front_camera, // 前置摄像头
      rear_camera: opts.rear_camera, // 后置摄像头
      blue_tooth: opts.blue_tooth, // 蓝牙
      resolution: opts.resolution, // 分辨率
      wifi: opts.wifi, // wifi
      usb: opts.usb, // usb
      operate_system: opts.operate_system, // 系統
      converse: opts.converse,
      create_time: opts.create_time,
      equipment_model_code: opts.equipment_model_code,
      equipment_model_id: opts.equipment_model_id,
      manufacturer: opts.manufacturer,
      remark: opts.remark,
      update_time: opts.update_time

    }
  })
}

/** 对设备上自带的功能的禁用和启用 */
function equipment_manageEquipmentConfig_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/manageEquipmentConfig/' + store.getters.token,
    data: opts
  })
}
/** 权限私有云 对设备上自带的功能的禁用和启用 */
function equipment_manageEquipmentConfigLocal_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/manageEquipmentConfigLocal/' + store.getters.token,
    params: {
      parentTopic: opts.parentTopic
    },
    data: {
      equipment_group_id: opts.equipment_group_id,
      equipmentCode: opts.equipmentCode,
      config: opts.config
    }
  })
}
/** 对设备上自带的功能的禁用和启用 */
function equipment_manageEquipmentConfig_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/manageEquipmentConfig/' + store.getters.token,
    params: {
      parentTopic: opts.parentTopic
    },
    data: {
      equipment_group_id: opts.equipment_group_id,
      equipmentCode: opts.equipmentCode,
      config: opts.config
    }
  })
}
/** 权限私有云用户 对设备上自带的功能禁用和启用上 */
function equipment_manageEquipmentConfigLocalUser_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/manageEquipmentConfigLocalUser/' + store.getters.token,
    params: {
      parentTopic: opts.parentTopic
    },
    data: {
      user_group_id: opts.user_group_id,
      user_id: opts.user_id,
      config: opts.config
    }
  })
}

/** 修改设备分组 */
function equipmentGroup_modifyEquipmentGroupById_post(equipment_group_id, equipment_group_name) {
  return request({
    method: 'post',
    url: '/equipmentGroup/modifyEquipmentGroupById/' + store.getters.token,
    data: {
      equipment_group_id,
      equipment_group_name
    }
  })
}

/** 应用推送，调用该方法之前应先将应用文件上传至服务器，将url传入 */
function equipment_pushApplicationMQ_post(opts) {
  return request({
    method: 'post',
    url: '/equipment/pushApplicationMQ',
    opts: opts
  })
}

/** 新增设备分组，已存在的分组不能新增 */
function equipmentGroup_addEquipmentGroup_post(opts) {
  return request({
    method: 'post',
    url: '/equipmentGroup/addEquipmentGroup/' + store.getters.token,
    params: opts
  })
}

/** 对已经登记在库的设备型号进行修改 */
// function equipmentModel_updateEquipmentModel_token_post(opts) {
//   return request({
//     method: 'post',
//     url: '/equipmentModel/updateEquipmentModel/' + opts.equipment_mode + '/' + opts.getters.token,
//     data: {
//       equipment_mode: opts.equipment_model_name
//     }
//   })
// }

/** 对新的设备型号进行登记 */
function equipmentModel_enrollmentEquipmentModel_token_post(opts) {
  return request({
    method: 'post',
    url: convertRESTAPI('/equipmentModel/enrollmentEquipmentModel/{token}', opts),
    opts: opts
  })
}

/** 对已经进行登记的设备型号进行查询 */
function equipmentModel_queryEquipmentModel_token_get(opts) {
  return request({
    method: 'get',
    url: '/equipmentModel/queryEquipmentModel/' + store.getters.token,
    params: { equipment_model_name: opts }
  })
}

/** 删除已经进行登记的设备型号 */
function equipmentModel_deleteEquipmentModel_equipment_model_id_token(opts) {
  return request({
    method: 'post',
    url: '/equipmentModel/deleteEquipmentModel/' + store.getters.token,
    data: { equipment_model_id: opts }
  })
}
/** 修改型号管理 */
function equipmentModel_updateEquipmentModel_token_post(opts) {
  return request({
    method: 'post',
    url: 'equipmentModel/updateEquipmentModel/' + store.getters.token,
    data: opts
  })
}
/** 删除设备型号 */
// function equipmentModel_deleteEquipmentModel_equipment_model_id_token(opts) {
//   return request({
//     method: 'get',
//     url: '/equipmentModel/deleteEquipmentModel/' + opts + '/' + store.getters.token,
//     params: opts
//   })
// }
/** 根据设备分组id添加网络白名单 */
function equipment_setNetWriteMQList_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/setNetWriteMQList/' + store.getters.token,
    data: {
      NetList: opts.NetList,
      equipment_group_id: opts.equipment_group_id

    },
    params: {
      parentTopic: opts.parentTopic

    }
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    // }
  })
}
/** 家长根据设备id添加网络白名单 */
function equipment_setNetWriteMQList(opts) {
  return request({
    method: 'post',
    url: '/equipment/setNetWriteMQList/' + store.getters.token,
    data: {
      NetList: opts.NetList,
      equipmentCode: opts.equipmentCode

    },
    params: {
      parentTopic: opts.parentTopic

    }
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    // }
  })
}
/** 私有云根据用户分组ID添加网络白名单 */
function equipment_setNetWriteListLocalUser_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/setNetWriteListLocalUser/' + store.getters.token,
    data: {
      NetList: opts.NetList,
      user_group_id: opts.user_group_id
    },
    params: {
      parentTopic: opts.parentTopic

    }
  })
}
/** 私有云根据用户分组ID删除白名单 */
function equipment_deleteNetWriteMQListLocalUser_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/deleteNetWriteMQListLocalUser/' + store.getters.token,
    data: {
      user_group_id: opts.user_group_id,
      NetList: opts.NetList
    },
    params: {
      parentTopic: opts.parentTopic

    }
  })
}
/** 删除白名单 groupID
equipmentCode 两个都为空则作用全校，公网则作用全网 */
function equipment_deleteNetWriteMQList_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/deleteNetWriteMQList/' + store.getters.token,
    data: {
      equipment_group_id: opts.equipment_group_id,
      NetList: opts.NetList
    },
    params: {
      parentTopic: opts.parentTopic

    }
  })
}

/** 删除白名单 ,根据设备分组或设备唯一标识符进行删除
两者同时为空时则作用全部设备 */
function equipment_deleteNetWriteMQListLocal_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/deleteNetWriteMQListLocal/' + store.getters.token,
    data: {
      equipment_group_id: opts.equipment_group_id,
      equipmentCode: opts.equipmentCode,
      NetList: opts.NetList
    },
    params: {
      parentTopic: opts.parentTopic

    }
  })
}
/** 家长根据设备Id删除网络白名单 */
// function equipmentid_deleteNetWriteMQListLocal_token(opts) {
//   return request({
//     method: 'post',
//     url: '/equipment/deleteNetWriteMQListLocal/' + store.getters.token,
//     data: {
//       equipmentCode: opts.equipmentCode,
//       NetList: opts.NetList
//     },
//     params: {
//       parentTopic: opts.parentTopic

//     }
//   })
// }
/** 根据设备分组或设备唯一标识符查询设备上默认应用或默认硬件的禁用与启用状态
允许查询多个分组或设备，返回数据中字段status_bool true为开false为关，null 为有开有关使用三态框显示*/
function equipment_queryConfigList_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/queryConfigList/' + store.getters.token,
    data: {
      equipment_group_ids: opts.equipment_group_ids,
      equipmentCodes: opts.equipmentCodes
    },
    params: {
      configuration_item_type: opts.configuration_item_type

    }
  })
}
/** 查询用户的设备(可以存在多个设备)或用户分组已经设置默认 应用的状态以及禁用的硬件状态，设备的usb等的状态
允许查询多个分组或用户，返回数据中字段status_bool true为开false为关，null 为有开有关使用三态框显示 */
function equipment_queryConfigListLocalUser_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/queryConfigListLocalUser/' + store.getters.token,
    data: {
      user_group_ids: opts.user_group_ids,
      user_ids: opts.user_ids
    },
    params: {
      parentTopic: opts.parentTopic,
      configuration_item_type: opts.configuration_item_type

    }
  })
}
// /** 根据设备分组或设备唯一标识符对设备上已经推送的APK进行查询。 */
// function equipment_queryAPKEquipmentGroup_token() {
//   return request({
//     method: 'get',
//     url: '/equipment/queryAPKEquipmentGroup/' + store.getters.token,
//     params: {
//       parentTopic:opts.parentTopic,
//       equipment_group_id:opts.equipment_group_id
//     }
//   })
// }
/** 根据设备分组id查询已经推送的应用信息 */
function equipment_queryAPKEquipmentGroup_token(opts) {
  return request({
    method: 'get',
    url: 'equipment/queryEquipmentAPKList/' + store.getters.token,
    params: { equipment_group_id: opts.equipment_group_id, parentTopic: opts.parentTopic }
  })
}
/** 备用更加设备分组id查询已经推送的应用信息*/
function equipment_queryAPKList_token(opts) {
  return request({
    method: 'get',
    url: 'equipment/queryAPKEquipmentGroup/' + store.getters.token,
    params: { equipment_group_id: opts.equipment_group_id, parentTopic: opts.parentTopic }
  })
}
/** 根据用户分组或用户ID对设备上已经推送的APK进行查询。 */
function equipment_queryAPKUserGroup_token(opts) {
  return request({
    method: 'get',
    url: '/equipment/queryUserAPKList/' + store.getters.token,
    params: {
      parentTopic: opts.parentTopic,
      user_group_id: opts.user_group_id
    }
  })
}
/** 根据设备分组或设备唯一标识符对设备上已经安装的应用进行卸载（仅限推送至设备的软件,连接本地MQTT） */
function equipment_unInstallAppEquipmentGroupLocal_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/unInstallAppEquipmentGroupLocal/' + store.getters.token,
    data: { equipment_group_id: opts.equipment_group_id, file_id: opts.file_id }
  })
}
/** 根据设备分组或设备唯一标识符对设备上已经安装的应用进行卸载（仅限推送至设备的软件,连接本地MQTT） */
function equipment_unInstallAppEquipmentGroup_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/unInstallAppEquipmentGroup/' + store.getters.token,
    data: { equipment_group_id: opts.equipment_group_id, file_id: opts.file_id }
  })
}
/** 根据设备分组或设备唯一标识符对设备上已经安装的应用进行卸载（仅限推送至用户设备的软件,连接本地MQTT） */
function equipment_unInstallAppUserGroupLocal_token(opts) {
  return request({
    method: 'post',
    url: '/equipment/unInstallAppUserGroupLocal/' + store.getters.token,
    data: {
      user_group_id: opts.user_group_id, file_id: opts.file_id
    }
  })
}
export {
  // 设备分组
  equipmentGroup_migratoryEquipment_post,
  equipmentGroup_deleteEquipmentForGroup_post,
  equipmentGroup_deleteEquipmentGroupById_groupId_get,
  equipmentGroup_changeEquipmentGroup_post,
  equipmentGroup_modifyEquipmentGroupById_post,
  equipmentGroup_queryEquipmentsForGroup_token,
  equipmentGroup_queryEquipmentGroup_get,
  equipmentGroup_addEquipmentGroup_post,
  // 设备
  equipment_queryEquipment_pageNo_pageSize_equipmentID_get,
  equipment_rebootMQEquipment_post,
  equipment_resetMQEquipment_post,
  equipment_rockMQEquipment_post,
  equipment_unRockMQEquipment_post,
  equipment_unBindMQEquipment_token,
  equipment_unBindMQEquipmentLocal_token,
  equipment_unBindMQEquipmentLocalUser_token,
  equipment_updateEquipmentState_post,
  equipment_closeMQEquipment_post,
  equipmentModel_enrollmentEquipmentModel_post,
  equipment_manageEquipmentConfig_post,
  equipment_pushApplicationMQ_post,
  equipment_queryEquipmentConfigAPP_pageNo_pageSize_equipmentID_get,
  equipment_closeMQEquipmentLocal_post,
  equipment_unRockMQEquipmentLocal_post,
  equipment_rockMQEquipmentLocal_post,
  equipment_resetMQEquipmentLocal_post,
  equipment_rebootMQEquipmentLocal_post,
  equipment_queryAPKEquipmentGroup_token,
  equipment_queryWriteNetList_token,
  equipment_setNetWriteMQList_token,
  equipment_setNetWriteMQList,
  equipment_rebootMQEquipmentLocalUser_post,
  equipment_resetMQEquipmentLocalUser_post,
  equipment_rockMQEquipmentLocalUser_post,
  equipment_unRockMQEquipmentLocalUser_post,
  equipment_closeMQEquipmentUser_token,
  equipment_setNetWriteListLocalUser_token,
  equipment_deleteNetWriteMQListLocalUser_token,
  equipment_manageEquipmentConfigLocal_post,
  equipment_manageEquipmentConfig_token,
  equipment_manageEquipmentConfigLocalUser_token,
  equipment_setNetWriteMQList_post,
  equipment_queryConfigList_token,
  equipment_queryConfigListLocalUser_token,
  equipment_deleteNetWriteMQList_token,
  equipment_deleteNetWriteMQListLocal_token,
  equipment_restoreMQEquipmentUser,
  equipment_restoreMQEquipment,
  equipment_queryAPKUserGroup_token,
  equipment_queryAPKList_token,
  equipment_unInstallAppEquipmentGroupLocal_token,
  equipment_unInstallAppEquipmentGroup_token,
  equipment_unInstallAppUserGroupLocal_token,
  // 设备型号
  equipmentModel_updateEquipmentModel_token_post,
  equipmentModel_enrollmentEquipmentModel_token_post,
  equipmentModel_queryEquipmentModel_token_get,
  equipmentModel_deleteEquipmentModel_equipment_model_id_token

}
