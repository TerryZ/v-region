import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import { RegionGroupDropdown } from './components/dropdown'

describe('RegionGroup 分组核心模块', function () {
  const wrapper = mount(RegionGroupDropdown, {
    props: {
    }
  })
  it('初始化后，触发器按钮应显示 `请选择` 文字', () => {
    expect(wrapper.find('.dd-default-trigger').text()).toBe('请选择')
  })
  it('使用数据进行初始化后，应有 2 个城市被选中（“广东省中山市中山市”）', async () => {
    await wrapper.setProps({
      modelValue: {
        province: '440000',
        city: '442000',
        area: '442000',
        town: '442000001'
      }
    })
    await flushPromises()
    expect(wrapper.find('.dd-default-trigger').text()).toBe('广东省中山市中山市')
  })
})
