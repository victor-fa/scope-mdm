import { user_login_post, user_info_token_get } from '@/api/user/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Message } from 'element-ui'
import {
  getStore,
  setStore,
  removeStore
} from '@/utils/store'
import useri18n from '@/lang'
const user = {
  state: {
    token: getToken(),
    name: '',
    roles: [],
    // 老师任教班级
    teachingClass: [],
    // 家长孩子
    childrenInfoOptions: [],
    lockPasswd: getStore({
      name: 'lockPasswd'
    }) || '',
    isLock: getStore({
      name: 'isLock'
    }) || false,
    browserHeaderTitle: getStore({
      name: 'browserHeaderTitle'
    }) || useri18n.t('login.title')
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_teachingClass: (state, teachingClass) => {
      state.teachingClass = teachingClass
    },
    SET_childrenInfoOptions: (state, childrenInfoOptions) => {
      state.childrenInfoOptions = childrenInfoOptions
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd
      setStore({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      })
    },
    SET_LOCK: (state, action) => {
      state.isLock = true
      setStore({
        name: 'isLock',
        content: state.isLock,
        type: 'session'
      })
    },
    SET_BROWSERHEADERTITLE: (state, action) => {
      state.browserHeaderTitle = action.browserHeaderTitle
      setStore({
        name: 'browserHeaderTitle',
        content: state.browserHeaderTitle,
        type: 'session'
      })
    },
    CLEAR_LOCK: (state, action) => {
      state.isLock = false
      state.lockPasswd = ''
      removeStore({
        name: 'lockPasswd'
      })
      removeStore({
        name: 'isLock'
      })
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        user_login_post(userInfo.login_account, userInfo.password, userInfo.remark).then(response => {
          if (response.errorCode === 10) {
            Message({
              message: useri18n.t('message.Theaccountorpasswordisincorrect'),
              type: 'error',
              duration: 5 * 1000
            })
            reject(response.errorMessage)
          }
          const data = response.result
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        user_info_token_get(state.token).then(response => {
          const data = response.result
          commit('SET_ROLES', data.role_codes)
          commit('SET_NAME', data.user_name)
          // 如果登录的是老师
          if (data.role_codes[0] === 4) {
            commit('SET_teachingClass', data.teaching_class)
          }
          // 如果登录的是家长
          if (data.role_codes[0] === 5) {
            commit('SET_childrenInfoOptions', data.children_info, data.children_equipment_code)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('CLEAR_LOCK')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
