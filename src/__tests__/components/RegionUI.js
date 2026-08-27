import { h } from 'vue'

import { mergeBaseProps, mergeEmits } from '../../composables/options'
import { useRegionUI } from '../../composables/region-ui'

export default {
  name: 'RegionCore',
  props: mergeBaseProps(),
  emits: mergeEmits(),
  setup(props, { emit, expose }) {
    const {
      state,
      lang,
      reset,
      setLevel,
      isComplete,
      regionText,
      hasCity,
      hasArea,
      hasTown,
      setupTownListLoader
    } = useRegionUI(props, emit)

    expose({
      hasCity,
      hasArea,
      hasTown,

      state,
      lang,
      reset,
      setLevel,
      isComplete,
      regionText,
      setupTownListLoader
    })

    return () => h('div')
  }
}
