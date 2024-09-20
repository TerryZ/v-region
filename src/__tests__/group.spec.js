import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import { RegionGroup, RegionFullGroup, RegionGroupCore } from '@/'

import { model, regionText, regionText1, model1, emptyDataModel } from './data'

// TODO: 组件内透传的事件无法向外传递
// https://github.com/vuejs/test-utils/issues/1509

describe('v-region RegionGroup 多分组择器模式', () => {
  describe('三级模式', () => {
    const wrapper = mount(RegionGroup, {
      props: {
        language: 'en',
        customTriggerClass: 'custom-trigger',
        customContainerClass: 'custom-container'
      }
    })
    const core = wrapper.findComponent(RegionGroupCore)
    it('设置 `customTriggerClass` prop，触发对象容器应添加相应样式类', () => {
      expect(wrapper.classes('custom-trigger')).toBeTruthy()
    })
    it('设置 `customContainerClass` prop，下拉容器应添加相应样式类', () => {
      const core = wrapper.findComponent(RegionGroupCore)
      expect(core.element.parentElement.classList.contains('custom-container')).toBeTruthy()
    })
    it('触发对象应显示文本 `Please select`(设置英文语言)', () => {
      expect(wrapper.find('.rg-default-btn').text()).toBe('Please select')
    })
    it('设置 modelValue，触发对象按钮中应显示 `福建省福州市台江区`', async () => {
      await wrapper.setProps({ modelValue: model })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.rg-default-btn').text()).toBe('福建省福州市台江区')
    })
    it('响应 change 事件', async () => {
      await wrapper.setProps({ modelValue: emptyDataModel })
      // await nextTick()
      await flushPromises()
      await vi.dynamicImportSettled()
      console.log(core.emitted())
      console.log(wrapper.emitted())
      expect(core.emitted()).toHaveProperty('change')
      // expect(change).toHaveBeenCalled()

      // expect(wrapper.emitted('change')[0]).toEqual([data])
    })
    it('再次设置 modelValue，触发对象按钮中应显示 `河南省济源市济源市`', async () => {
      await wrapper.setProps({ modelValue: model1 })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.rg-default-btn').text()).toBe('河南省济源市济源市')
    })
    it('指定全空值，所有选中的行政级别应被清空', async () => {
      await wrapper.setProps({ modelValue: emptyDataModel })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.rg-default-btn').text()).toBe('Please select')
      // console.log(core.html())
      // console.log(core.emitted())
      // console.log(wrapper.emitted())
    })
    // it('响应 v-model 为空数据', () => {
    //   console.log(wrapper.emitted())
    //   expect(wrapper.emitted('update:modelValue')[0]).toEqual([emptyDataModel])
    // })
    // it('响应事件 change 应返回空数据', () => {
    //   console.log(wrapper.emitted())
    //   expect(wrapper.emitted('change')[1]).toEqual([emptyDataModel])
    // })
  })

  describe('四级模式', () => {
    const wrapper = mount(RegionFullGroup, {
      props: {
        language: 'en',
        town: true,
        customTriggerClass: 'custom-trigger',
        customContainerClass: 'custom-container'
      }
    })

    it('设置 modelValue，触发对象按钮中应显示 `福建省福州市台江区瀛洲街道`', async () => {
      await wrapper.setProps({ modelValue: model })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.rg-default-btn').text()).toBe(regionText)
    })
    it('再次设置 modelValue，触发对象按钮中应显示 `河南省济源市济源市济源市沁园街道`', async () => {
      await wrapper.setProps({ modelValue: model1 })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.rg-default-btn').text()).toBe(regionText1)
    })
  })
})
