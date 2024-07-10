import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import { RegionText } from '@/'

describe('v-region Text 纯文本模式', () => {
  describe('初始化与变更', async () => {
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

    test('使用数据初始化后，输出的内容应为：`北京市北京市东城区东华门街道`', async () => {
      expect(wrapper.text()).to.equal('北京市北京市东城区东华门街道')
    })
    test('修改数据后，输出内容应为 `福建省福州市仓山区金山街道`', async () => {
      await wrapper.setProps({
        modelValue: {
          province: '350000',
          city: '350100',
          area: '350104',
          town: '350104008'
        }
      })
      await vi.dynamicImportSettled()
      expect(wrapper.text()).to.equal('福建省福州市仓山区金山街道')
    })
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
