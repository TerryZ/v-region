import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref, nextTick } from 'vue'

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
  })

  it('v-model', async () => {
    await wrapper.setProps({
      modelValue: model
    })
    await flushPromises()

    // window.setTimeout(() => {
    console.log(wrapper.vm.data)
    expect(wrapper.emitted().change[1][0]).toEqual(data)
    // }, 1000)
  })
})
