import '../../styles/column.sass'

import { defineComponent, nextTick, provide, watch } from 'vue'

import { useRegionUI } from '../../core/region-ui'
import { mergeBaseProps, mergeEmits } from '../../core/options'
import {
  PROVINCE, CITY, AREA, keyInternal
} from '../../constants'
import { useDropdown } from 'v-dropdown'

import ColumnLevel from './ColumnLevel'

export default defineComponent({
  name: 'RegionColumns',
  props: mergeBaseProps({
    separator: { type: String, default: '' }
  }),
  emits: mergeEmits(['complete']),
  setup (props, { emit, slots }) {
    const { hasCity, hasArea, hasTown } = useRegionUI(props, emit, {
      afterModelChange
    })
    const { visible, close } = useDropdown()
    // 各级别列表滚动处理函数集
    const levelListScrollHandles = []

    provide(keyInternal, {
      selectionComplete: () => {
        close?.()
        emit('complete')
      },
      setLevelListScroll: fn => levelListScrollHandles.push(fn)
    })
    // 仅核心模块独立使用时，才需要处理滚动
    function afterModelChange () {
      // dropdown 打开的状态下，v-model 变更通常是 ui 操作，所以不处理滚动
      if (visible) return
      // 数据变更后，将选中项目滚动至可见位置
      doLevelListScroll()
    }
    // 响应 dropdown open 与 core module v-model change
    function doLevelListScroll () {
      levelListScrollHandles.forEach(fn => {
        nextTick(fn)
      })
    }
    function RegionColumnLevel ({ level, enable = true, hasNext }) {
      if (!enable) return null
      return <ColumnLevel level={level} hasNext={hasNext.value} />
    }

    if (visible) {
      watch(visible, val => val && doLevelListScroll())
    }

    return () => (
      <div class='rg-column-container'>
        <RegionColumnLevel level={PROVINCE} hasNext={hasCity} />
        <RegionColumnLevel level={CITY} hasNext={hasArea} enable={hasCity} />
        <RegionColumnLevel level={AREA} hasNext={hasTown} enable={hasArea} />
        {slots.default?.()}
      </div>
    )
  }
})
