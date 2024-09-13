import { defineComponent, inject } from 'vue'

import { injectKeyCore } from '../../constants'
import { getTowns } from '../../core/helper'

import GroupCore from './GroupCore'

export default defineComponent({
  name: 'RegionFullGroupCore',
  setup () {
    function GroupCoreTown () {
      const { setupTownListLoader } = inject(injectKeyCore)

      setupTownListLoader(getTowns)
    }

    return () => (
      <GroupCore>
        <GroupCoreTown />
      </GroupCore>
    )
  }
})
