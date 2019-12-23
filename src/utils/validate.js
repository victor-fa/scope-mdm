
import Vue from 'vue'
import valdatei18n from '@/lang'

/* 添加白名单合法uri*/
export function validateURL(textval) {
  // const urlregex = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g
  // return urlregex.test(textval)
}

// 判断不能同时选择设备id和设备分组id
export function isEquipmentGropu_idNotAll(oneArray, groupArray) {
  if (oneArray.length > 0 && groupArray.length > 0) {
    Vue.prototype.$message({
      message: valdatei18n.t('validate.IndividualAndGroupingCannotBeSelectedAtTheSameTime'),
      type: 'error'
    })
    return false
  } else {
    return true
  }
}
// 判断不能同时选择班级id和用户id
export function isTbehavior_idNotAll(oneArray, groupArray) {
  if (oneArray.length > 0 && groupArray.length > 0) {
    Vue.prototype.$message({
      message: valdatei18n.t('validate.IndividualAndGroupingCannotBeSelectedAtTheSameTime'),
      type: 'error'
    })
    return false
  } else {
    return true
  }
}
/* 文件只能是Apk格式且不超过500M */
export function valideFileNameAndSize(file) {
  const isApp = /\.(apk|ipa)$/.test(file.name)
  const isLt500M = file.size / 1024 / 1024 < 500

  if (!isApp) {
    // this.$message.error(
    //   this.$t('pushMg.OnlysupportAPKorIPAformat')
    // )
    Vue.prototype.$message({
      message: valdatei18n.t('pushMg.OnlysupportAPKorIPAformat'),
      type: 'error'
    })
  }
  if (!isLt500M) {
    // this.$message.error(
    //   this.$t('pushMg.Filesizemustlessthan500Mbits')
    // )
    Vue.prototype.$message({
      message: valdatei18n.t('pushMg.Filesizemustlessthan500Mbits'),
      type: 'error'
    })
  }
  return isApp && isLt500M
}
/* 文件只能是Zip且版本不能为空格式 */
export function valideFileNameZip(file, DevType, LatestVersion, NewestVersion) {
  console.log('输出是' + DevType)
  const isZip = /\.(zip)$/.test(file.name)
  if (DevType === '') {
    Vue.prototype.$message({
      message: valdatei18n.t('content.Pleasechoosethemodel'),
      type: 'error'
    })

    return false
  } else if (LatestVersion === '') {
    Vue.prototype.$message({
      message: valdatei18n.t('content.Pleaseentertheversionnumberbeforetheupdate'),
      type: 'error'
    })
    return false
  } else if (NewestVersion === '') {
    Vue.prototype.$message({
      message: valdatei18n.t('content.Pleaseentertheupdatedversionnumber'),
      type: 'error'
    })
    return false
  } else if (!isZip) {
    Vue.prototype.$message({
      message: valdatei18n.t('content.PleaseUploadTheZIPFile'),
      type: 'error'
    })
  }
  return isZip
}
/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}
/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (typeof val === 'boolean') {
    return false
  }
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (val === 'null' || val == null || val === 'undefined' || val === undefined || val === '') return true
    return false
  }
  return false
}
/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

