import { h } from 'vue'
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
    return () => {
      const { modelValue, separator } = props

      if (!validModel(modelValue)) {
        console.error('Incorrect data format for "value/v-model" of v-region')
        return
      }

      return h('span', parseRegionToText(modelToRegion(modelValue)).join(separator))
    }
  }
}
