import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import {
  setTitle
} from '@/utils/util' // 设置浏览器头部标题
import i18n from '@/lang'
NProgress.configure({
  showSpinner: false
}) // NProgress Configuration
const whiteList = ['/login', '/authredirect', '/resetPassword'] // 不重定向白名单
const lockPage = '/lock' // 锁屏page
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) { // 判断是否有token
    // 设置浏览器头部标题
    const browserHeaderTitle = to.name
    store.commit('SET_BROWSERHEADERTITLE', {
      browserHeaderTitle: browserHeaderTitle
    })
    if (store.getters.isLock && to.path !== lockPage) {
      next({
        path: lockPage
      })
      NProgress.done()
    } else if (to.path === '/login') {
      next()
      NProgress.done()
      // 校长页面
    } else if (to.path === '/headMastersManagement') {
      next()
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          const roles = res.result.role_codes // note: roles must be a array! such as: ['editor','develop']
          if (store.getters.roles[0] === 9) {
            // 校长页面
            next({ path: '/headMastersManagement' })
            NProgress.done()
            return false
          }
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(i18n.t('message.Loginfailedpleaseloginagain'))
            next({ path: '/login' })
            NProgress.done()
          })
        })
      } else {
        if (store.getters.roles[0] === 9) {
          next('/headMastersManagement')
          NProgress.done()
        }
        const browserHeaderTitle = to.name
        store.commit('SET_BROWSERHEADERTITLE', {
          browserHeaderTitle: browserHeaderTitle
        })
        next() // 当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
        NProgress.done()
      }
    }
  } else {
    // 设置浏览器头部标题
    const browserHeaderTitle = to.name
    store.commit('SET_BROWSERHEADERTITLE', {
      browserHeaderTitle: browserHeaderTitle
    })
    if (whiteList.indexOf(to.path) !== -1) {
      next()
      NProgress.done()
      // 重置密码
    } else if (to.path.includes('/resetPassword')) {
      next()
      NProgress.done()
      // 家长绑定学生
    } else if (to.path.includes('/ParentsBindStudents')) {
      next()
      NProgress.done()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})
router.afterEach((to, from) => {
  NProgress.done()
  setTimeout(() => {
    const browserHeaderTitle = store.getters.browserHeaderTitle
    setTitle(browserHeaderTitle)
  }, 0)
})

