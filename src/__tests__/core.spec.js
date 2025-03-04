import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Component from './components/Component'
import {
  getLanguage, getLowerLevels,
  getAvailableLevels, getAvailableValues
} from '../core/helper'
import { getCities, getAreas, getTowns } from '../core/list-loader'
import { modelToValue, modelToValues, listToText } from '../core/parse'
import { data, model } from './data'

describe('v-region 核心工具模块', () => {
  describe('行政级别开关状态模块(state)', async () => {
    const wrapper = mount(Component, {
      props: {
        city: true,
        area: true,
        town: true
      }
    })
    await wrapper.vm.setupTownListLoader(getTowns)

    it('默认的行政级别状态应均为启用', () => {
      expect(wrapper.vm.hasCity).equal(true)
      expect(wrapper.vm.hasArea).equal(true)
      expect(wrapper.vm.hasTown).equal(true)
      expect(wrapper.vm.availableLevels).toEqual(
        ['province', 'city', 'area', 'town']
      )
    })
    it('关闭 town prop，town 级别应为关闭状态', async () => {
      await wrapper.setProps({ town: false })
      expect(wrapper.vm.hasTown).equal(false)
      expect(wrapper.vm.availableLevels).toEqual(
        ['province', 'city', 'area']
      )
    })
    it('关闭 area prop，area 与 town 级别应均为关闭状态', async () => {
      await wrapper.setProps({ area: false })
      expect(wrapper.vm.hasArea).equal(false)
      expect(wrapper.vm.hasTown).equal(false)
      expect(wrapper.vm.availableLevels).toEqual(
        ['province', 'city']
      )
    })
    it('关闭 city prop，city、area 与 town 级别应均为关闭状态', async () => {
      await wrapper.setProps({ city: false })
      expect(wrapper.vm.hasCity).equal(false)
      expect(wrapper.vm.hasArea).equal(false)
      expect(wrapper.vm.hasTown).equal(false)
      expect(wrapper.vm.availableLevels).toEqual(
        ['province']
      )
    })
    it('默认全启用状态下，关闭 city prop，city、area 与 town 级别应均为关闭状态', async () => {
      await wrapper.setProps({ city: true, area: true, town: true })
      await wrapper.setProps({ city: false })
      expect(wrapper.vm.hasCity).equal(false)
      expect(wrapper.vm.hasArea).equal(false)
      expect(wrapper.vm.hasTown).equal(false)
      expect(wrapper.vm.availableLevels).toEqual(
        ['province']
      )
    })
  })

  describe('数据加载模块(loader)', () => {
    it('提供福建省编码，该省的城市数量应为 9 个', async () => {
      const list = await getCities({ key: '350000' })
      expect(list).toHaveLength(9)
    })
    it('提供福州市编码，该市的区/县数量应为 13 个', async () => {
      const list = await getAreas({ key: '350100' })
      expect(list).toHaveLength(13)
    })
    it('提供台江区编码，该区的乡/镇数量应为 10 个', async () => {
      const list = await getTowns({ key: '350103' })
      expect(list).toHaveLength(10)
    })
  })

  describe('根据指定级别获得下级行政级别(getLevels)', () => {
    it('指定省级，应得到市、区、乡', () => {
      expect(getLowerLevels('province')).toEqual(['city', 'area', 'town'])
    })
    it('指定市级，应得到区、乡', () => {
      expect(getLowerLevels('city')).toEqual(['area', 'town'])
    })
    it('指定区/县级，应得到乡', () => {
      expect(getLowerLevels('area')).toEqual(['town'])
    })
    it('指定乡/镇级，应无内容返回', () => {
      expect(getLowerLevels('town')).toEqual([])
    })
  })

  describe('多语言(useLanguage)', () => {
    it('不指定语言，则使用中文', () => {
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

  describe('行政级别可用性(availableLevels)', () => {
    const props = { city: true, area: true, town: true }
    it('默认全启用状态下，乡镇级别不可用', () => {
      expect(getAvailableLevels(props)).toEqual(
        ['province', 'city', 'area']
      )
    })
    it('乡镇级别列表读取器挂载后，乡镇级别可用', () => {
      expect(getAvailableLevels(props, true)).toEqual(
        ['province', 'city', 'area', 'town']
      )
    })
    it('关闭 town prop，town 级别不可用', () => {
      props.town = false
      expect(getAvailableLevels(props, true)).toEqual(
        ['province', 'city', 'area']
      )
    })
    it('关闭 area prop，area 与 town 级别不可用', () => {
      props.area = false
      expect(getAvailableLevels(props, true)).toEqual(
        ['province', 'city']
      )
    })
    it('关闭 city prop，city、area 与 town 级别不可用', () => {
      props.city = false
      expect(getAvailableLevels(props, true)).toEqual(
        ['province']
      )
    })
  })

  describe('级别数据清洗(availableValues)', () => {
    it('级别数据完整，则原样返回', () => {
      expect(getAvailableValues(model)).toEqual(model)
    })
    it('仅区域级别数据缺失，应同时清除乡镇级别数据', () => {
      const missArea = {
        province: '350000',
        city: '350100',
        area: undefined,
        town: '350103001'
      }
      expect(getAvailableValues(missArea)).toEqual({
        province: '350000',
        city: '350100',
        area: undefined,
        town: undefined
      })
    })
    it('仅城市级别数据缺失，应同时清除后续级别数据', () => {
      const missArea = {
        province: '350000',
        city: undefined,
        area: '350103',
        town: '350103001'
      }
      expect(getAvailableValues(missArea)).toEqual({
        province: '350000',
        city: undefined,
        area: undefined,
        town: undefined
      })
    })
    it('仅省级数据缺失，应同时清除后续级别数据', () => {
      const missArea = {
        province: undefined,
        city: '350100',
        area: '350103',
        town: '350103001'
      }
      expect(getAvailableValues(missArea)).toEqual({
        province: undefined,
        city: undefined,
        area: undefined,
        town: undefined
      })
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
})
