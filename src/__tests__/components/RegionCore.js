import { h } from 'vue'

import { useRegionCore } from '../../../src/composables/region-core'
import { mergeBaseProps } from '../../../src/composables/options'

export default {
  name: 'RegionCore',
  props: mergeBaseProps(),
  setup(props, { expose }) {
    const {
      data,
      hasArea,
      hasCity,
      hasTown,
      isComplete,
      resetRegion,
      setRegion,
      setRegionLevel,
      setupTownListLoader,
      toModel,
      toValues,
      toNames
    } = useRegionCore(props)

    expose({
      data,
      hasArea,
      hasCity,
      hasTown,
      isComplete,
      resetRegion,
      setRegion,
      setRegionLevel,
      setupTownListLoader,
      toModel,
      toValues,
      toNames
    })
    return () => h('div')
  }
}
