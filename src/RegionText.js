import { h, defineComponent } from 'vue'
import { useRegion, mergeBaseProps } from './core/base'

export default defineComponent({
  name: 'RegionText',
  props: mergeBaseProps({
    separator: { type: String, default: '' }
  }),
  setup (props) {
    const { regionText } = useRegion(props)

    return () => h('span', regionText.value)
  }
})
