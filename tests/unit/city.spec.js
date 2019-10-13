import { mount } from '@vue/test-utils'
import { expect } from 'chai'

import CityPicker from '@/components/CityPicker'

describe('v-region CityPicker 城市选择器模式', function () {
  const w = mount(CityPicker, {
    propsData: {
      value: ['110000', '350100']
    }
  })

  it('使用数据进行初始化后，应有 2 个城市被选中（“北京市,福州市”）', () => {
    expect(w.vm.picked.length).to.equal(2)
    expect(w.vm.selectedText).to.equal('北京市,福州市')
  })

  it('点击 X 图标，所有选中城市应被清空', () => {
    w.find('.rg-clear-btn').trigger('click')
    expect(w.vm.picked.length).to.equal(0)
  })

  it('在搜索框中输入 “上”，结果列表中应只有两个城市', () => {
    w.find('.rg-caller-container').trigger('click')
    w.find('.rg-input').setValue('上')
    expect(w.findAll('li').length).to.equal(2)
  })

  it('点击列表中的两个城市，并清空搜索关键字', () => {
    w.findAll('li').trigger('click')
    expect(w.vm.picked.length).to.equal(2)
    w.find('.rg-input').setValue('')
  })

  it('在完整的城市列表中，上一阶段选中的 2 个项目应被高亮显示', () => {
    expect(w.findAll('li.selected').length).to.equal(2)
  })
})
