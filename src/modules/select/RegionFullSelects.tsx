import { defineComponent, inject } from 'vue'

import { keyCore, TOWN } from '../../constants'
import { getTowns } from '../../composables/list-loader'

import RegionSelects from './RegionSelects'
import RegionSelectLevel from './SelectLevel'
import IconLoading from '../../icons/IconLoading.vue'

import type { RegionUIProvide } from '../../types'

export default defineComponent({
  name: 'RegionFullSelects',
  setup() {
    function RegionSelectTown() {
      const { hasTown, setupTownListLoader, loading } = inject(keyCore) as RegionUIProvide

      setupTownListLoader(getTowns)

      if (!hasTown.value) return null
      return (
        <RegionSelectLevel level={TOWN}>{loading.value ? <IconLoading /> : null}</RegionSelectLevel>
      )
    }

    return () => (
      <RegionSelects>
        <RegionSelectTown />
      </RegionSelects>
    )
  }
})
