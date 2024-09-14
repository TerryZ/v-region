import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Component from './Component'
// valueToModel, regionToText 的内容已集成于核心模块
import { valueToModel, regionToText } from '../utils/parse'
import {
  getCities, getAreas, getTowns, getLanguage, getLowerLevels
} from '../core/helper'
import { modelToValue } from '../core/parse'
import { data, model } from './data'

describe('v-region 核心工具模块', () => {
  describe('行政级别开关状态模块(state)', () => {
    const wrapper = mount(Component, {
      props: {
        city: true,
        area: true,
        town: true
      }
    })

    it('默认的行政级别状态应均为启用', () => {
      expect(wrapper.vm.hasCity).equal(true)
      expect(wrapper.vm.hasArea).equal(true)
      expect(wrapper.vm.hasTown).equal(true)
      expect(wrapper.vm.getAvailableLevels()).toEqual(
        ['province', 'city', 'area', 'town']
      )
    })
    it('关闭 town prop，town 级别应为关闭状态', async () => {
      await wrapper.setProps({ town: false })
      expect(wrapper.vm.hasTown).equal(false)
      expect(wrapper.vm.getAvailableLevels()).toEqual(
        ['province', 'city', 'area']
      )
    })
    it('关闭 area prop，area 与 town 级别应均为关闭状态', async () => {
      await wrapper.setProps({ area: false })
      expect(wrapper.vm.hasArea).equal(false)
      expect(wrapper.vm.hasTown).equal(false)
      expect(wrapper.vm.getAvailableLevels()).toEqual(
        ['province', 'city']
      )
    })
    it('关闭 city prop，city、area 与 town 级别应均为关闭状态', async () => {
      await wrapper.setProps({ city: false })
      expect(wrapper.vm.hasCity).equal(false)
      expect(wrapper.vm.hasArea).equal(false)
      expect(wrapper.vm.hasTown).equal(false)
      expect(wrapper.vm.getAvailableLevels()).toEqual(
        ['province']
      )
    })
    it('默认全启用状态下，关闭 city prop，city、area 与 town 级别应均为关闭状态', async () => {
      await wrapper.setProps({ city: true, area: true, town: true })
      await wrapper.setProps({ city: false })
      expect(wrapper.vm.hasCity).equal(false)
      expect(wrapper.vm.hasArea).equal(false)
      expect(wrapper.vm.hasTown).equal(false)
      expect(wrapper.vm.getAvailableLevels()).toEqual(
        ['province']
      )
    })
  })

  describe('数据加载模块(loader)', () => {
    it('提供福建省编码，该省的城市数量应为 9 个', () => {
      const list = getCities({ key: '350000' })
      expect(list.length).equal(9)
    })
    it('提供福州市编码，该市的区/县数量应为 13 个', () => {
      const list = getAreas({ key: '350100' })
      expect(list.length).equal(13)
    })
    it('提供台江区编码，该区的乡/镇数量应为 10 个', async () => {
      const list = await getTowns({ key: '350103' })
      expect(list.length).equal(10)
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

  describe('提取行政区划数据文本内容(regionToText)', () => {
    it('使用完整行政区划数据，关闭区/县级别，获得的文本应为`福建省福州市`', () => {
      expect(regionToText(data, ['province', 'city'])).toEqual(['福建省', '福州市'])
    })
    it('不限制区域级别，获得的文本应为`福建省福州市台江区瀛洲街道`', () => {
      expect(regionToText(data)).toEqual(['福建省', '福州市', '台江区', '瀛洲街道'])
    })
  })

  describe('行政区划数据模型转换为参数数据模型（仅编码）(regionToModel)', () => {
    it('获得用于 `v-model` 输入输出数据模型', () => {
      expect(modelToValue(data)).toEqual(model)
    })
  })

  describe('参数数据模型转换为行政区划数据模型(valueToModel)', () => {
    it('获得完整行政区划数据', async () => {
      const value = await valueToModel(model)
      expect(value).toEqual(data)
    })
    it('设置有效区域级别仅为省、市时，仅返回有效级别的数据内容', async () => {
      const value = await valueToModel(model, ['province', 'city'])
      expect(value).toEqual({
        province: {
          key: '350000',
          value: '福建省'
        },
        city: {
          key: '350100',
          value: '福州市'
        }
      })
    })
  })
})
