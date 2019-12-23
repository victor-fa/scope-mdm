
// 时间戳格式化
import i18n from '@/lang'
// 得到字符串的长度
function GetLength(str) {
  // /<summary>获得字符串实际长度，中文2，英文1</summary>
  // /<param name="str">要获得长度的字符串</param>
  var realLength = 0
  const len = str.length
  var charCode = -1
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i)
    if (charCode >= 0 && charCode <= 128) realLength += 1
    else realLength += 2
  }
  return realLength
}
function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
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
// 循环向数组里面添加属性
function iterationAddParmentTrue(data) {
  for (var j = 0; j < data.length; j++) {
    data[j].isBoolean = true
  }
}
// 将时间戳转换成日期格式：
function timestampToTime(timestamp) {
  // var date = new Date(timestamp * 1000)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var date = new Date(timestamp)
  const Y = date.getFullYear() + '-'
  const M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  const D = date.getDate() + ' '
  const h = date.getHours() + ':'
  const m = date.getMinutes() + ':'
  const s = date.getSeconds()
  return Y + M + D + h + m + s
}

function formatType(row) {
  if (row.type === 1) {
    // 订阅列表
    return i18n.t('pushMg.Subscriptionlist ')
  }
  if (row.type === 2) {
    // 应用商店
    return i18n.t('pushMg.APPStore')
  }
  if (row.type === 3) {
    // 内容仓库
    return i18n.t('pushMg.ContentStore')
  }
  if (row.type === 4) {
    // 设备组
    return i18n.t('pushMg.Devicegroup')
  }
  if (row.type === 5) {
    // 设备
    return i18n.t('pushMg.Devicenamex')
  }
  if (row.type === 6) {
    // 用户组
    return i18n.t('pushMg.Usergroup')
  }
  if (row.type === 7) {
    // 用户
    return i18n.t('pushMg.User')
  }
}
// // // el-tag类型转换
// function RemrkFilter(remarks) {
//   const statusMap = {
//     1: 'success',
//     2: 'info',
//     0: 'danger'

//   }
//   return statusMap[remarks]
// }

// function formatRemark(remarks) {
//   const statusMap = {
//     1: '成功',
//     2: '账号已存在',
//     0: '失败'
//   }
//   return statusMap[remarks]
// }
function formatPrivateCloludState(row, column) {
  if (row.state === 1) {
    // 不可用
    return i18n.t('clientMg.Unavailable ')
  }
  if (row.state === 2) {
    // 未绑定
    return i18n.t('clientMg.Unbind ')
  }
  if (row.state === 3) {
    // 在线
    return i18n.t('clientMg.Online ')
  }
  if (row.state === 4) {
    // 在线
    return i18n.t('clientMg.Offline ')
  }
  if (row.state === 5) {
    // 异常
    return i18n.t('clientMg.Unusable ')
  }
  if (row.state === 6) {
    // 可用
    return i18n.t('clientMg.Usable ')
  }
}
function formatContentTypeCode(row, column) {
  if (row.content_type_code === 1) {
    // 文件
    return i18n.t('content.File')
  } if (row.content_type_code === 2) {
    // app
    return i18n.t('content.APP')
  }
}
// 获取当前日期
// function getdataTime(row) {
//   var date = new Date()
//   var year = date.getFullYear() // 获取年
//   var month = date.getMonth() + 1// 获取月
//   var day = date.getDate() // 获取当日
//   return year + '-' + month + '-' + day
// }
// // 操作日志状态
// function LogStateFilter(Status) {
//   const statusMap = {
//     2: 'success',
//     1: 'info'

//   }
//   return statusMap[Status]
// }
// function formatLogStata(Status) {
//   const statusMap = {
//     1: '失败',
//     2: '成功'
//   }
//   return statusMap[Status]
// }

// // 格式化设备状态
// function EquipmentState(State) {
//   const statusMap = {
//     1: 'info',
//     2: 'success',
//     3: 'danger'
//   }
//   return statusMap[State]
// }
// function formatEquipmentState(State) {
//   const statusMap = {
//     1: '未激活',
//     2: '已激活',
//     3: '锁定'
//   }
//   return statusMap[State]
// }
export {
  timestampToTime,
  formatType,
  // formatRemark,
  // RemrkFilter,
  formatPrivateCloludState,
  // formatLogStata,
  // LogStateFilter,
  formatContentTypeCode,
  // formatEquipmentState,
  // EquipmentState,
  parseTime,
  iterationAddParmentTrue,
  GetLength
}
