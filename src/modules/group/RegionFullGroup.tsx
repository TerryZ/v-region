import { defineComponent, inject } from 'vue'

import { keyCore } from '../../constants'
import { getTowns } from '../../core/list-loader'

import RegionGroup from './RegionGroup'

import type { RegionUIProvide } from '../../types'

export default defineComponent({
  name: 'RegionFullGroup',
  setup() {
    function LevelTown() {
      const { setupTownListLoader } = inject(keyCore) as RegionUIProvide
      setupTownListLoader(getTowns)
      return null
    }

    return () => (
      <RegionGroup>
        <LevelTown />
      </RegionGroup>
    )
  }
})
