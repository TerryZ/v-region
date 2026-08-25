import { inject, defineComponent } from 'vue'

import { keyCore } from '../../constants'
import { getTowns } from '../../composables/list-loader'

import RegionText from './RegionText'

import type { RegionUIProvide } from '../../types'

export default defineComponent({
  name: 'RegionFullText',
  setup() {
    function RegionTextTown() {
      const { setupTownListLoader } = inject(keyCore) as RegionUIProvide
      setupTownListLoader(getTowns)
      return null
    }
    return () => (
      <RegionText>
        <RegionTextTown />
      </RegionText>
    )
  }
})
