import { inject, defineComponent } from 'vue'

import { keyCore } from '../../constants'
import { getTowns } from '../../core/list-loader'

import RegionText from './RegionText'

export default defineComponent({
  name: 'RegionFullText',
  setup () {
    function RegionTextTown () {
      const { setupTownListLoader } = inject(keyCore)

      setupTownListLoader(getTowns)
    }
    return () => <RegionText><RegionTextTown /></RegionText>
  }
})
