import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import Component from './Component'
import { data, model } from './data'
import { getTowns } from '../core/list-loader'

describe('v-region 核心数据模块', async () => {
  const wrapper = mount(Component, {
    props: {
    }
  })

  await wrapper.vm.setupTownListLoader(getTowns)

  it('初始状态下，只有省级列表(34个省级项目)，其他级别均为空列表', () => {
    expect(wrapper.vm.data.province.list.length).equal(34)
    expect(wrapper.vm.data.city.list).toEqual([])
    expect(wrapper.vm.data.area.list).toEqual([])
    expect(wrapper.vm.data.town.list).toEqual([])
  })
  it('设置省为`福建省`，城市列表应有 9 个项目', async () => {
    await wrapper.vm.setLevel('province', { key: '350000', value: '福建省' })
    expect(wrapper.vm.data.province.key).toBe('350000')
    expect(wrapper.vm.data.province.name).toBe('福建省')
    expect(wrapper.vm.data.city.list.length).equal(9)
    expect(wrapper.vm.data.area.list).toEqual([])
    expect(wrapper.vm.data.town.list).toEqual([])
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
    expect(wrapper.vm.data.city.key).toBe('350100')
    expect(wrapper.vm.data.city.name).toBe('福州市')
    expect(wrapper.vm.data.city.list).toHaveLength(9)
    expect(wrapper.vm.data.area.list).toHaveLength(13)
    expect(wrapper.vm.data.town.list).toHaveLength(0)
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
    expect(wrapper.vm.data.area.key).toBe('350103')
    expect(wrapper.vm.data.area.name).toBe('台江区')
    expect(wrapper.vm.data.city.list).toHaveLength(9)
    expect(wrapper.vm.data.area.list).toHaveLength(13)
    expect(wrapper.vm.data.town.list).toHaveLength(10)
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
    expect(wrapper.vm.data.town.key).toBe('350103001')
    expect(wrapper.vm.data.town.name).toBe('瀛洲街道')
    expect(wrapper.vm.data.city.list).toHaveLength(9)
    expect(wrapper.vm.data.area.list).toHaveLength(13)
    expect(wrapper.vm.data.town.list).toHaveLength(10)
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
  })
  it('当前选中项目的文本内容应为`福建省福州市台江区瀛洲街道`', () => {
    expect(wrapper.vm.regionText).equal('福建省福州市台江区瀛洲街道')
  })
  it('调用 reset 函数重置，应重置数据，清空对应列表，并通过事件响应变更', async () => {
    await wrapper.vm.reset()
    await vi.dynamicImportSettled()

    expect(wrapper.vm.data.province.list).toHaveLength(34)
    expect(wrapper.vm.data.city.list).toHaveLength(0)
    expect(wrapper.vm.data.area.list).toHaveLength(0)
    expect(wrapper.vm.data.town.list).toHaveLength(0)

    expect(wrapper.vm.data.province.key).toBe(undefined)
    expect(wrapper.vm.data.city.key).toBe(undefined)
    expect(wrapper.vm.data.area.key).toBe(undefined)
    expect(wrapper.vm.data.town.key).toBe(undefined)

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

    expect(wrapper.vm.data.province.list).toHaveLength(34)
    expect(wrapper.vm.data.city.list).toHaveLength(9)
    expect(wrapper.vm.data.area.list).toHaveLength(13)
    expect(wrapper.vm.data.town.list).toHaveLength(10)

    expect(wrapper.vm.isComplete).equal(true)
  })
})
