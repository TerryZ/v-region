import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import { RegionColumns, RegionFullColumns, RegionColumnsCore } from '@/'

import { model, regionText, regionText1, model1, emptyDataModel, data } from './data'

// 组件内透传的事件无法向外传递(已通过 vi.vn 解决)
// https://github.com/vuejs/test-utils/issues/1509

describe('v-region RegionColumns 多列竖排选择器模式', () => {
  describe('三级模式', async () => {
    const changeFn = vi.fn()
    const updateFn = vi.fn()
    const visibleChangeFn = vi.fn()
    const wrapper = mount(RegionColumns, {
      props: {
        language: 'en',
        onChange: changeFn,
        'onUpdate:modelValue': updateFn,
        onVisibleChange: visibleChangeFn
      }
    })
    await wrapper.find('.dd-trigger').trigger('click')

    it('打开选择器，应响应 `visible-change` 事件', () => {
      expect(visibleChangeFn).toHaveBeenCalled()
      expect(visibleChangeFn).toHaveBeenCalledWith(true)
      // expect(wrapper.emitted()).toHaveProperty('visible-change')
      // expect(wrapper.emitted('visible-change')[0]).toEqual([true])
    })
    it('触发对象应显示文本 `Please select`(设置英文语言)', () => {
      expect(wrapper.find('.dd-default-trigger').text()).toBe('Please select')
    })
    it('设置 modelValue，触发对象按钮中应显示 `福建省福州市台江区`', async () => {
      await wrapper.setProps({ modelValue: model })
      await flushPromises()
      expect(
        wrapper.getComponent(RegionColumnsCore).findAll('.rg-column')
      ).toHaveLength(3)
      expect(wrapper.find('.dd-default-trigger').text()).toBe('福建省福州市台江区')
    })
    it('响应 change 事件', async () => {
      expect(changeFn).toHaveBeenCalled()
      expect(changeFn).toHaveBeenCalledWith({
        province: {
          key: '350000',
          value: '福建省'
        },
        city: {
          key: '350100',
          value: '福州市'
        },
        area: {
          key: '350103',
          value: '台江区'
        },
        town: undefined
      })
      expect(updateFn).toHaveBeenCalled()
      expect(updateFn).toHaveBeenCalledWith({
        province: '350000',
        city: '350100',
        area: '350103',
        town: undefined
      })
    })
    it('再次设置 modelValue，触发对象按钮中应显示 `河南省济源市济源市`', async () => {
      await wrapper.setProps({ modelValue: model1 })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.dd-default-trigger').text()).toBe('河南省济源市济源市')
    })
    it('设置空值，所有选中的行政级别应被清空', async () => {
      await wrapper.setProps({ modelValue: emptyDataModel })
      await flushPromises()
      expect(wrapper.find('.dd-default-trigger').text()).toBe('Please select')
    })
    it('响应 v-model 为空数据', () => {
      expect(updateFn).toHaveBeenCalledWith(emptyDataModel)
    })
    it('响应事件 change 应返回空数据', () => {
      expect(changeFn).toHaveBeenCalledWith(emptyDataModel)
    })
  })

  describe('四级模式', () => {
    const changeFn = vi.fn()
    const updateFn = vi.fn()
    const wrapper = mount(RegionFullColumns, {
      props: {
        town: true,
        onChange: changeFn,
        'onUpdate:modelValue': updateFn
      }
    })

    it('设置 modelValue，触发对象按钮中应显示 `福建省福州市台江区瀛洲街道`', async () => {
      await wrapper.setProps({ modelValue: model })
      await vi.dynamicImportSettled()
      expect(
        wrapper.getComponent(RegionColumnsCore).findAll('.rg-column')
      ).toHaveLength(4)
      expect(wrapper.find('.dd-default-trigger').text()).toBe(regionText)
    })
    it('重置与事件响应', async () => {
      expect(changeFn).toHaveBeenCalled()
      expect(changeFn).toHaveBeenCalledWith(data)
      // 使用空值进行重置
      await wrapper.setProps({ modelValue: emptyDataModel })
      await flushPromises()
      expect(changeFn).toHaveBeenCalled()
      expect(changeFn).toHaveBeenCalledWith(emptyDataModel)
      expect(updateFn).toHaveBeenCalled()
      expect(updateFn).toHaveBeenCalledWith(emptyDataModel)
    })
    it('再次设置 modelValue，触发对象按钮中应显示 `河南省济源市济源市济源市沁园街道`', async () => {
      await wrapper.setProps({ modelValue: model1 })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.dd-default-trigger').text()).toBe(regionText1)
    })
    it('关闭 town 级别，则只有 3 个行政级别', async () => {
      await wrapper.setProps({ town: false })
      expect(
        wrapper.getComponent(RegionColumnsCore).findAll('.rg-column')
      ).toHaveLength(3)
    })
  })
})
