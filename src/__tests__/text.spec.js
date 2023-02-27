import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import { RegionText } from '@/'

describe('v-region Text 纯文本模式', () => {
  test('使用数据初始化插件后，输出的内容应为："北京市北京市东城区东华门街道"', async () => {
    const wrapper = mount(RegionText, {
      props: {
        modelValue: {
          province: '110000',
          city: '110000',
          area: '110101',
          town: '110101001'
        }
      }
    })
    await vi.dynamicImportSettled()
    expect(wrapper.text()).to.equal('北京市北京市东城区东华门街道')
  })
  test('"separator" prop 设置为 "-"，输出的内容应为："北京市-北京市-东城区-东华门街道"', async () => {
    const wrapper = mount(RegionText, {
      props: {
        modelValue: {
          province: '110000',
          city: '110000',
          area: '110101',
          town: '110101001'
        },
        separator: '-'
      }
    })
    await vi.dynamicImportSettled()
    expect(wrapper.text()).to.equal('北京市-北京市-东城区-东华门街道')
  })
})
