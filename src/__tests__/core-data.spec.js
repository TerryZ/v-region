import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import Component from './Component'
import { data, model } from './data'

describe('v-region 核心数据模块', () => {
  const wrapper = mount(Component, {
    props: {
      town: true
    }
  })

  it('初始状态下，只有省级列表(34个省级项目)，其他级别均为空列表', () => {
    expect(wrapper.vm.provinces.length).equal(34)
    expect(wrapper.vm.cities).toEqual([])
    expect(wrapper.vm.areas).toEqual([])
    expect(wrapper.vm.towns).toEqual([])
  })
  it('设置省为`福建省`，城市列表应有 9 个项目', async () => {
    await wrapper.vm.setLevel('province', { key: '350000', value: '福建省' })
    expect(wrapper.vm.data.province).toEqual({ key: '350000', value: '福建省' })
    expect(wrapper.vm.cities.length).equal(9)
    expect(wrapper.vm.areas).toEqual([])
    expect(wrapper.vm.towns).toEqual([])
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([{
      province: '350000',
      city: undefined,
      area: undefined,
      town: undefined
    }])
    expect(wrapper.emitted().change[0]).toEqual([
      {
        province: { key: '350000', value: '福建省' },
        city: undefined,
        area: undefined,
        town: undefined
      }
    ])
    expect(wrapper.vm.isComplete).equal(false)
  })
  it('设置市为`福州市`，区/县列表应有 13 个项目', async () => {
    await wrapper.vm.setLevel('city', { key: '350100', value: '福州市' })
    expect(wrapper.vm.data.city).toEqual({ key: '350100', value: '福州市' })
    expect(wrapper.vm.cities).toHaveLength(9)
    expect(wrapper.vm.areas).toHaveLength(13)
    expect(wrapper.vm.towns).toHaveLength(0)
    expect(wrapper.emitted()['update:modelValue'][1]).toEqual([{
      province: '350000',
      city: '350100',
      area: undefined,
      town: undefined
    }])
    expect(wrapper.emitted().change[1]).toEqual([
      {
        province: { key: '350000', value: '福建省' },
        city: { key: '350100', value: '福州市' },
        area: undefined,
        town: undefined
      }
    ])
    expect(wrapper.vm.isComplete).equal(false)
  })
  it('设置区/县为`台江区`，乡/镇列表应有 10 个项目', async () => {
    await wrapper.vm.setLevel('area', { key: '350103', value: '台江区' })
    await vi.dynamicImportSettled()
    expect(wrapper.vm.data.area).toEqual({ key: '350103', value: '台江区' })
    expect(wrapper.vm.cities).toHaveLength(9)
    expect(wrapper.vm.areas).toHaveLength(13)
    expect(wrapper.vm.towns).toHaveLength(10)
    expect(wrapper.emitted()['update:modelValue'][2]).toEqual([{
      province: '350000',
      city: '350100',
      area: '350103',
      town: undefined
    }])
    expect(wrapper.emitted().change[2]).toEqual([
      {
        province: { key: '350000', value: '福建省' },
        city: { key: '350100', value: '福州市' },
        area: { key: '350103', value: '台江区' },
        town: undefined
      }
    ])
    expect(wrapper.vm.isComplete).equal(false)
  })
  it('设置乡/镇/街道为`瀛洲街道`，应响应完成事件', async () => {
    await wrapper.vm.setLevel('town', { key: '350103001', value: '瀛洲街道' })
    expect(wrapper.vm.data.town).toEqual({ key: '350103001', value: '瀛洲街道' })
    expect(wrapper.vm.cities).toHaveLength(9)
    expect(wrapper.vm.areas).toHaveLength(13)
    expect(wrapper.vm.towns).toHaveLength(10)
    expect(wrapper.emitted()['update:modelValue'][3]).toEqual([{
      province: '350000',
      city: '350100',
      area: '350103',
      town: '350103001'
    }])
    expect(wrapper.emitted().change[3]).toEqual([
      {
        province: { key: '350000', value: '福建省' },
        city: { key: '350100', value: '福州市' },
        area: { key: '350103', value: '台江区' },
        town: { key: '350103001', value: '瀛洲街道' }
      }
    ])
    expect(wrapper.vm.isComplete).equal(true)
    expect(wrapper.vm.getLevelList('province').value).toHaveLength(34)
    expect(wrapper.vm.getLevelList('city').value).toHaveLength(9)
    expect(wrapper.vm.getLevelList('area').value).toHaveLength(13)
    expect(wrapper.vm.getLevelList('town').value).toHaveLength(10)
  })
  it('当前选中项目的文本内容应为`福建省福州市台江区瀛洲街道`', () => {
    expect(wrapper.vm.regionText).equal('福建省福州市台江区瀛洲街道')
  })
  it('调用 reset 函数重置，应重置数据，清空对应列表，并通过事件响应变更', async () => {
    await wrapper.vm.reset()
    await vi.dynamicImportSettled()
    expect(wrapper.vm.provinces).toHaveLength(34)
    expect(wrapper.vm.cities).toHaveLength(0)
    expect(wrapper.vm.areas).toHaveLength(0)
    expect(wrapper.vm.towns).toHaveLength(0)
    expect(wrapper.vm.data).toEqual({
      province: undefined,
      city: undefined,
      area: undefined,
      town: undefined
    })
    expect(wrapper.emitted()['update:modelValue'][4]).toEqual([{
      province: undefined,
      city: undefined,
      area: undefined,
      town: undefined
    }])
    expect(wrapper.emitted().change[4]).toEqual([
      {
        province: undefined,
        city: undefined,
        area: undefined,
        town: undefined
      }
    ])
    expect(wrapper.vm.regionText).equal('')
    expect(wrapper.vm.isComplete).equal(false)
  })

  it('通过 v-model/modelValue 设置行政区划', async () => {
    await wrapper.setProps({ modelValue: model })
    await vi.dynamicImportSettled()

    const emitted = wrapper.emitted()
    const change = emitted.change
    expect(change[change.length - 1][0]).toEqual(data)
    expect(wrapper.vm.data).toEqual(data)
    expect(wrapper.vm.provinces).toHaveLength(34)
    expect(wrapper.vm.cities).toHaveLength(9)
    expect(wrapper.vm.areas).toHaveLength(13)
    expect(wrapper.vm.towns).toHaveLength(10)
    expect(wrapper.vm.isComplete).equal(true)
  })
})
