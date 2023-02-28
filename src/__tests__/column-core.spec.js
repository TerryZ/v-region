import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import { RegionColumnsCore } from '@/'

// 虚拟地级济源市（区/县级为虚拟级别，数据直接使用父级）
describe('v-region Column 竖排多列模式', function () {
  const wrapper = mount(RegionColumnsCore, {
    props: {
      town: true
    }
  })

  it('默认状态下，仅有省级列表一列', async () => {
    expect(wrapper.findAll('.rg-column')).toHaveLength(1)
  })

  it('省级列表选择 `北京市`，`北京市` 项目应高亮，同时应出现市级列表', async () => {
    await wrapper.findAll('.rg-column')[0].findAll('li')[0].trigger('click')
    expect(wrapper.findAll('.rg-column')[0].findAll('li')[0].classes('selected')).to.equal(true)
    expect(wrapper.findAll('.rg-column').length).to.equal(2)
  })

  it('市级列表中应只有 `北京市` 一个项目，选择后 `北京市` 项目高亮，同时应出现区级列表', async () => {
    await wrapper.findAll('.rg-column')[1].findAll('li')[0].trigger('click')
    expect(wrapper.findAll('.rg-column')[1].findAll('li').length).to.equal(1)
    expect(wrapper.findAll('.rg-column')[1].findAll('li')[0].classes('selected')).to.equal(true)
    expect(wrapper.findAll('.rg-column').length).to.equal(3)
  })

  it('区/县级列表选择 `东城区`，选择后 `东城区` 项目高亮，同时应出现乡/镇/街道级列表', async () => {
    await wrapper.findAll('.rg-column')[2].findAll('li')[0].trigger('click')
    await vi.dynamicImportSettled()
    expect(wrapper.findAll('.rg-column')[2].findAll('li')[0].classes('selected')).to.equal(true)
    expect(wrapper.findAll('.rg-column').length).to.equal(4)
  })

  it('乡/镇/街道级列表选择 `东华门街道`，选择后 `东华门街道` 项目高亮', async () => {
    await wrapper.findAll('.rg-column')[3].findAll('li')[0].trigger('click')
    expect(wrapper.findAll('.rg-column')[3].findAll('li')[0].classes('selected')).to.equal(true)
  })

  it('所有级别选择完成后，响应 complete 事件', () => {
    expect(wrapper.emitted()).toHaveProperty('complete')
  })

  it('选中的行政区划内容应为 `北京市北京市东城区东华门街道`', () => {
    expect(wrapper.vm.regionText).equal('北京市北京市东城区东华门街道')
  })

  it('通过 v-model 设置数据后，应有 4 列行政级别列表', async () => {
    await wrapper.setProps({
      modelValue: {
        province: '410000',
        city: '419001',
        area: '419001',
        town: '419001001'
      }
    })
    await vi.dynamicImportSettled()
    expect(wrapper.findAll('.rg-column')).toHaveLength(4)
  })
  it('选中的行政区划内容应为 `河南省济源市济源市济源市沁园街道`', () => {
    expect(wrapper.vm.regionText).equal('河南省济源市济源市济源市沁园街道')
  })

  it('调用 reset 方法，所有选中行政区划数据应被清空，列表应只剩下省级 1 列', async () => {
    await wrapper.vm.reset()
    await vi.dynamicImportSettled()
    expect(wrapper.vm.region).toEqual({
      province: undefined,
      city: undefined,
      area: undefined,
      town: undefined
    })
    expect(wrapper.findAll('.rg-column')).toHaveLength(1)
  })

  it('v-model 响应数据变化，各级别数据应为空', () => {
    const emits = wrapper.emitted('update:modelValue')
    expect(emits[emits.length - 1][0]).toEqual({
      province: undefined,
      city: undefined,
      area: undefined,
      town: undefined
    })
  })

  it('响应 change 事件，响应数据中各级别应为空', () => {
    const emits = wrapper.emitted('change')
    expect(emits[emits.length - 1][0]).toEqual({
      province: undefined,
      city: undefined,
      area: undefined,
      town: undefined
    })
  })
})
