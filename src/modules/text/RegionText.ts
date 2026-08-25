import { h, defineComponent } from 'vue'
import { mergeBaseProps } from '../../composables/options'
import { useRegionUI } from '../../composables/region-ui'

import type { ExtractPropTypes } from 'vue'
import type { RegionProps } from '../../types'

export default defineComponent({
  name: 'RegionText',
  props: mergeBaseProps({
    separator: { type: String, default: '' }
  }),
  setup(props, { slots }) {
    const { regionText } = useRegionUI(props as ExtractPropTypes<RegionProps>)

    return () => h('span', [regionText.value, slots.default?.()])
  }
})
