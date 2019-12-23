import i18n from '@/lang'
import { Message } from 'element-ui'
// 判断文件上传错误提示并返回中英文
export function uploadFileRespError(errorMessage) {
  if (errorMessage === 'Unnamed package name') {
    Message.error(i18n.t('message.Packagenamedoesntexist'))
  } else if (errorMessage === 'Please upload the APK file') {
    Message.error(i18n.t('message.PleaseuploadtheAPKfile'))
  } else if (errorMessage === 'file name is not available') {
    Message.error(i18n.t('message.Uploadfailedthefilenamehasalreadyexist'))
  } else if (errorMessage === 'Version cannot be empty') {
    Message.error(i18n.t('content.TheVersionNumberIsnotEmpty'))
  } else if (errorMessage === 'Please upload the ZIP file') {
    Message.error(i18n.t('content.PleaseUploadTheZIPFile'))
  } else {
    Message.error(i18n.t('message.Uploadingfailed'))
  }
}
// 判断找回密码错误信息提示
export function retrievePasswordError(errorMessage) {
  if (errorMessage === 'Account number does not exist ') {
    Message.error(i18n.t('RetrievePassword.Invalidaccount'))
  } else if (errorMessage === 'Unbound mailbox') {
    Message.error(i18n.t('RetrievePassword.TheEmaildoesntexist'))
  }
}
// 判断家长绑定学生错误信息提示
export function parentsBindStudentsError(errorMessage) {
  if (errorMessage === 'login_account, password and equipment_code cannot be empty ') {
    Message.error(i18n.t('ParentsBindStudents.Accountpasswordanddevicenumbershouldnotbenull'))
  } else if (errorMessage === 'account or password error') {
    Message.error(i18n.t('ParentsBindStudents.Incorrectaccountorpassword'))
  } else if (errorMessage === 'equipment_code set exception') {
    Message.error(i18n.t('ParentsBindStudents.DeviceNodoesntexist'))
  }
}
// 远程删除文件判断
export function parentsFiles(errorMessage) {
  if (errorMessage === 'file or directory does not exist') {
    Message.error('文件或目录不存在')
  } else if (errorMessage === 'operation failed') {
    Message.error(i18n.t('操作失败'))
  } else if (errorMessage === 'response timeout') {
    Message.error('响应超时')
  }
}
