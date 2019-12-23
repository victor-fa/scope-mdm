// 替换excel里面的中文数据为英文
export function replaceExcelZhToEn(arr) {
  // 替换姓名为name
  var replaceName = JSON.parse(
    JSON.stringify(arr).replace(/姓名/g, 'user_name')
  )
  // 替换账号为Login_account
  var replaceLogin_account = JSON.parse(
    JSON.stringify(replaceName).replace(/账号/g, 'login_account')
  )
  // 替换密码为Password
  return JSON.stringify(
    replaceLogin_account
  ).replace(/密码/g, 'password')
}
