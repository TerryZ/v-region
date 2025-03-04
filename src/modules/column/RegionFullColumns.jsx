import { inject, defineComponent } from 'vue'

import { injectKeyCore, KEY_TOWN } from '../../constants'
import { getTowns } from '../../core/list-loader'

import RegionColumns from './RegionColumns'
import ColumnLevel from './ColumnLevel'

export default defineComponent({
  name: 'RegionFullColumns',
  setup () {
    function LevelTown () {
      const { hasTown, setupTownListLoader } = inject(injectKeyCore)
      setupTownListLoader(getTowns)

      if (!hasTown.value) return null
      return <ColumnLevel level={KEY_TOWN} />
    }

    return () => (
      <RegionColumns>
        <LevelTown />
      </RegionColumns>
    )
  }
})
