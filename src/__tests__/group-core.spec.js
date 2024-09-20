import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import { RegionGroupCore, RegionFullGroupCore } from '@/'

describe('v-region RegionGroupCore 多级别分组核心模块', function () {
  describe('三级模式', () => {
    const wrapper = mount(RegionGroupCore, {
      props: {
      }
    })

    it('默认情况下，标题显示文本应为`行政区划`', () => {
      expect(wrapper.find('.rg-header').text()).toBe('行政区划')
    })
    it('应有 3 个行政级别选项卡', () => {
      expect(wrapper.findAll('.rg-level-tabs li')).toHaveLength(3)
    })
    it('当前行政级别应为`省`', () => {
      expect(wrapper.findAll('.rg-level-tabs li')[0].classes('active')).toBeTruthy()
    })
    it('当前应有 34 个省级项目', () => {
      expect(wrapper.findAll('.rg-results li')).toHaveLength(34)
    })
    it('选择省 `天津市`，当前级别自动切换至 `市` 级', async () => {
      wrapper.findAll('.rg-results li')[1].trigger('mouseup')
      await flushPromises()
      expect(wrapper.findAll('.rg-level-tabs li')[1].classes('active')).toBeTruthy()
    })
    it('选择市 `天津市`，当前级别自动切换至 `区/县` 级', async () => {
      wrapper.findAll('.rg-results li')[0].trigger('mouseup')
      await flushPromises()
      expect(wrapper.findAll('.rg-level-tabs li')[2].classes('active')).toBe(true)
    })
    it('选择区 `和平区`，', async () => {
      wrapper.findAll('.rg-results li')[0].trigger('mouseup')
      await flushPromises()
      expect(wrapper.emitted()).toHaveProperty('complete')
    })
    it('此时标题栏显示文本应为`天津市天津市和平区`', () => {
      expect(wrapper.find('.rg-header').text()).toBe('天津市天津市和平区')
    })
    it('重新打开选择器，并切换到 "省" 级选择卡，“天津市” 项目应为高亮显示', async () => {
      await wrapper.findAll('.rg-level-tabs li')[0].find('a').trigger('click')
      expect(wrapper.findAll('.rg-level-tabs li')[0].classes('active')).toBe(true)
      expect(wrapper.findAll('.rg-results li')[1].classes('active')).toBe(true)
    })
    it('切换到 “市” 级选择卡，“天津市” 项目应为高亮显示', async () => {
      await wrapper.findAll('.rg-level-tabs li')[1].find('a').trigger('click')
      expect(wrapper.findAll('.rg-level-tabs li')[1].classes('active')).toBe(true)
      expect(wrapper.findAll('.rg-results li')[0].classes('active')).toBe(true)
    })
    it('切换到 “区/县” 级选择卡，“和平区” 项目应为高亮显示', async () => {
      await wrapper.findAll('.rg-level-tabs li')[2].find('a').trigger('click')
      expect(wrapper.findAll('.rg-level-tabs li')[2].classes('active')).toBe(true)
      expect(wrapper.findAll('.rg-results li')[0].classes('active')).toBe(true)
    })
    it('点击右上角垃圾桶图标，所有数据应被清空，当前级别应恢复到 “省”级', async () => {
      await wrapper.find('.rg-header-control button').trigger('click')

      expect(wrapper.find('.rg-header').text()).toBe('行政区划')
      expect(wrapper.findAll('.rg-level-tabs li')[0].classes('active')).toBe(true)

      const inputEmits = wrapper.emitted('update:modelValue')
      const model = inputEmits[inputEmits.length - 1]

      expect(model.province).toBe(undefined)
      expect(model.city).toBe(undefined)
      expect(model.area).toBe(undefined)
      expect(model.town).toBe(undefined)
    })

    it('对 v-model/value 设置值进行初始化，选中的区划信息应为 “广东省中山市中山市”', async () => {
      await wrapper.setProps({
        modelValue: {
          province: '440000',
          city: '442000',
          area: '442000',
          town: '442000001'
        }
      })
      await flushPromises()
      expect(wrapper.find('.rg-header-text').text()).toBe('广东省中山市中山市')
    })
  })

  describe('四级模式', () => {
    const wrapper = mount(RegionFullGroupCore)
    const core = wrapper.findComponent(RegionGroupCore)

    it('应有 4 个行政级别选项卡', () => {
      expect(wrapper.findAll('.rg-level-tabs li')).toHaveLength(4)
    })
    it('选择 `天津市`，当前级别自动切换至 `市` 级', async () => {
      wrapper.findAll('.rg-results li')[1].trigger('mouseup')
      await flushPromises()
      expect(wrapper.findAll('.rg-level-tabs li')[1].classes('active')).toBeTruthy()
    })
    it('选择 `天津市`，当前级别自动切换至 `区/县` 级', async () => {
      wrapper.findAll('.rg-results li')[0].trigger('mouseup')
      await flushPromises()
      expect(wrapper.findAll('.rg-level-tabs li')[2].classes('active')).toBe(true)
    })
    it('选择 `和平区`，当前级别自动切换至 `乡/镇/街道` 级', async () => {
      await wrapper.findAll('.rg-results li')[0].trigger('mouseup')
      await vi.dynamicImportSettled()
      // await flushPromises()
      expect(wrapper.findAll('.rg-level-tabs li')[3].classes('active')).toBe(true)
    })
    it('选择 `劝业场街道`，选择后，应响应 complete 事件，代表所有级别均选择完成', async () => {
      await wrapper.findAll('.rg-results li')[0].trigger('mouseup')
      await flushPromises()
      expect(core.emitted()).toHaveProperty('complete')
    })
    it('此时标题栏显示文本应为`天津市天津市和平区劝业场街道`', () => {
      expect(wrapper.find('.rg-header').text()).toBe('天津市天津市和平区劝业场街道')
    })
    it('对 v-model/value 设置值进行初始化，选中的区划信息应为 “广东省中山市中山市石岐区街道办事处”', async () => {
      await wrapper.setProps({
        modelValue: {
          province: '440000',
          city: '442000',
          area: '442000',
          town: '442000001'
        }
      })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.rg-header-text').text()).toBe('广东省中山市中山市石岐区街道办事处')
    })
    it('关闭 town 级别，则只有 3 个行政级别', async () => {
      await wrapper.setProps({ town: false })
      expect(wrapper.findAll('.rg-level-tabs li')).toHaveLength(3)
    })
  })
})
