import { h, ref, defineComponent } from 'vue'
import { validModel } from './utils/helper'
import { modelToRegion, regionToText } from './utils/parse'

export default defineComponent({
  name: 'RegionText',
  props: {
    modelValue: { type: Object, default: undefined },
    separator: { type: String, default: '' }
  },
  setup (props) {
    if (!validModel(props.modelValue)) return

    const text = ref('')

    modelToRegion(props.modelValue).then(resp => {
      text.value = regionToText(resp).join(props.separator)
    })

    return () => h('span', text.value)
  }
})
