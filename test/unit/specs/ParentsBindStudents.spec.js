import ParentsBindStudents from '@/views/ParentsManagement/ParentsBindStudents.vue' // 导入组件
import Util from '../testUtil'

describe('ParentsBindStudents.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = Util.getRenderedComponent(ParentsBindStudents)
  })
  test('Should have two input & one button', () => {
    const inputs = wrapper.findAll('.el-input') // 通过findAll来查找dom或者vue实例
    const Buttons = wrapper.findAll('.el-button') // 通过find查找元素
    expect(inputs.length).toBe(2) // 应该有2个输入框
    expect(Buttons.length).toBe(1) // 应该有1个按钮
  })
})
