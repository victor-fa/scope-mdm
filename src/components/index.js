
function plugin(Vue) {
  if (plugin.installed) {
    return
  }
  Vue.component('uploadExcelComponent', () => import('@/components/UploadExcel/index.vue'))
  Vue.component('themepicker', () => import('@/components/ThemePicker/index.vue'))
  Vue.component('skinComp', () => import('@/components/skin/index.vue'))
  Vue.component('langSelect', () => import('@/components/LangSelect/index.vue'))
  Vue.component('countUp', () => import('@/components/count-up/index.vue'))
  Vue.component('topLock', () => import('@/components/common/top/top-lock.vue'))
  Vue.component('theFoot', () => import('@/components/common/TheFoot.vue'))
  Vue.component('theHeader', () => import('@/components/common/TheHeader.vue'))
  Vue.component('theMeanconten', () => import('@/components/common/TheMeanConten.vue'))
  Vue.component('theBreadcrumb', () => import('@/components/common/TheBreadcrumb.vue'))
  Vue.component('help', () => import('@/components/help/index.vue'))
}

export default plugin
