import { defineComponent, inject } from 'vue'

import { injectKeyCore, KEY_TOWN } from '../../constants'
import { getTowns } from '../../core/helper'

import RegionSelects from './RegionSelects'
import RegionSelectLevel from './SelectLevel'

export default defineComponent({
  name: 'RegionFullSelects',
  setup () {
    function RegionSelectTown () {
      const { hasTown, setupTownListLoader } = inject(injectKeyCore)

      setupTownListLoader(getTowns)

      if (!hasTown.value) return null
      return <RegionSelectLevel level={KEY_TOWN} />
    }

    return () => (
      <RegionSelects>
        <RegionSelectTown />
      </RegionSelects>
    )
  }
})
