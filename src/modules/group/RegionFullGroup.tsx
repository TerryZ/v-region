import { defineComponent, inject } from 'vue'

import { keyCore } from '../../constants'
import { getTowns } from '../../core/list-loader'

import RegionGroup from './RegionGroup'

export default defineComponent({
  name: 'RegionFullGroup',
  setup () {
    function LevelTown () {
      const { setupTownListLoader } = inject(keyCore)
      setupTownListLoader(getTowns)
    }

    return () => <RegionGroup><LevelTown /></RegionGroup>
  }
})
