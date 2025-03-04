import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { RegionCityPickerDropdown } from './components/dropdown'

describe('CityPicker 城市选择器模式', function () {
  const wrapper = mount(RegionCityPickerDropdown, {
    props: {
      language: 'en'
    }
  })
  it('初始化后，触发器按钮应显示 `Please select` 文字', () => {
    // console.log(wrapper.html())
    expect(wrapper.find('.dd-default-trigger').text()).toBe('Please select')
  })
  it('使用数据进行初始化后，应有 2 个城市被选中（“北京市,福州市”）', async () => {
    await wrapper.setProps({ modelValue: ['110000', '350100'] })
    expect(wrapper.find('.dd-default-trigger').text()).toBe('北京市,福州市')
  })
})
