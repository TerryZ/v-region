import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { RegionCityPicker } from '@/'

describe('CityPicker 城市选择核心模块', function () {
  const wrapper = mount(RegionCityPicker, {
    props: {
      modelValue: ['110000', '350100'],
      language: 'en'
    }
  })
  it('使用数据进行初始化后，应有 2 个城市被选中（“北京市,福州市”）', () => {
    expect(wrapper.findAll('.rg-picker__city.selected')).toHaveLength(2)
  })
  it('数据初始化后，响应 update:names 事件并返回相应完整城市名称', () => {
    expect(wrapper.emitted('update:names').at(-1)).toEqual([['北京市', '福州市']])
  })
  it('数据初始化后，响应 change 事件并返回相应完整城市模型', () => {
    expect(wrapper.emitted('change').at(-1)).toEqual([[
      { key: '110000', value: '北京市' },
      { key: '350100', value: '福州市' }
    ]])
  })
  it('点击清除图标，应清空所有选择项目', async () => {
    await wrapper.find('.rg-search-bar .rg-icon-btn').trigger('click')
    expect(wrapper.findAll('.rg-picker__city.selected')).toHaveLength(0)
  })
  it('通过 v-model 指定五个城市，对应的城市应被选中', async () => {
    await wrapper.setProps({
      modelValue: ['110000', '350100', '140100', '140200', '140300']
    })
    expect(wrapper.findAll('.rg-picker__city.selected')).toHaveLength(5)
    expect(wrapper.emitted('update:names').at(-1)).toEqual([['北京市', '太原市', '大同市', '阳泉市', '福州市']])
  })
  // it('设置 overflow prop 为 true，多个城市名称不会被收纳', async () => {
  //   // const overflow = mount(RegionCityPicker, {
  //   //   props: {
  //   //     modelValue: ['110000', '350100', '140100', '140200', '140300'],
  //   //     overflow: false
  //   //   }
  //   // })
  //   // await nextTick()
  //   // expect(overflow.find('.dd-default-trigger').text()).toBe('北京市,太原市,and 3 others')
  //   await wrapper.setProps({ overflow: true })
  //   expect(wrapper.find('.dd-default-trigger').text()).toBe('北京市,太原市,大同市,阳泉市,福州市')
  // })
  it('通过 v-model 指定一个空数组，所有选择项应被清空', async () => {
    await wrapper.setProps({ modelValue: [] })
    expect(wrapper.findAll('.rg-picker__city.selected')).toHaveLength(0)
  })
  it('搜索 `福` 关键字，应有 3 个搜索结果', async () => {
    await wrapper.find('.rg-search-input input').setValue('福')
    expect(wrapper.findAll('.rg-picker__city')).toHaveLength(3)
  })
  it('清空搜索内容，应有 394 个搜索结果', async () => {
    await wrapper.find('.rg-search-input input').setValue('')
    expect(wrapper.findAll('.rg-picker__city')).toHaveLength(394)
  })
  it('点击 `北京市`、`天津市` 与 `石家庄市` 三个城市，此三个城市应被选中', async () => {
    const cities = wrapper.findAll('.rg-picker__city')
    await cities[0].trigger('click')
    await cities[1].trigger('click')
    await cities[4].trigger('click')
    expect(wrapper.findAll('.rg-picker__city.selected')).toHaveLength(3)
    expect(wrapper.emitted('update:names').at(-1)).toEqual([['北京市', '天津市', '石家庄市']])
  })
})
