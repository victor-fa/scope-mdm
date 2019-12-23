const getters = {
  language: state => state.app.language,
  token: state => state.user.token,
  name: state => state.user.name,
  routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  roles: state => state.user.roles,
  teachingClass: state => state.user.teachingClass,
  childrenInfoOptions: state => state.user.childrenInfoOptions,
  lockPasswd: state => state.user.lockPasswd,
  isLock: state => state.user.isLock,
  browserHeaderTitle: state => state.user.browserHeaderTitle
}
export default getters
