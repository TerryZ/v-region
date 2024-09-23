import { inject, defineComponent } from 'vue'

import { injectKeyCore } from '../../constants'
import { getTowns } from '../../core/list-loader'

import RegionText from './RegionText'

export default defineComponent({
  name: 'RegionFullText',
  setup () {
    function RegionTextTown () {
      const { setupTownListLoader } = inject(injectKeyCore)

      setupTownListLoader(getTowns)
    }
    return () => (
      <RegionText>
        <RegionTextTown />
      </RegionText>
    )
  }
})
