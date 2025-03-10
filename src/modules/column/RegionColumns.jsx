import '../../styles/column.sass'

import { defineComponent, nextTick, provide, watch } from 'vue'

import { useRegion } from '../../core/base'
import { mergeBaseProps, mergeEmits } from '../../core/options'
import {
  KEY_PROVINCE, KEY_CITY, KEY_AREA, injectKeyBase
} from '../../constants'
import { useDropdown } from 'v-dropdown'

import ColumnLevel from './ColumnLevel'

export default defineComponent({
  name: 'RegionColumns',
  props: mergeBaseProps(),
  emits: mergeEmits(['complete']),
  setup (props, { emit, slots }) {
    const { hasCity, hasArea } = useRegion(props, emit, {
      afterModelChange
    })
    const { visible, close } = useDropdown()
    // 各级别列表滚动处理函数集
    const levelListScrollHandles = []

    provide(injectKeyBase, {
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
      doLevelListScroll()
    }
    // 响应 dropdown open 与 core module v-model change
    function doLevelListScroll () {
      levelListScrollHandles.forEach(fn => {
        nextTick(fn)
      })
    }
    function RegionColumnLevel ({ level, hasLevel = true }) {
      if (!hasLevel) return null
      return <ColumnLevel level={level} />
    }

    if (visible) {
      watch(visible, val => val && doLevelListScroll())
    }

    return () => (
      <div class='rg-column-container'>
        <RegionColumnLevel level={KEY_PROVINCE} />
        <RegionColumnLevel level={KEY_CITY} hasLevel={hasCity} />
        <RegionColumnLevel level={KEY_AREA} hasLevel={hasArea} />
        {slots.default?.()}
      </div>
    )
  }
})
