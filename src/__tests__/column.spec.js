import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import { RegionColumns } from '@/'
import { model, regionText, regionText1, model1 } from './data'

// TODO: 组件内透传的事件无法向外传递
// https://github.com/vuejs/test-utils/issues/1509

describe('v-region RegionColumns 多列竖排选择器模式', () => {
  const wrapper = mount(RegionColumns, {
    props: {
      language: 'en',
      town: true
    }
  })

  it('触发对象应显示文本 `Please select`(设置英文语言)', () => {
    expect(wrapper.find('.rg-default-btn').text()).toBe('Please select')
  })

  it('设置 modelValue，触发对象按钮中应显示 `福建省福州市台江区瀛洲街道`', async () => {
    await wrapper.setProps({ modelValue: model })
    await vi.dynamicImportSettled()
    expect(wrapper.find('.rg-default-btn').text()).toBe(regionText)
  })

  // test('响应 change 事件', async () => {
  //   wrapper.vm.reset()
  //   await nextTick()
  //   await flushPromises()
  //   console.log(wrapper.emitted())
  //   console.log(wrapper.html())
  //   expect(change).toHaveBeenCalled()

  //   expect(wrapper.emitted('change')[0]).toEqual([data])
  // })

  it('点击 X 图标，所有选中的行政级别应被清空', async () => {
    await wrapper.find('.rg-clear-btn').trigger('click')
    expect(wrapper.find('.rg-default-btn').text()).toBe('Please select')
  })

  it('再次设置 modelValue，触发对象按钮中应显示 `河南省济源市济源市济源市沁园街道`', async () => {
    await wrapper.setProps({ modelValue: model1 })
    await vi.dynamicImportSettled()
    expect(wrapper.find('.rg-default-btn').text()).toBe(regionText1)
  })

  it('调用 reset 方法，所有选中的行政级别应被清空', async () => {
    await wrapper.vm.reset()
    await vi.dynamicImportSettled()
    expect(wrapper.find('.rg-default-btn').text()).toBe('Please select')
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
