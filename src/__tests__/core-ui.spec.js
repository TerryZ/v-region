import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import RegionUI from './components/RegionUI'
import { data, model, specialRegion1, specialRegion2, emptyDataModel } from './data'
import { getTowns } from '../composables/list-loader'

describe('v-region 核心数据模块', async () => {
  describe('普通数据设置', async () => {
    const wrapper = mount(RegionUI, {
      props: {}
    })

    await wrapper.vm.setupTownListLoader(getTowns)

    it('完全重置后，只有省级列表(34个省级项目)，其他级别均为空列表', () => {
      expect(wrapper.vm.state.province.list.length).equal(34)
      expect(wrapper.vm.state.city.list).toEqual([])
      expect(wrapper.vm.state.area.list).toEqual([])
      expect(wrapper.vm.state.town.list).toEqual([])
    })
    it('设置省为`福建省`，城市列表应有 9 个项目', async () => {
      await wrapper.vm.setLevel('province', '350000')
      expect(wrapper.vm.state.province.key).toBe('350000')
      expect(wrapper.vm.state.province.name).toBe('福建省')
      expect(wrapper.vm.state.city.list.length).equal(9)
      expect(wrapper.vm.state.area.list).toEqual([])
      expect(wrapper.vm.state.town.list).toEqual([])
      expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
        {
          province: '350000',
          city: undefined,
          area: undefined,
          town: undefined
        }
      ])
      expect(wrapper.emitted().change[0]).toEqual([
        {
          province: { key: '350000', value: '福建省' },
          city: undefined,
          area: undefined,
          town: undefined
        }
      ])
      expect(wrapper.vm.isComplete()).equal(false)
    })
    it('设置市为`福州市`，区/县列表应有 13 个项目', async () => {
      await wrapper.vm.setLevel('city', '350100')
      expect(wrapper.vm.state.city.key).toBe('350100')
      expect(wrapper.vm.state.city.name).toBe('福州市')
      expect(wrapper.vm.state.city.list).toHaveLength(9)
      expect(wrapper.vm.state.area.list).toHaveLength(13)
      expect(wrapper.vm.state.town.list).toHaveLength(0)
      expect(wrapper.emitted()['update:modelValue'][1]).toEqual([
        {
          province: '350000',
          city: '350100',
          area: undefined,
          town: undefined
        }
      ])
      expect(wrapper.emitted().change[1]).toEqual([
        {
          province: { key: '350000', value: '福建省' },
          city: { key: '350100', value: '福州市' },
          area: undefined,
          town: undefined
        }
      ])
      expect(wrapper.vm.isComplete()).equal(false)
    })
    it('设置区/县为`台江区`，乡/镇列表应有 10 个项目', async () => {
      await wrapper.vm.setLevel('area', '350103')
      await vi.dynamicImportSettled()
      expect(wrapper.vm.state.area.key).toBe('350103')
      expect(wrapper.vm.state.area.name).toBe('台江区')
      expect(wrapper.vm.state.city.list).toHaveLength(9)
      expect(wrapper.vm.state.area.list).toHaveLength(13)
      expect(wrapper.vm.state.town.list).toHaveLength(10)
      expect(wrapper.emitted()['update:modelValue'][2]).toEqual([
        {
          province: '350000',
          city: '350100',
          area: '350103',
          town: undefined
        }
      ])
      expect(wrapper.emitted().change[2]).toEqual([
        {
          province: { key: '350000', value: '福建省' },
          city: { key: '350100', value: '福州市' },
          area: { key: '350103', value: '台江区' },
          town: undefined
        }
      ])
      expect(wrapper.vm.isComplete()).equal(false)
    })
    it('设置乡/镇/街道为`瀛洲街道`，应响应完成事件', async () => {
      await wrapper.vm.setLevel('town', '350103001')
      expect(wrapper.vm.state.town.key).toBe('350103001')
      expect(wrapper.vm.state.town.name).toBe('瀛洲街道')
      expect(wrapper.vm.state.city.list).toHaveLength(9)
      expect(wrapper.vm.state.area.list).toHaveLength(13)
      expect(wrapper.vm.state.town.list).toHaveLength(10)
      expect(wrapper.emitted()['update:modelValue'][3]).toEqual([
        {
          province: '350000',
          city: '350100',
          area: '350103',
          town: '350103001'
        }
      ])
      expect(wrapper.emitted().change[3]).toEqual([
        {
          province: { key: '350000', value: '福建省' },
          city: { key: '350100', value: '福州市' },
          area: { key: '350103', value: '台江区' },
          town: { key: '350103001', value: '瀛洲街道' }
        }
      ])
      expect(wrapper.vm.isComplete()).equal(true)
    })
    it('当前选中项目的文本内容应为`福建省福州市台江区瀛洲街道`', () => {
      expect(wrapper.vm.regionText).equal('福建省福州市台江区瀛洲街道')
    })
    it('调用 reset 函数重置，应重置数据，清空对应列表，并通过事件响应变更', async () => {
      await wrapper.vm.reset()
      await vi.dynamicImportSettled()

      expect(wrapper.vm.state.province.list).toHaveLength(34)
      expect(wrapper.vm.state.city.list).toHaveLength(0)
      expect(wrapper.vm.state.area.list).toHaveLength(0)
      expect(wrapper.vm.state.town.list).toHaveLength(0)

      expect(wrapper.vm.state.province.key).toBe(undefined)
      expect(wrapper.vm.state.city.key).toBe(undefined)
      expect(wrapper.vm.state.area.key).toBe(undefined)
      expect(wrapper.vm.state.town.key).toBe(undefined)

      expect(wrapper.emitted()['update:modelValue'][4]).toEqual([
        {
          province: undefined,
          city: undefined,
          area: undefined,
          town: undefined
        }
      ])
      expect(wrapper.emitted().change[4]).toEqual([
        {
          province: undefined,
          city: undefined,
          area: undefined,
          town: undefined
        }
      ])
      expect(wrapper.vm.regionText).equal('')
      expect(wrapper.vm.isComplete()).equal(false)
    })

    it('通过 v-model/modelValue 设置行政区划', async () => {
      await wrapper.setProps({ modelValue: model })
      await vi.dynamicImportSettled()

      const emitted = wrapper.emitted()
      const change = emitted.change
      expect(change[change.length - 1][0]).toEqual(data)

      expect(wrapper.vm.state.province.list).toHaveLength(34)
      expect(wrapper.vm.state.city.list).toHaveLength(9)
      expect(wrapper.vm.state.area.list).toHaveLength(13)
      expect(wrapper.vm.state.town.list).toHaveLength(10)

      expect(wrapper.vm.isComplete()).equal(true)
    })
  })

  describe('特殊数据设置', () => {
    const wrapper = mount(RegionUI)

    it('设置省级为北京市，市级应也自动选择北京市', async () => {
      await wrapper.vm.setLevel('province', '110000')
      await flushPromises()
      expect(wrapper.vm.regionText).toBe('北京市北京市')
      expect(wrapper.emitted('change').at(-1)).toEqual([
        {
          province: { key: '110000', value: '北京市' },
          city: { key: '110000', value: '北京市' },
          area: undefined,
          town: undefined
        }
      ])
      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([
        {
          province: '110000',
          city: '110000',
          area: undefined,
          town: undefined
        }
      ])
    })
    it('设置省级为广东省，市级为东莞市，县级应自动选择东莞市', async () => {
      await wrapper.vm.setLevel('province', '440000')
      await wrapper.vm.setLevel('city', '441900')
      await flushPromises()
      expect(wrapper.vm.regionText).toBe('广东省东莞市东莞市')
      expect(wrapper.emitted('change').at(-1)).toEqual([
        {
          province: { key: '440000', value: '广东省' },
          city: { key: '441900', value: '东莞市' },
          area: { key: '441900', value: '东莞市' },
          town: undefined
        }
      ])
      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([
        {
          province: '440000',
          city: '441900',
          area: '441900',
          town: undefined
        }
      ])
    })
    it('通过 v-model 设置省级为北京市，市级不应被设置项目', async () => {
      await wrapper.setProps({ modelValue: specialRegion1() })
      await flushPromises()
      expect(wrapper.vm.regionText).toBe('北京市')
      expect(wrapper.emitted('change').at(-1)).toEqual([
        {
          province: { key: '110000', value: '北京市' },
          city: undefined,
          area: undefined,
          town: undefined
        }
      ])
    })
    it('通过 v-model 设置省级为广东省，市级为东莞市，县级不应被设置项目', async () => {
      await wrapper.setProps({ modelValue: specialRegion2() })
      await flushPromises()
      expect(wrapper.vm.regionText).toBe('广东省东莞市')
      expect(wrapper.emitted('change').at(-1)).toEqual([
        {
          province: { key: '440000', value: '广东省' },
          city: { key: '441900', value: '东莞市' },
          area: undefined,
          town: undefined
        }
      ])
    })
    it('通过 v-model 设置空数据，所有级别数据应被清空', async () => {
      await wrapper.setProps({ modelValue: emptyDataModel })
      await flushPromises()
      expect(wrapper.vm.regionText).toBe('')
      expect(wrapper.emitted('change').at(-1)).toEqual([
        {
          province: undefined,
          city: undefined,
          area: undefined,
          town: undefined
        }
      ])
    })
  })
})
