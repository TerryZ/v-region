import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { RegionCityPicker } from '@/'
import CityPicker from '@/modules/city/CityPicker'

describe('v-region CityPicker 城市选择器模式', function () {
  const wrapper = mount(RegionCityPicker, {
    props: {
      modelValue: ['110000', '350100'],
      language: 'en',
      customTriggerClass: 'custom-trigger',
      customContainerClass: 'custom-container'
    }
  })
  it('设置 `customTriggerClass` prop，触发对象容器应添加相应样式类', () => {
    expect(wrapper.classes('custom-trigger')).toBeTruthy()
  })
  it('设置 `customContainerClass` prop，下拉容器应添加相应样式类', () => {
    const picker = wrapper.findComponent(CityPicker)
    expect(picker.element.parentElement.classList.contains('custom-container')).toBeTruthy()
  })
  it('使用数据进行初始化后，应有 2 个城市被选中（“北京市,福州市”）', () => {
    expect(wrapper.find('.rg-default-btn').text()).toBe('北京市,福州市')
  })
  it('数据初始化后，响应 change 事件并返回相应完整城市模型', () => {
    expect(wrapper.emitted('change')[0]).toEqual([[
      { key: '110000', value: '北京市' },
      { key: '350100', value: '福州市' }
    ]])
  })
  it('点击触发对象，下拉窗口应被打开并触发 `visible-change` 事件', async () => {
    await wrapper.trigger('click')
    expect(wrapper.find('.rg-default-btn').classes('rg-opened')).toBe(true)
    expect(wrapper.emitted('visible-change')[0]).toEqual([true])
  })
  it('点击清除图标，应清空所有选择项目', async () => {
    const picker = wrapper.findComponent(CityPicker)
    await picker.find('.rg-search-bar .rg-icon-btn').trigger('click')
    expect(wrapper.find('.rg-default-btn').text()).toBe('Please select')
  })
  it('通过 v-model 指定五个城市，触发按钮中显示的文本应为`北京市,太原市,and 3 others`', async () => {
    await wrapper.setProps({
      modelValue: ['110000', '350100', '140100', '140200', '140300']
    })
    expect(wrapper.find('.rg-default-btn').text()).toBe('北京市,太原市,and 3 others')
  })
  it('设置 overflow prop 为 true，多个城市名称不会被收纳', async () => {
    // const overflow = mount(RegionCityPicker, {
    //   props: {
    //     modelValue: ['110000', '350100', '140100', '140200', '140300'],
    //     overflow: false
    //   }
    // })
    // await nextTick()
    // expect(overflow.find('.rg-default-btn').text()).toBe('北京市,太原市,and 3 others')
    await wrapper.setProps({ overflow: true })
    expect(wrapper.find('.rg-default-btn').text()).toBe('北京市,太原市,大同市,阳泉市,福州市')
  })
  it('通过 v-model 指定一个空数组，所有选择项应被清空', async () => {
    await wrapper.setProps({ modelValue: [] })
    expect(wrapper.find('.rg-default-btn').text()).toBe('Please select')
  })
})
