import BehaviorPrivateManagement from '@/views/PublicCloud/BehaviorPrivateManagement.vue' // 导入组件
import Util from '../testUtil'

describe('BehaviorPrivateManagement.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = Util.getRenderedComponent(BehaviorPrivateManagement) // 每次测试前确保我们的测试实例都是干净完整的。返回一个wrapper对象
    wrapper.setData({
      role_code: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    })
  })
  test('应该有4个输入框8个按钮', () => {
    const inputs = wrapper.findAll('.el-input') // 通过findAll来查找dom或者vue实例
    const Buttons = wrapper.findAll('.el-button') // 通过find查找元素
    expect(inputs.length).toBe(4) // 应该有4个输入框
    expect(Buttons.length).toBe(8) // 应该有8个按钮
  })
  it('查询私有云行为管理信息按钮能点击', () => {
    const btn = wrapper.find('.el-button')
    // 伪造一个jest的 mock funciton
    const stub = jest.fn()
    wrapper.setMethods({ searchUserinfo: stub })
    btn.trigger('click')
    expect(stub).toBeCalled()
  })
})
