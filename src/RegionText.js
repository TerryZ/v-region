import { h, ref, defineComponent, watchEffect } from 'vue'
import { validModel } from './utils/helper'
import { modelToRegion, regionToText } from './utils/parse'

export default defineComponent({
  name: 'RegionText',
  props: {
    modelValue: { type: Object, default: undefined },
    separator: { type: String, default: '' }
  },
  setup (props) {
    const text = ref('')

    watchEffect(() => {
      if (!validModel(props.modelValue)) return
      modelToRegion(props.modelValue).then(resp => {
        text.value = regionToText(resp).join(props.separator)
      })
    })

    return () => h('span', text.value)
  }
})
