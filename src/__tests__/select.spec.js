import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { nextTick } from 'vue'
import { RegionSelects, RegionFullSelects } from '@/'
// import SelectLevelList from '@/modules/select/SelectLevelList'

describe('v-region Select 表单元素下拉列表模式', () => {
  describe('三级模式', () => {
    const wrapper = mount(RegionSelects, {
      props: {
      }
    })
    it('可处理行政级别数量为 3 （省、市、区）', () => {
      expect(wrapper.findAll('.dd-trigger').length).to.equal(3)
    })
    it('"area" prop 设置为 false，可处理行政级别数量应为 2 （省、市）', async () => {
      await wrapper.setProps({ area: false })
      await nextTick()
      expect(wrapper.findAll('.dd-trigger').length).to.equal(2)
    })
    it('"disabled" prop 设置为 true，禁用插件，所有下拉项目必须为禁用状态', () => {
      const wd = mount(RegionSelects, {
        propsData: {
          town: true,
          disabled: true
        }
      })
      expect(wd.findAll('.dd-disabled').length).to.equal(3)
    })
  })

  describe('四级模式', () => {
    const wrapper = mount(RegionFullSelects, {
      props: {
      }
    })
    it('不指定任何参数，默认可处理行政级别数量为 4 （省、市、区、乡）', () => {
      expect(wrapper.findAll('.dd-trigger').length).to.equal(4)
    })
    it('"town" prop 设置为 false，可处理行政级别数量为 3 （省、市、区）', async () => {
      await wrapper.setProps({ town: false })
      await nextTick()
      expect(wrapper.findAll('.dd-trigger').length).to.equal(3)
    })
    it('"area" prop 设置为 false，可处理行政级别数量应为 2 （省、市）', async () => {
      await wrapper.setProps({ area: false })
      await nextTick()
      expect(wrapper.findAll('.dd-trigger').length).to.equal(2)
    })
    it('"disabled" prop 设置为 true，禁用插件，所有下拉项目必须为禁用状态', () => {
      const wd = mount(RegionFullSelects, {
        propsData: {
          disabled: true
        }
      })
      expect(wd.findAll('.dd-disabled').length).to.equal(4)
    })
  })
})
