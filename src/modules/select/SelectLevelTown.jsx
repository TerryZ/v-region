import { inject } from 'vue'

import { injectKeyCore, KEY_TOWN } from '../../constants'
import { getTowns } from '../../core/helper'

import RegionSelectLevel from './SelectLevel'

export default {
  name: 'RegionSelectTown',
  setup () {
    const { hasTown, setupTownListLoader } = inject(injectKeyCore)

    setupTownListLoader(getTowns)

    function RegionLevel () {
      if (!hasTown.value) return null
      return <RegionSelectLevel level={KEY_TOWN} />
    }

    return () => <RegionLevel />
  }
}
