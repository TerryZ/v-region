import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { RegionCityPicker } from '@/'

describe('v-region CityPicker 城市选择器模式', function () {
  const wrapper = mount(RegionCityPicker, {
    props: {
      modelValue: ['110000', '350100']
    }
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

  it('点击 X 图标，所有选中城市应被清空', async () => {
    await wrapper.find('.rg-clear-btn').trigger('click')
    expect(wrapper.find('.rg-default-btn').text()).toBe('请选择')
  })

  it('响应 v-model 为空数据', () => {
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([[]])
  })
  it('响应事件 change 应返回空数据', () => {
    expect(wrapper.emitted('change')[1]).toEqual([[]])
  })
})
