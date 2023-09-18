import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { nextTick } from 'vue'
import { RegionSelects } from '@/'
import SelectList from '@/components/SelectList'

describe('v-region Select 表单元素下拉列表模式', () => {
  const wrapper = mount(RegionSelects, {
    props: {
      customTriggerClass: 'custom-trigger',
      customContainerClass: 'custom-container'
    }
  })
  it('不指定任何参数，默认可处理行政级别数量为 3 （省、市、区）', () => {
    expect(wrapper.findAll('.rg-select').length).to.equal(3)
  })
  it('设置 `customTriggerClass` prop，在每个触发对象上，应都添加相应的样式类', () => {
    const selects = wrapper.findAll('.rg-select')
    expect(selects.at(0).classes('custom-trigger')).toBeTruthy()
    expect(selects.at(1).classes('custom-trigger')).toBeTruthy()
    expect(selects.at(2).classes('custom-trigger')).toBeTruthy()
  })
  it('设置 `customContainerClass` prop，在每个下拉容器中，应都添加相应的样式类', () => {
    const selects = wrapper.findAllComponents(SelectList)
    expect(selects.at(0).element.parentElement.classList.contains('custom-container'))
    expect(selects.at(1).element.parentElement.classList.contains('custom-container'))
    expect(selects.at(2).element.parentElement.classList.contains('custom-container'))
  })
  it('"town" prop 设置为 true，可处理行政级别数量为 4 （省、市、区、乡）', async () => {
    await wrapper.setProps({ town: true })
    await nextTick()
    expect(wrapper.findAll('.rg-select').length).to.equal(4)
  })
  it('"area" prop 设置为 false，可处理行政级别数量应为 2 （省、市）', async () => {
    await wrapper.setProps({ area: false })
    await nextTick()
    expect(wrapper.findAll('.rg-select').length).to.equal(2)
  })
  it('"disabled" prop 设置为 true，禁用插件，所有下拉项目必须为禁用状态', () => {
    const wd = mount(RegionSelects, {
      propsData: {
        town: true,
        disabled: true
      }
    })
    expect(wd.findAll('.rg-select__el--disabled').length).to.equal(4)
  })
})
