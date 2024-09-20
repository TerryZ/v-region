import { h } from 'vue'

import { mergeBaseProps, mergeEmits } from '../core/options'
import { useRegion } from '../core/base'

export default {
  props: mergeBaseProps(),
  emits: mergeEmits(),
  setup (props, { emit, expose }) {
    const {
      data,
      reset,
      setData,
      setLevel,
      getData,
      isComplete,
      regionText,
      availableLevels,
      hasCity, hasArea, hasTown,
      setupTownListLoader
    } = useRegion(props, emit)

    expose({
      hasCity,
      hasArea,
      hasTown,
      availableLevels,

      data,
      reset,
      setData,
      setLevel,
      getData,
      isComplete,
      regionText,
      setupTownListLoader
    })

    return () => h('div')
  }
}
