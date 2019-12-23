// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'babel-polyifill'
import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

import '../static/css/iconfont/1.0.0/index.css' /* icofont*/

import '../static/css/app.css' // global index css

import '../static/css/dialogcommon.scss' // global dialogcommon css

// svg图标
import '@/icons' // icon

import store from './store'

import App from './App'

import '@/permission' // permission control

import router from './router' // router

import axios from 'axios'

// 引入全局注册的组件
import components from '@/components'

import qs from 'qs'

// global filters
import * as filters from './filters'

// Internationalization
import i18n from './lang'

import { global } from '@/global/global'

import Router from 'vue-router'

Vue.use(Router)
// 阿里矢量图标
// import {
//   iconfontUrl,
//   iconfontVersion
// } from '@/config/env'
// import {
//   loadStyle
// } from './utils/util'
// import VeeValidate from 'vee-validate'
// Vue.use(VeeValidate)
// import './mock' // simulation data
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.use(ElementUI, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// 注冊全局组件
Vue.use(components)

// https://docs.fundebug.com/notifier/javascript/integration/npm.html
var fundebug = require('fundebug-javascript')
fundebug.apikey = 'd6bedd7670886ec99e90d1205d1a53e389b9b144cdd16907d68c6c8cadd89066'

// https://docs.fundebug.com/notifier/javascript/framework/vuejs.html
function formatComponentName(vm) {
  if (vm.$root === vm) return 'root'

  var name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name
  return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '')
}

Vue.config.errorHandler = function(err, vm, info) {
  var componentName = formatComponentName(vm)
  var propsData = vm.$options && vm.$options.propsData

  fundebug.notifyError(err,
    {
      metaData:
      {
        componentName: componentName,
        propsData: propsData,
        info: info
      }
    })
}

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 加载用户主题
if (localStorage.getItem('themeValue')) {
  global.changeTheme(localStorage.getItem('themeValue'))
} else {
  global.changeTheme('default')
}
// iconfontVersion.forEach(ele => {
//   loadStyle(iconfontUrl.replace('$key', ele))
// })
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  // components: { App },
  // template: '<App/>'
  render: h => h(App)
})

