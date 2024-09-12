import { h, defineComponent } from 'vue'
import { mergeBaseProps } from '../../core/options'
import { useRegion } from '../../core/base'

export default defineComponent({
  name: 'RegionText',
  props: mergeBaseProps({
    separator: { type: String, default: '' }
  }),
  setup (props, { slots }) {
    const { regionText } = useRegion(props)

    return () => {
      return h('span', [regionText.value, slots.default?.()])
    }
  }
})
