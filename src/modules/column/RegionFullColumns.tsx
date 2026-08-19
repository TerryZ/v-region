import { inject, defineComponent } from 'vue'

import { keyCore, TOWN } from '../../constants'
import { getTowns } from '../../core/list-loader'

import RegionColumns from './RegionColumns'
import ColumnLevel from './ColumnLevel'

export default defineComponent({
  name: 'RegionFullColumns',
  setup () {
    function LevelTown () {
      const { hasTown, setupTownListLoader } = inject(keyCore)
      setupTownListLoader(getTowns)

      if (!hasTown.value) return null
      return <ColumnLevel level={TOWN} />
    }

    return () => <RegionColumns><LevelTown /></RegionColumns>
  }
})
