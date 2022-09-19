import { h, ref } from 'vue'
import { validModel } from './utils/helper'
import { modelToRegion, parseRegionToText } from './utils/parse'

/**
 * 纯文本显示区域信息
 */
export default {
  name: 'RegionText',
  props: {
    modelValue: { type: Object, default: undefined },
    separator: { type: String, default: '' }
  },
  setup (props) {
    const { modelValue, separator } = props

    if (!validModel(modelValue)) {
      console.error('Incorrect data format for "value/v-model" of v-region')
      return
    }

    const text = ref('')

    modelToRegion(modelValue).then(resp => {
      text.value = parseRegionToText(resp).join(separator)
    })

    return () => h('span', text.value)
  }
}
