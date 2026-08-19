import { defineComponent, inject } from 'vue'

import { keyCore, TOWN } from '../../constants'
import { getTowns } from '../../core/list-loader'

import RegionSelects from './RegionSelects'
import RegionSelectLevel from './SelectLevel'

export default defineComponent({
  name: 'RegionFullSelects',
  setup () {
    function RegionSelectTown () {
      const { hasTown, setupTownListLoader } = inject(keyCore)

      setupTownListLoader(getTowns)

      if (!hasTown.value) return null
      return <RegionSelectLevel level={TOWN} />
    }

    return () => <RegionSelects><RegionSelectTown /></RegionSelects>
  }
})
