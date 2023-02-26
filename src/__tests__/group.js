import { mount } from '@vue/test-utils'
import { expect } from 'chai'

import RegionGroup from '@/RegionGroup'

describe('v-region Group 多级别分组模式', function () {
  const w = mount(RegionGroup, {
    propsData: {
      town: true
    }
  })

  it('默认情况下，标题显示文本应为 “行政区划选择器”', () => {
    w.find('.rg-trigger-container').trigger('click')
    expect(w.find('.rg-header').text()).to.equal('行政区划选择器')
  })
  it('应有 4 个行政级别选项卡', () => {
    expect(w.findAll('.rg-level-tabs li').length).to.equal(4)
  })
  it('当前行政级别应为 “省”', () => {
    expect(w.findAll('.rg-level-tabs li').at(0).classes('active')).to.equal(true)
  })
  it('当前应有 34 个省级项目', () => {
    expect(w.findAll('.rg-results li').length).to.equal(34)
  })
  it('选择 “天津市”，当前级别自动切换至 “市” 级', async () => {
    await w.findAll('.rg-results li').at(1).trigger('mouseup')

    expect(w.findAll('.rg-level-tabs li').at(1).classes('active')).to.equal(true)
    // console.dir(w.vm.region.province)
    expect(w.vm.$refs.module.region.province.key).to.equal('120000')
  })
  it('选择 “天津市”，当前级别自动切换至 “区/县” 级', async () => {
    await w.findAll('.rg-results li').at(0).trigger('mouseup')
    expect(w.vm.$refs.module.region.city.key).to.equal('120000')
    expect(w.findAll('.rg-level-tabs li').at(2).classes('active')).to.equal(true)
  })
  it('选择 “和平区”，当前级别自动切换至 “乡/镇/街道” 级', async () => {
    await w.findAll('.rg-results li').at(0).trigger('mouseup')
    expect(w.vm.$refs.module.region.area.key).to.equal('120101')
    expect(w.findAll('.rg-level-tabs li').at(3).classes('active')).to.equal(true)
  })
  it('选择 “劝业场街道”，选择器应自动被关闭/收起', async () => {
    await w.findAll('.rg-results li').at(0).trigger('mouseup')
    expect(w.vm.$refs.module.region.town.key).to.equal('120101001')
    expect(w.vm.show).to.equal(false)
  })
  it('调用按钮中的显示文本应为 “天津市天津市和平区劝业场街道”', () => {
    expect(w.findAll('.rg-default-btn span').at(0).text()).to.equal('天津市天津市和平区劝业场街道')
  })
  it('重新打开选择器，并切换到 “省” 级选择卡，“天津市” 项目应为高亮显示', async () => {
    await w.find('.rg-trigger-container').trigger('click')
    await w.findAll('.rg-level-tabs li').at(0).find('a').trigger('click')
    expect(w.findAll('.rg-level-tabs li').at(0).classes('active')).to.equal(true)
    expect(w.findAll('.rg-results li').at(1).classes('active')).to.equal(true)
  })
  it('切换到 “市” 级选择卡，“天津市” 项目应为高亮显示', async () => {
    await w.findAll('.rg-level-tabs li').at(1).find('a').trigger('click')
    expect(w.findAll('.rg-level-tabs li').at(1).classes('active')).to.equal(true)
    expect(w.findAll('.rg-results li').at(0).classes('active')).to.equal(true)
  })
  it('切换到 “区/县” 级选择卡，“和平区” 项目应为高亮显示', async () => {
    await w.findAll('.rg-level-tabs li').at(2).find('a').trigger('click')
    expect(w.findAll('.rg-level-tabs li').at(2).classes('active')).to.equal(true)
    expect(w.findAll('.rg-results li').at(0).classes('active')).to.equal(true)
  })
  it('切换到 “乡/镇/街道” 级选择卡，“劝业场街道” 项目应为高亮显示', async () => {
    await w.findAll('.rg-level-tabs li').at(3).find('a').trigger('click')
    expect(w.findAll('.rg-level-tabs li').at(3).classes('active')).to.equal(true)
    expect(w.findAll('.rg-results li').at(0).classes('active')).to.equal(true)
  })
  it('选择器标题栏中应显示 “天津市天津市和平区劝业场街道”', () => {
    expect(w.find('.rg-header-text').text()).to.equal('天津市天津市和平区劝业场街道')
  })
  it('点击右上角垃圾桶图标，所有数据应被清空，当前级别应恢复到 “省”级', async () => {
    await w.find('.rg-removeall-button').trigger('click')

    const group = w.findComponent({ ref: 'module' })

    expect(w.findAll('.rg-default-btn span').at(0).text()).to.equal('请选择')
    expect(group.vm.region.province).to.equal(undefined)
    expect(group.vm.region.city).to.equal(undefined)
    expect(group.vm.region.area).to.equal(undefined)
    expect(group.vm.region.town).to.equal(undefined)
    expect(w.findAll('.rg-level-tabs li').at(0).classes('active')).to.equal(true)

    // await w.vm.$nextTick() // 等待事件处理完成

    const inputEmits = group.emitted('input')
    // last time input emit data
    const model = inputEmits[inputEmits.length - 1]

    expect(model.province).to.equal(undefined)
    expect(model.city).to.equal(undefined)
    expect(model.area).to.equal(undefined)
    expect(model.town).to.equal(undefined)
  })

  it('对 v-model/value 设置值进行初始化，选中的区划信息应为 “广东省中山市中山市石岐区街道办事处”', async () => {
    await w.setProps({
      value: {
        province: '440000',
        city: '442000',
        area: '442000',
        town: '442000001'
      }
    })
    expect(w.findAll('.rg-default-btn span').at(0).text()).to.equal('广东省中山市中山市石岐区街道办事处')
  })
  it('点击 X 图标，所有选中行政区划数据应被清空', async () => {
    await w.find('.rg-clear-btn').trigger('click')
    expect(w.vm.$refs.module.region.province).to.equal(undefined)
    expect(w.vm.$refs.module.region.city).to.equal(undefined)
    expect(w.vm.$refs.module.region.area).to.equal(undefined)
    expect(w.vm.$refs.module.region.town).to.equal(undefined)
  })
})
