import '../../styles/column.sass'

import { defineComponent, provide } from 'vue'

import { useRegion } from '../../core/base'
import { mergeBaseProps, mergeEmits } from '../../core/options'
import {
  KEY_PROVINCE, KEY_CITY, KEY_AREA, injectKeyBase
} from '../../constants'

import ColumnLevel from './ColumnLevel'

export default defineComponent({
  name: 'RegionColumnsCore',
  props: mergeBaseProps(),
  emits: mergeEmits(['adjust', 'complete']),
  setup (props, { emit, slots }) {
    const { hasCity, hasArea } = useRegion(props, emit)

    provide(injectKeyBase, {
      dropdownAdjust: () => emit('adjust'),
      selectionComplete: () => emit('complete')
    })

    function RegionColumnLevel ({ level, hasLevel = true }) {
      if (!hasLevel) return null
      return <ColumnLevel level={level} />
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
