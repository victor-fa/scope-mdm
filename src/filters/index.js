import i18n from '@/lang'
import { GetLength } from '@/utils/format'
// 时间戳转换为时间格式
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }

  if ((time + '').length === 10) {
    time = +time * 1000
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    date = new Date(parseInt(time))
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
// 状态显示转换
export function formatCheckStata(status) {
  const statusMap = {
    1: i18n.t('checkMg.Publishing'),
    2: i18n.t('checkMg.Authorizing'),
    3: i18n.t('checkMg.Approved'),
    4: i18n.t('checkMg.NotAlloweds'),
    5: i18n.t('checkMg.Publishsuccssed'),
    6: i18n.t('checkMg.Publishfailed')
  }
  return statusMap[status]
}
// el-tag类型转换
export function statusFilter(status) {
  const statusMap = {
    2: 'info',
    4: 'danger',
    5: 'success'
  }
  return statusMap[status]
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}
// 格式化用户列表的绑定设备数量列
export function formatBindDeviceNum(equipment_codeArray) {
  if (equipment_codeArray === '' || equipment_codeArray === undefined) {
    return i18n.t('userMg.Null')
  } else {
    return equipment_codeArray.length
  }
}
// 格式化设备列表绑定人
export function formatBindDeviceUser(user_name) {
  if (user_name === '' || user_name === undefined) {
    return i18n.t('userMg.Null')
  } else {
    return user_name
  }
}
// 判断设备是否在线
export function formatBindDeviceonlie(online) {
  if (online === true) {
    return i18n.t('equipmentMg.Online')
  } else if (online === false) {
    return i18n.t('equipmentMg.Offline')
  }
}
// 格式化设备状态
export function EquipmentState(State) {
  const statusMap = {
    1: 'info',
    2: 'success',
    3: 'danger'
  }
  return statusMap[State]
}
export function formatEquipmentState(State) {
  const statusMap = {
    1: i18n.t('equipmentMg.Inactivated'),
    2: i18n.t('equipmentMg.Activated'),
    3: i18n.t('equipmentMg.Locked')
  }
  return statusMap[State]
}
export function substringFile_name(fileName) {
  if (GetLength(fileName) >= 18) {
    return fileName.substring(0, 18) + '...'
  } else {
    return fileName
  }
}
// 操作日志状态
export function LogStateFilter(Status) {
  const statusMap = {
    2: 'success',
    1: 'info'
  }
  return statusMap[Status]
}
export function formatLogStata(Status) {
  const statusMap = {
    1: i18n.t('systemMg.Failed'),
    2: i18n.t('systemMg.Successed')
  }
  return statusMap[Status]
}
// el-tag类型转换
export function RemrkFilter(remarks) {
  const statusMap = {
    1: 'success',
    2: 'info',
    0: 'danger'
  }
  return statusMap[remarks]
}

export function formatRemark(remarks) {
  const statusMap = {
    1: i18n.t('userMg.Success'),
    2: i18n.t('userMg.Theaccounthasalreadyexist'),
    3: i18n.t('userMg.Incorrectrole'),
    0: i18n.t('userMg.Failed')
  }
  return statusMap[remarks]
}
// 计算表达式的值
// Js 代替eval的方法
function evil(fn) {
  var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)()
}
// 文件b格式化成MB.
export function fileSizeConventMB(params) {
  if (params === undefined) {
    return i18n.t('userMg.Null')// 无
  } else if (params < 1024) {
    return params + 'B'
  } else if (params < 1024 * 1024) {
    return evil(params / 1024).toFixed(2) + 'KB'
  } else {
    return evil(params / (1024 * 1024)).toFixed(2) + 'MB'
  }
}

// export function formatType(row, column) {
//   if (row.type === 1) {
//     return '订阅列表 '
//   }
//   if (row.type === 2) {
//     return '应用商店 '
//   }
//   if (row.type === 3) {
//     return '内容仓库  '
//   }

//   if (row.type === 4) {
//     return '设备组 '
//   }
//   if (row.type === 5) {
//     return '设备  '
//   }
//   if (row.type === 6) {
//     return '用户组   '
//   }
//   if (row.type === 7) {
//     return '用户  '
//   }
// }
