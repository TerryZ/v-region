import { inject, defineComponent } from 'vue'

import { keyCore, TOWN } from '../../constants'
import { getTowns } from '../../composables/list-loader'

import RegionColumns from './RegionColumns'
import ColumnLevel from './ColumnLevel'
import IconLoading from '../../icons/IconLoading.vue'

import type { RegionUIProvide } from '../../types'

export default defineComponent({
  name: 'RegionFullColumns',
  setup() {
    function LevelTown() {
      const { hasTown, setupTownListLoader, loading } = inject(keyCore) as RegionUIProvide
      setupTownListLoader(getTowns)

      if (!hasTown.value) return null
      return (
        <ColumnLevel level={TOWN}>
          <IconLoading v-show={loading.value} />
        </ColumnLevel>
      )
    }

    return () => (
      <RegionColumns>
        <LevelTown />
      </RegionColumns>
    )
  }
})
