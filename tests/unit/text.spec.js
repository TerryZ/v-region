import { mount } from '@vue/test-utils'
import { expect } from 'chai'

import Text from '@/components/Text'

// 测试虚拟地级北京市（市级为虚拟级别，数据直接使用父级）
describe('v-region Text 纯文本模式', () => {
  const w = mount(Text, {
    propsData: {
      value: {
        province: '110000',
        city: '110000',
        area: '110101',
        town: '110101001'
      }
    }
  })
  it('使用数据初始化插件后，输出的文本内容应为："北京市北京市东城区"', () => {
    window.setTimeout(() => {
      // expect(w.find('.v-region').text()).to.equal('福建省福州市台江区')
      expect(w.text()).to.equal('北京市北京市东城区')
    }, 1000)
  })
  it('"town" prop 设置为 true，输出的纯文本内容应为："北京市北京市东城区东华门街道"', () => {
    w.setProps({
      town: true
    })
    window.setTimeout(() => {
      expect(w.text()).to.equal('北京市北京市东城区东华门街道')
    }, 1000)
  })
  it('使用错误的数据进行初始化（福建省杭州市台江区宁化街道），最终显示的内容应只有 “福建省”', () => {
    w.setProps({
      value: {
        province: '350000',
        city: '330100',
        area: '350103',
        town: '350103012'
      }
    })
    window.setTimeout(() => {
      expect(w.text()).to.equal('福建省')
    }, 1000)
  })
})
