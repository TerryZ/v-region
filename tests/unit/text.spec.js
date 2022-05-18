import { mount } from '@vue/test-utils'
import { expect } from 'chai'

import Text from '@/RegionText'

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
  it('使用数据初始化插件后，输出的内容应为："北京市北京市东城区东华门街道"', () => {
    // w.vm.$nextTick()
    expect(w.text()).to.equal('北京市北京市东城区东华门街道')
  })
  it('"separator" prop 设置为 "-"，输出的内容应为："北京市-北京市-东城区-东华门街道"', async () => {
    await w.setProps({
      separator: '-'
    })
    expect(w.text()).to.equal('北京市-北京市-东城区-东华门街道')
  })
  // it('使用错误的数据进行初始化（福建省杭州市台江区宁化街道），显示的内容应只有 “福建省”', async () => {
  //   await w.setProps({
  //     value: {
  //       province: '350000',
  //       city: '330100',
  //       area: '350103',
  //       town: '350103012'
  //     }
  //   })
  //   expect(w.text()).to.equal('福建省')
  // })
})
