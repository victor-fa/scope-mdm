import Login from '@/views/login/Login.vue' // 导入组件
import Util from '../testUtil'

describe('Login.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = Util.getRenderedComponent(Login) // 每次测试前确保我们的测试实例都是干净完整的。返回一个wrapper对象
  })
  test('Should have two input & one button', () => {
    const inputs = wrapper.findAll('.el-input') // 通过findAll来查找dom或者vue实例
    const loginButton = wrapper.find('.el-button') // 通过find查找元素
    expect(inputs.length).toBe(2) // 应该有两个输入框
    expect(loginButton).toBeTruthy() // 应该有一个登录按钮。 只要断言条件不为空或这false，toBeTruthy就能通过。
  })
  it('Submit handleLogin method shoud be called', () => {
    const btn = wrapper.find('.el-button')
    // 伪造一个jest的 mock funciton
    const stub = jest.fn()
    wrapper.setMethods({ handleLogin: stub })
    btn.trigger('click')
    expect(stub).toBeCalled()
  })
  // it('Mock function', async() => {
  //   // 第一次调用函数时，登录失败
  //   const res = await wrapper.vm.login()
  //   expect(res.code).toBe(0)

  //   // 第二次调用函数时，登录成功
  //   const otherRes = await wrapper.vm.login()
  //   expect(res.code).toBe(1)
  // })

  // it('"actions.login" should beCalled when submit', async() => {
  //   wrapper.vm.handleLogin()
  //   expect(wrapper.vm.$store._actions.login).not.toHaveBeenCalled()

  //   wrapper.setData({
  //     loginForm: {
  //       username: 'jkchao',
  //       password: '123456'
  //     }
  //   })
  //   wrapper.update()
  //   wrapper.vm.handleLogin()
  //   // 第一次验证登录失败情景
  //   expect(wrapper.vm.$store._actions.login).toHaveBeenCalled()

  //   wrapper.setData({
  //     loginForm: {
  //       username: 'jkchao',
  //       password: 'hahaheiehi'
  //     }
  //   })
  //   wrapper.update()
  //   wrapper.vm.handleLogin()
  //   // 第二次验证登录成功
  //   expect(wrapper.vm.$store._actions.login).toHaveBeenCalled()
  // })

  // it('Has the expected html structure', () => {
  //   expect(wrapper.element).toMatchSnapshot()
  // })
})
