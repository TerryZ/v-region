import { defineComponent, inject } from 'vue'

import { injectKeyCore } from '../../constants'
import { getTowns } from '../../core/list-loader'

import RegionGroup from './RegionGroup'

export default defineComponent({
  name: 'RegionFullGroup',
  setup () {
    function LevelTown () {
      const { setupTownListLoader } = inject(injectKeyCore)

      setupTownListLoader(getTowns)
    }

    return () => (
      <RegionGroup>
        <LevelTown />
      </RegionGroup>
    )
  }
})
