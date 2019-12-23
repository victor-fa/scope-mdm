import UserManagement from '@/views/PublicCloud/UserManagement.vue' // 导入组件
import Util from '../testUtil'

describe('UserManagement.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = Util.getRenderedComponent(UserManagement) // 每次测试前确保我们的测试实例都是干净完整的。返回一个wrapper对象
    wrapper.setData({
      role_code: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    })
  })
  test('应该有3个输入框11个按钮', () => {
    const inputs = wrapper.findAll('.el-input') // 通过findAll来查找dom或者vue实例
    const Buttons = wrapper.findAll('.el-button') // 通过find查找元素
    expect(inputs.length).toBe(3) // 应该有3个输入框
    expect(Buttons.length).toBe(11) // 应该有10个按钮
  })
  it('查询用户管理信息按钮能点击', () => {
    const btn = wrapper.find('.el-button')
    // 伪造一个jest的 mock funciton
    const stub = jest.fn()
    wrapper.setMethods({ searchUserinfo: stub })
    btn.trigger('click')
    expect(stub).toBeCalled()
  })
})
