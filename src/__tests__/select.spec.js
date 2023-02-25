import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { nextTick } from 'vue'
import { RegionSelects } from '@/'
import RegionSelect from '@/components/Select'
import Dropdown from 'v-dropdown'

describe('v-region Select 表单元素下拉列表模式', function () {
  const wrapper = mount(RegionSelects, {
    props: {
    }
  })
  it('不指定任何参数，默认可处理行政级别数量为 3 （省、市、区）', () => {
    expect(wrapper.findAll('.rg-select').length).to.equal(3)
  })

  it('"town" prop 设置为 true，可处理行政级别数量为 4 （省、市、区、乡）', async () => {
    await wrapper.setProps({ town: true })

    await nextTick()

    expect(wrapper.findAll('.rg-select').length).to.equal(4)
  })

  it('"area" prop 设置为 false，可处理行政级别数量应为 2 （省、市）', async () => {
    await wrapper.setProps({ area: false })

    await nextTick()
    expect(wrapper.findAll('.rg-select').length).to.equal(2)
  })

  it('"blank" prop 设置为 false，下拉列表中则没有 “请选择” 项目', async () => {
    const wb = await mount(RegionSelects, {
      props: {
        blank: false
      }
    })
    await nextTick()

    await wb.findAllComponents(RegionSelect)[0].trigger('click')

    await nextTick()
    console.log(
      wb.findAllComponents(RegionSelect)[0]
    )

    // console.log(wb.vm)
    expect(wb.findAll('.rg-select__list')[0].findAll('li')[0].text()).to.not.equal('请选择')
  })

  it('"disabled" prop 设置为 true，禁用插件，所有下拉项目必须为禁用状态', () => {
    const wd = mount(RegionSelects, {
      propsData: {
        town: true,
        disabled: true
      }
    })
    expect(wd.findAll('.rg-select__el--disabled').length).to.equal(4)
  })

  describe('功能操作', () => {
    const wrapperOperate = mount(RegionSelects, {
      propsData: {
        type: 'select',
        town: true
      }
    })

    it('省级列表中选中 “河北省”，选择元素显示的文本应为 “河北省”', async () => {
      await wrapperOperate.findAll('.rg-select').at(0).trigger('click')
      await wrapperOperate.findAll('.rg-select__list').at(0).findAll('li').at(3).trigger('click')
      expect(wrapperOperate.findAll('.rg-select__content').at(0).text()).to.equal('河北省')
      expect(wrapperOperate.emitted('input')[0][0].province).to.equal('130000')
    })

    it('当前省级选中的数据应为 "130000" （河北省）', () => {
      expect(wrapperOperate.vm.region.province.key).to.equal('130000')
    })
    it('城市列表中选中 “唐山市”，选择元素显示的文本应为 “唐山市”', async () => {
      await wrapperOperate.findAll('.rg-select').at(1).trigger('click')
      await wrapperOperate.findAll('.rg-select__list').at(1).findAll('li').at(2).trigger('click')
      expect(wrapperOperate.findAll('.rg-select__content').at(1).text()).to.equal('唐山市')
      expect(wrapperOperate.vm.region.city.key).to.equal('130200')
    })
    it('区/县列表中选中 “路南区”，选择元素显示的文本应为 “路南区”', async () => {
      await wrapperOperate.findAll('.rg-select').at(2).trigger('click')
      await wrapperOperate.findAll('.rg-select__list').at(2).findAll('li').at(1).trigger('click')
      expect(wrapperOperate.findAll('.rg-select__content').at(2).text()).to.equal('路南区')
      expect(wrapperOperate.vm.region.area.key).to.equal('130202')
    })
    it('乡/镇/街道列表中选中 “友谊街道”，选择元素显示的文本应为 “友谊街道”', async () => {
      await wrapperOperate.findAll('.rg-select').at(3).trigger('click')
      await wrapperOperate.findAll('.rg-select__list').at(3).findAll('li').at(2).trigger('click')
      expect(wrapperOperate.findAll('.rg-select__content').at(3).text()).to.equal('友谊街道')
      expect(wrapperOperate.vm.region.town.key).to.equal('130202002')
    })
    it('省级修改为 “北京市”，选择元素显示的文本应当变更为 “北京市”', async () => {
      await wrapperOperate.findAll('.rg-select').at(0).trigger('click')
      await wrapperOperate.findAll('.rg-select__list').at(0).findAll('li').at(1).trigger('click')
      expect(wrapperOperate.findAll('.rg-select__content').at(0).text()).to.equal('北京市')
      expect(wrapperOperate.vm.region.province.key).to.equal('110000')
    })
    it('城市元素显示的文本应为 “请选择”，且城市列表中只有 2 个项目', async () => {
      await wrapperOperate.findAll('.rg-select').at(1).trigger('click')
      expect(wrapperOperate.findAll('.rg-select__list').at(1).findAll('li').length).to.equal(2)
      expect(wrapperOperate.findAll('.rg-select__content').at(1).text()).to.equal('请选择')
      expect(wrapperOperate.vm.region.city).to.equal(undefined)
    })
    it('区/县元素显示的文本应为 “请选择”，且区/县列表中只有 1 个项目（“请选择”）', () => {
      expect(wrapperOperate.findAll('.rg-select__content').at(2).text()).to.equal('请选择')
      expect(wrapperOperate.vm.region.area).to.equal(undefined)
    })
    it('乡/镇/街道元素显示的文本应为 “请选择”，且乡/镇/街道列表中只有 1 个项目（“请选择”）', () => {
      expect(wrapperOperate.findAll('.rg-select__content').at(3).text()).to.equal('请选择')
      expect(wrapperOperate.vm.region.town).to.equal(undefined)
    })
  })
})
