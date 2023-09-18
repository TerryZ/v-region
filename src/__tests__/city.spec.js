import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { RegionCityPicker } from '@/'

describe('v-region CityPicker 城市选择器模式', function () {
  const wrapper = mount(RegionCityPicker, {
    props: {
      modelValue: ['110000', '350100'],
      language: 'en',
      customTriggerClass: 'custom-trigger',
      customContainerClass: 'custom-container'
    }
  })
  it('', () => {
    console.log(wrapper.findComponent('.rg-city-picker'))
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
  it('点击 X 图标，所有选中城市应被清空', async () => {
    await wrapper.find('.rg-clear-btn').trigger('click')
    expect(wrapper.find('.rg-default-btn').text()).toBe('Please select')
  })
  it('响应 v-model 为空数据', () => {
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([[]])
  })
  it('响应事件 change 应返回空数据', () => {
    expect(wrapper.emitted('change')[1]).toEqual([[]])
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
