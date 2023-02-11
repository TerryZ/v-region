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
    if (!validModel(props.modelValue)) return

    const text = ref('')

    modelToRegion(props.modelValue).then(resp => {
      text.value = parseRegionToText(resp).join(props.separator)
    })

    return () => h('span', text.value)
  }
}
