import { validModel } from './utils/helper'
import { modelToRegion, parseRegionToText } from './utils/parse'

/**
 * 纯文本显示区域信息
 */
export default {
  name: 'RegionText',
  props: {
    value: { type: Object, default: undefined },
    separator: { type: String, default: '' }
  },
  render (h) {
    const { value, separator } = this

    if (!validModel(value)) {
      console.error('Incorrect data format for "value/v-model" of v-region')
      return
    }

    return h('span', parseRegionToText(modelToRegion(value)).join(separator))
  }
}
