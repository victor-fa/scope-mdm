import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import elementesLocale from 'element-ui/lib/locale/lang/es'// element-ui lang
import enLocale from '@/lang/en'
import zhLocale from '@/lang/zh'
import esLocale from '@/lang/es'
import { mount } from 'vue-test-utils'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  },
  es: {
    ...esLocale,
    ...elementesLocale
  }
}
const app = {
  state: {
    language: 'zh',
    roles: []
  },
  // mutations: {
  //   SET_LANGUAGE: jest.fn()
  // },
  actions: {
    login: jest.fn(() => Promise.resolve({
      code: 1,
      message: '登录成功',
      result: ''
    }))
      .mockImplementationOnce(() => Promise.resolve({
        code: 0,
        message: '登录失败',
        result: ''
      }))
  }
}
const getters = {
  language: state => state.app.language,
  roles: state => state.app.roles
}

const store = new Vuex.Store({
  modules: {
    app
  },
  getters
})

const i18n = new VueI18n({
  locale: Cookies.get('language') || 'zh', // set locale
  messages // set locale messages
})

const $router = { // 声明一个$router对象
  push: jest.fn(),
  resolve: jest.fn()
}
const $route = { // 声明一个$route对象
  params: {
    token: 'token'
  }
}
Vue.use(ElementUI)
Vue.use(VueI18n)

module.exports = {
  getRenderedComponent(Component) {
    // const Constructor = Vue.extend(Component)
    // return new Constructor({
    //   i18n,
    //   store,
    //   propsData
    // }).$mount()
    // const Constructor = mount(Component)
    // return new Constructor({
    //   i18n,
    //   store
    // })
    return mount(Component, {
      i18n, store, mocks: {
        $router, // 在beforeEach钩子里挂载进mount的mocks里。
        $route
      }
    })
  }
}
