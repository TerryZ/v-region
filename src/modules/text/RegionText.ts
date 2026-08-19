import { h, defineComponent } from 'vue'
import { mergeBaseProps } from '../../core/options'
import { useRegionUI } from '../../core/region-ui'

export default defineComponent({
  name: 'RegionText',
  props: mergeBaseProps({
    separator: { type: String, default: '' }
  }),
  setup (props, { slots }) {
    const { regionText } = useRegionUI(props)

    return () => h('span', [regionText.value, slots.default?.()])
  }
})
