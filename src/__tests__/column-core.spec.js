import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import { RegionColumns, RegionFullColumns } from '../'
import { emptyDataModel } from './data'

// 虚拟地级济源市（区/县级为虚拟级别，数据直接使用父级）
describe('v-region Column 竖排多列模式', () => {
  describe('三级模式', () => {
    const wrapper = mount(RegionColumns)

    it('默认状态下，仅有省级列表一列', async () => {
      expect(wrapper.findAll('.rg-column')).toHaveLength(1)
    })
    it('省级列表选择 `北京市`，`北京市` 项目应高亮，同时应出现市级列表', async () => {
      await wrapper.findAll('.rg-column')[0].findAll('li')[0].trigger('click')
      expect(wrapper.findAll('.rg-column')[0].findAll('li')[0].classes('selected')).to.equal(true)
      expect(wrapper.findAll('.rg-column')).toHaveLength(2)
    })
    it('市级列表中应只有 `北京市` 一个项目，选择后 `北京市` 项目高亮，同时应出现区级列表', async () => {
      await wrapper.findAll('.rg-column')[1].findAll('li')[0].trigger('click')
      expect(wrapper.findAll('.rg-column')[1].findAll('li').length).to.equal(1)
      expect(wrapper.findAll('.rg-column')[1].findAll('li')[0].classes('selected')).to.equal(true)
      expect(wrapper.findAll('.rg-column')).toHaveLength(3)
    })
    it('区/县级列表选择 `东城区`，选择后 `东城区` 项目高亮', async () => {
      await wrapper.findAll('.rg-column')[2].findAll('li')[0].trigger('click')
      await flushPromises()
      expect(wrapper.findAll('.rg-column')[2].findAll('li')[0].classes('selected')).to.equal(true)
      expect(wrapper.findAll('.rg-column')).toHaveLength(3)
    })
    it('所有级别选择完成后，响应 complete 事件', () => {
      expect(wrapper.emitted()).toHaveProperty('complete')
    })
    it('通过 v-model 设置数据后，应有 3 列行政级别列表', async () => {
      await wrapper.setProps({
        modelValue: {
          province: '410000',
          city: '419001',
          area: '419001',
          town: '419001001'
        }
      })
      await flushPromises()
      expect(wrapper.findAll('.rg-column')).toHaveLength(3)
    })
    it('设置空值对象，所有选中行政区划数据应被清空，列表应只剩下省级 1 列', async () => {
      await wrapper.setProps({ modelValue: emptyDataModel })
      await flushPromises()
      expect(wrapper.findAll('.rg-column')).toHaveLength(1)
    })
    it('v-model 响应数据变化，各级别数据应为空', () => {
      const emits = wrapper.emitted('update:modelValue')
      expect(emits[emits.length - 1][0]).toEqual(emptyDataModel)
    })
    it('响应 change 事件，响应数据中各级别应为空', () => {
      const emits = wrapper.emitted('change')
      expect(emits[emits.length - 1][0]).toEqual(emptyDataModel)
    })
  })

  describe('四级模式', () => {
    const wrapper = mount(RegionFullColumns, {
      props: {
        town: true
      }
    })
    const core = wrapper.getComponent(RegionColumns)

    it('默认状态下，仅有省级列表一列', async () => {
      expect(wrapper.findAll('.rg-column')).toHaveLength(1)
    })
    it('省级列表选择 `北京市`，`北京市` 项目应高亮，同时应出现市级列表', async () => {
      await wrapper.findAll('.rg-column')[0].findAll('li')[0].trigger('click')
      expect(wrapper.findAll('.rg-column')[0].findAll('li')[0].classes('selected')).toBeTruthy()
      expect(wrapper.findAll('.rg-column')).toHaveLength(2)
    })
    it('市级列表中应只有 `北京市` 一个项目，选择后 `北京市` 项目高亮，同时应出现区级列表', async () => {
      await wrapper.findAll('.rg-column')[1].findAll('li')[0].trigger('click')
      expect(wrapper.findAll('.rg-column')[1].findAll('li').length).to.equal(1)
      expect(wrapper.findAll('.rg-column')[1].findAll('li')[0].classes('selected')).toBeTruthy()
      expect(wrapper.findAll('.rg-column')).toHaveLength(3)
    })
    it('区/县级列表选择 `东城区`，选择后 `东城区` 项目高亮，同时应出现乡镇级列表', async () => {
      await wrapper.findAll('.rg-column')[2].findAll('li')[0].trigger('click')
      // await flushPromises()
      await vi.dynamicImportSettled()
      expect(wrapper.findAll('.rg-column')[2].findAll('li')[0].classes('selected')).toBeTruthy()
      expect(wrapper.findAll('.rg-column')).toHaveLength(4)
    })
    it('乡/镇级列表选择 `东华门街道`，选择后该项目高亮', async () => {
      await wrapper.findAll('.rg-column')[3].findAll('li')[0].trigger('click')
      expect(wrapper.findAll('.rg-column')[3].findAll('li')[0].classes('selected')).toBeTruthy()
      expect(wrapper.findAll('.rg-column')).toHaveLength(4)
    })
    it('所有级别选择完成后，响应 complete 事件', () => {
      expect(core.emitted()).toHaveProperty('complete')
    })
    it('关闭 town 级别，则只有 3 个行政级别', async () => {
      await wrapper.setProps({ town: false })
      expect(wrapper.findAll('.rg-column')).toHaveLength(3)
    })
  })
})
