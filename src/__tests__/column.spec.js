import { describe, it, expect, vi, test } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import { RegionColumns } from '@/'
import { data, model, regionText, emptyDataModel } from './data'
import { nextTick } from 'vue'

// TODO: 组件内透传的事件无法向外传递
// https://github.com/vuejs/test-utils/issues/1509

describe('v-region RegionColumns 多列竖排选择器模式', () => {
  const change = vi.fn()
  const wrapper = mount(RegionColumns, {
    props: {
      language: 'en',
      town: true,
      change
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

  test('响应 change 事件', async () => {
    // wrapper.vm.reset()
    // await wrapper.trigger('click')
    // console.log(wrapper.find({ ref: 'columns' }))
    await nextTick()
    await flushPromises()
    console.log(wrapper.emitted())
    // console.log(wrapper.html())
    expect(change).toHaveBeenCalled()

    expect(wrapper.emitted('change')[0]).toEqual([data])
  })

  // it('使用数据进行初始化后，应有 2 个城市被选中（“北京市,福州市”）', () => {
  //   expect(wrapper.find('.rg-default-btn').text()).toBe('北京市,福州市')
  // })

  // it('数据初始化后，响应 change 事件并返回相应完整城市模型', () => {
  //   expect(wrapper.emitted('change')[0]).toEqual([[
  //     { key: '110000', value: '北京市' },
  //     { key: '350100', value: '福州市' }
  //   ]])
  // })

  // it('点击 X 图标，所有选中的行政应被清空', async () => {
  //   await wrapper.find('.rg-clear-btn').trigger('click')
  //   expect(wrapper.find('.rg-default-btn').text()).toBe('Please select')
  // })

  // it('响应 v-model 为空数据', () => {
  //   console.log(wrapper.emitted())
  //   expect(wrapper.emitted('update:modelValue')[0]).toEqual([emptyDataModel])
  // })
  // it('响应事件 change 应返回空数据', () => {
  //   console.log(wrapper.emitted())
  //   expect(wrapper.emitted('change')[1]).toEqual([emptyDataModel])
  // })
})
