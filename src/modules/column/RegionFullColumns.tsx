import { inject, defineComponent } from 'vue'

import { keyCore, TOWN } from '../../constants'
import { getTowns } from '../../core/list-loader'

import RegionColumns from './RegionColumns'
import ColumnLevel from './ColumnLevel'

import type { RegionUIProvide } from '../../types'

export default defineComponent({
  name: 'RegionFullColumns',
  setup() {
    function LevelTown() {
      const { hasTown, setupTownListLoader } = inject(keyCore) as RegionUIProvide
      setupTownListLoader(getTowns)

      if (!hasTown.value) return null
      return <ColumnLevel level={TOWN} />
    }

    return () => (
      <RegionColumns>
        <LevelTown />
      </RegionColumns>
    )
  }
})
