import '../../styles/column.sass'

import { defineComponent, nextTick, provide, watch, toRef } from 'vue'

import { useRegionUI } from '../../composables/region-ui'
import { mergeBaseProps, mergeEmits, emitComplete } from '../../composables/options'
import { PROVINCE, CITY, AREA, keyInternal } from '../../constants'
import { useDropdown } from 'v-dropdown'
import ColumnLevel from './ColumnLevel'

import type { ExtractPropTypes } from 'vue'
import type { RegionLevel, RegionProps } from '../../types'

interface RegionColumnLevelProps {
  level: RegionLevel
  enable?: boolean
  hasNext: boolean
}

export default defineComponent({
  name: 'RegionColumns',
  props: mergeBaseProps({
    separator: { type: String, default: '' },
    header: { type: Boolean, default: true }
  }),
  emits: mergeEmits(emitComplete),
  setup(props, { emit, slots }) {
    const { hasCity, hasArea, hasTown } = useRegionUI(
      props as ExtractPropTypes<RegionProps>,
      emit,
      {
        afterModelChange
      }
    )
    const { visible, close } = useDropdown()
    // 各级别列表滚动处理函数集
    const levelListScrollHandles: (() => void)[] = []

    provide(keyInternal, {
      header: toRef(props, 'header'),
      selectionComplete: () => {
        close?.()
        emit('complete')
      },
      setLevelListScroll: (fn: () => void) => levelListScrollHandles.push(fn)
    })
    // 仅核心模块独立使用时，才需要处理滚动
    function afterModelChange() {
      // dropdown 打开的状态下，v-model 变更通常是 ui 操作，所以不处理滚动
      if (visible) return
      // 数据变更后，将选中项目滚动至可见位置
      doLevelListScroll()
    }
    // 响应 dropdown open 与 core module v-model change
    function doLevelListScroll() {
      levelListScrollHandles.forEach((fn) => {
        nextTick(fn)
      })
    }
    function RegionColumnLevel({ level, enable = true, hasNext }: RegionColumnLevelProps) {
      if (!enable) return null
      return <ColumnLevel level={level} hasNext={hasNext} />
    }

    if (visible) {
      watch(visible, (val) => val && doLevelListScroll())
    }

    return () => (
      <div class="rg-column-container">
        <RegionColumnLevel level={PROVINCE} hasNext={hasCity.value!} />
        <RegionColumnLevel level={CITY} hasNext={hasArea.value!} enable={hasCity.value} />
        <RegionColumnLevel level={AREA} hasNext={hasTown.value!} enable={hasArea.value} />
        {slots.default?.()}
      </div>
    )
  }
})
