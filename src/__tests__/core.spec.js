import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import RegionCore from './components/RegionCore'
import { getLanguage } from '../composables/helper'
import { getCities, getAreas, getTowns } from '../composables/list-loader'
import { modelToValue, modelToValues, listToText } from '../composables/parse'
import { data, model, wrongLevelKey, emptyLevelKey } from './data'

describe('v-region 核心工具模块', () => {
  describe('行政级别开关状态模块(state)', async () => {
    const wrapper = mount(RegionCore, {
      props: {
        city: true,
        area: true,
        town: true
      }
    })

    it('默认的行政级别状态应均为启用，乡镇未启用', () => {
      expect(wrapper.vm.hasCity).equal(true)
      expect(wrapper.vm.hasArea).equal(true)
      expect(wrapper.vm.hasTown).equal(false)
    })
    it('装配了乡镇级别的列表的加载器，乡镇级别才会被启用', async () => {
      await wrapper.vm.setupTownListLoader(getTowns)
      expect(wrapper.vm.hasTown).equal(true)
    })
    it('关闭 town prop，town 级别应为关闭状态', async () => {
      await wrapper.setProps({ town: false })
      expect(wrapper.vm.hasTown).equal(false)
    })
    it('关闭 area prop，area 与 town 级别应均为关闭状态', async () => {
      await wrapper.setProps({ area: false })
      expect(wrapper.vm.hasArea).equal(false)
      expect(wrapper.vm.hasTown).equal(false)
    })
    it('关闭 city prop，city、area 与 town 级别应均为关闭状态', async () => {
      await wrapper.setProps({ city: false })
      expect(wrapper.vm.hasCity).equal(false)
      expect(wrapper.vm.hasArea).equal(false)
      expect(wrapper.vm.hasTown).equal(false)
    })
    it('默认全启用状态下，关闭 city prop，city、area 与 town 级别应均为关闭状态', async () => {
      await wrapper.setProps({ city: true, area: true, town: true })
      await wrapper.setProps({ city: false })
      expect(wrapper.vm.hasCity).equal(false)
      expect(wrapper.vm.hasArea).equal(false)
      expect(wrapper.vm.hasTown).equal(false)
    })
  })

  describe('数据加载模块(loader)', () => {
    it('提供福建省编码，该省的城市数量应为 9 个', () => {
      const list = getCities({ key: '350000' })
      expect(list).toHaveLength(9)
    })
    it('提供福州市编码，该市的区/县数量应为 13 个', () => {
      const list = getAreas({ key: '350100' })
      expect(list).toHaveLength(13)
    })
    it('提供台江区编码，该区的乡/镇数量应为 10 个', async () => {
      const list = await getTowns({ key: '350103' })
      expect(list).toHaveLength(10)
    })
  })

  describe('多语言', () => {
    it('默认使用中文', () => {
      const lang = getLanguage()
      expect(lang.pleaseSelect).equal('请选择')
    })
    it('指定中文', () => {
      const lang = getLanguage('cn')
      expect(lang.pleaseSelect).equal('请选择')
    })
    it('指定英文', () => {
      const lang = getLanguage('en')
      expect(lang.pleaseSelect).equal('Please select')
    })
    it('指定非预设语言，则使用中文', () => {
      const lang = getLanguage('de')
      expect(lang.pleaseSelect).equal('请选择')
    })
  })

  describe('提取行政区划数据文本内容(modelToValues)', () => {
    it('提取后的文本内容应是 `福建省福州市台江区瀛洲街道`', () => {
      expect(listToText(modelToValues(data, 'value'), '')).toBe('福建省福州市台江区瀛洲街道')
    })
  })

  describe('行政区划数据模型转换为参数数据模型（仅编码）(modelToValue)', () => {
    it('获得用于 `v-model` 输入输出数据模型', () => {
      expect(modelToValue(data, 'key')).toEqual(model)
    })
  })

  describe('v-model 指定值', async () => {
    const wrapper = mount(RegionCore)

    it('指定完整的一套编码，应设置成功福建省福州市台江区，乡镇级别未启用，数据应被重置', async () => {
      await wrapper.vm.setRegion(model)
      await flushPromises()
      expect(wrapper.vm.toNames()).toEqual(['福建省', '福州市', '台江区'])
      expect(wrapper.vm.toValues()).toEqual({
        province: '350000',
        city: '350100',
        area: '350103',
        town: undefined
      })
      expect(wrapper.vm.toModel()).toEqual({
        province: { key: '350000', value: '福建省' },
        city: { key: '350100', value: '福州市' },
        area: { key: '350103', value: '台江区' },
        town: undefined
      })
      expect(wrapper.vm.isComplete()).toBeTruthy()
    })
    it('存在错误的级别编码(福建省-杭州市)，错误的编码级别以及所有下级应都被重置', async () => {
      await wrapper.vm.setRegion(wrongLevelKey())
      await flushPromises()
      expect(wrapper.vm.toNames()).toEqual(['福建省'])
      expect(wrapper.vm.toValues()).toEqual({
        province: '350000',
        city: undefined,
        area: undefined,
        town: undefined
      })
      expect(wrapper.vm.toModel()).toEqual({
        province: { key: '350000', value: '福建省' },
        city: undefined,
        area: undefined,
        town: undefined
      })
    })
    it('中间级别存在空数据，该级别及以下的级别应被重置', async () => {
      await wrapper.vm.setupTownListLoader(getTowns)
      await wrapper.vm.setRegion(emptyLevelKey())
      await flushPromises()
      expect(wrapper.vm.toNames()).toEqual(['福建省'])
      expect(wrapper.vm.toValues()).toEqual({
        province: '350000',
        city: undefined,
        area: undefined,
        town: undefined
      })
      expect(wrapper.vm.toModel()).toEqual({
        province: { key: '350000', value: '福建省' },
        city: undefined,
        area: undefined,
        town: undefined
      })
    })
    it('启用乡镇级别，应设置成功福建省福州市台江区瀛洲街道', async () => {
      await wrapper.vm.setRegion(model)
      await flushPromises()
      expect(wrapper.vm.toNames()).toEqual(['福建省', '福州市', '台江区', '瀛洲街道'])
      expect(wrapper.vm.toValues()).toEqual({
        province: '350000',
        city: '350100',
        area: '350103',
        town: '350103001'
      })
      expect(wrapper.vm.toModel()).toEqual({
        province: { key: '350000', value: '福建省' },
        city: { key: '350100', value: '福州市' },
        area: { key: '350103', value: '台江区' },
        town: { key: '350103001', value: '瀛洲街道' }
      })
      expect(wrapper.vm.isComplete()).toBeTruthy()
    })
    it('重置城市级别，该级别以下的级别应都被重置', () => {
      wrapper.vm.resetRegion('city')
      expect(wrapper.vm.toNames()).toEqual(['福建省'])
      expect(wrapper.vm.toValues()).toEqual({
        province: '350000',
        city: undefined,
        area: undefined,
        town: undefined
      })
      expect(wrapper.vm.toModel()).toEqual({
        province: { key: '350000', value: '福建省' },
        city: undefined,
        area: undefined,
        town: undefined
      })
    })
  })

  describe('设置单一级别数据', async () => {
    const wrapper = mount(RegionCore)
    await wrapper.vm.setupTownListLoader(getTowns)

    it('设置省级编码为 350000，福建省应被选中', async () => {
      await wrapper.vm.setRegionLevel('province', { province: '350000' })
      await flushPromises()
      expect(wrapper.vm.toNames()).toEqual(['福建省'])
      expect(wrapper.vm.toValues()).toEqual({
        province: '350000',
        city: undefined,
        area: undefined,
        town: undefined
      })
      expect(wrapper.vm.toModel()).toEqual({
        province: { key: '350000', value: '福建省' },
        city: undefined,
        area: undefined,
        town: undefined
      })
    })
    it('设置市级编码为 350100，福州市应被选中', async () => {
      await wrapper.vm.setRegionLevel('city', { city: '350100' })
      await flushPromises()
      expect(wrapper.vm.toNames()).toEqual(['福建省', '福州市'])
      expect(wrapper.vm.toValues()).toEqual({
        province: '350000',
        city: '350100',
        area: undefined,
        town: undefined
      })
      expect(wrapper.vm.toModel()).toEqual({
        province: { key: '350000', value: '福建省' },
        city: { key: '350100', value: '福州市' },
        area: undefined,
        town: undefined
      })
    })
    it('设置区县级编码为 350103，台江区应被选中', async () => {
      await wrapper.vm.setRegionLevel('area', { area: '350103' })
      await flushPromises()
      expect(wrapper.vm.toNames()).toEqual(['福建省', '福州市', '台江区'])
      expect(wrapper.vm.toValues()).toEqual({
        province: '350000',
        city: '350100',
        area: '350103',
        town: undefined
      })
      expect(wrapper.vm.toModel()).toEqual({
        province: { key: '350000', value: '福建省' },
        city: { key: '350100', value: '福州市' },
        area: { key: '350103', value: '台江区' },
        town: undefined
      })
    })
    it('设置乡镇级编码为 350103001，瀛洲街道应被选中', async () => {
      await wrapper.vm.setRegionLevel('town', { town: '350103001' })
      await flushPromises()
      expect(wrapper.vm.toNames()).toEqual(['福建省', '福州市', '台江区', '瀛洲街道'])
      expect(wrapper.vm.toValues()).toEqual({
        province: '350000',
        city: '350100',
        area: '350103',
        town: '350103001'
      })
      expect(wrapper.vm.toModel()).toEqual({
        province: { key: '350000', value: '福建省' },
        city: { key: '350100', value: '福州市' },
        area: { key: '350103', value: '台江区' },
        town: { key: '350103001', value: '瀛洲街道' }
      })
    })
  })
})
