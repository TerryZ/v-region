import { mount } from '@vue/test-utils'
import { expect } from 'chai'

import Column from '@/components/ColumnGroup'

// 虚拟地级济源市（区/县级为虚拟级别，数据直接使用父级）
describe('v-region Column 竖排多列模式', function () {
  const w = mount(Column, {
    propsData: {
      town: true
    }
  })

  it('默认状态下，仅有省级列表一列', () => {
    w.find('.rg-caller-container').trigger('click')
    expect(w.findAll('.rg-column').length).to.equal(1)
  })

  it('省级列表选择 “北京市”，“北京市” 项目应高亮，同时应出现市级列表', () => {
    w.findAll('.rg-column').at(0).findAll('li').at(0).trigger('click')
    expect(w.findAll('.rg-column').at(0).findAll('li').at(0).classes('selected')).to.equal(true)
    expect(w.vm.region.province.key).to.equal('110000')
    expect(w.findAll('.rg-column').length).to.equal(2)
  })

  it('市级列表中应只有 “北京市” 一个项目，选择后 “北京市” 项目高亮，同时应出现区级列表', () => {
    w.findAll('.rg-column').at(1).findAll('li').at(0).trigger('click')
    expect(w.findAll('.rg-column').at(1).findAll('li').length).to.equal(1)
    expect(w.findAll('.rg-column').at(1).findAll('li').at(0).classes('selected')).to.equal(true)
    expect(w.vm.region.city.key).to.equal('110000')
    expect(w.findAll('.rg-column').length).to.equal(3)
  })

  it('区/县级列表选择 “东城区”，选择后 “东城区” 项目高亮，同时应出现乡/镇/街道级列表', () => {
    w.findAll('.rg-column').at(2).findAll('li').at(0).trigger('click')
    expect(w.findAll('.rg-column').at(2).findAll('li').at(0).classes('selected')).to.equal(true)
    expect(w.vm.region.area.key).to.equal('110101')
    expect(w.findAll('.rg-column').length).to.equal(4)
  })

  it('乡/镇/街道级列表选择 “东华门街道”，选择后 “东华门街道” 项目高亮，同时列表关闭', () => {
    w.findAll('.rg-column').at(3).findAll('li').at(0).trigger('click')
    expect(w.findAll('.rg-column').at(3).findAll('li').at(0).classes('selected')).to.equal(true)
    expect(w.vm.region.town.key).to.equal('110101001')
    expect(w.vm.show).to.equal(false)
  })

  it('选中的行政区划内容应为 “北京市北京市东城区东华门街道”', () => {
    expect(w.vm.selectedText).to.equal('北京市北京市东城区东华门街道')
  })

  it('通过 v-model 设置数据后，应有 4 列行政级别列表', () => {
    w.setProps({
      value: {
        province: '410000',
        city: '419001',
        area: '419001',
        town: '419001001'
      }
    })
    expect(w.findAll('.rg-column').length).to.equal(4)
  })
  it('选中的行政区划内容应为 “河南省济源市济源市济源市沁园街道”', () => {
    expect(w.vm.selectedText).to.equal('河南省济源市济源市济源市沁园街道')
  })

  it('点击 X 图标，所有选中行政区划数据应被清空，列表应只剩下省级 1 列', () => {
    w.find('.rg-clear-btn').trigger('click')
    expect(w.vm.region.province).to.equal(null)
    expect(w.vm.region.city).to.equal(null)
    expect(w.vm.region.area).to.equal(null)
    expect(w.vm.region.town).to.equal(null)
    expect(w.findAll('.rg-column').length).to.equal(1)
  })
})
