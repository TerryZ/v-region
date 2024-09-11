import { inject } from 'vue'

import { injectKeyCore, KEY_TOWN } from '../../constants'
import { getTowns } from '../../core/helper'

import RegionSelectLevel from './SelectLevel'

export default {
  name: 'RegionSelectTown',
  setup () {
    const { hasTown, modelValue, setupTownListLoader } = inject(injectKeyCore)

    setupTownListLoader(getTowns, modelValue.value?.[KEY_TOWN])

    function RegionLevel () {
      if (!hasTown.value) return null
      return <RegionSelectLevel level={KEY_TOWN} />
    }

    return () => <RegionLevel />
  }
}
