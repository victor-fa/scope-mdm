
const result = {
  result: {
    token: 'editor',
    role_codes: [1],
    user_name: '小明'
  },
  user_name: '小明',
  login_account: 'Normal Editor'
}

export default {
  login: config => {
    return result
  },
  getUserInfo: config => {
    return result
  },
  logout: () => 'success'
}
