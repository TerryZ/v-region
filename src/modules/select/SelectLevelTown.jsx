import { inject } from 'vue'

import { injectKeyBase, injectKeyCore, KEY_TOWN } from '../../constants'
import { useRegionTown } from '../../core/base'

import RegionSelectLevel from './SelectLevel'

export default {
  name: 'RegionSelectTown',
  setup () {
    const { hasTown } = inject(injectKeyBase)
    const { townLostLoader } = useRegionTown()
    const { modelValue, setupTownListLoader } = inject(injectKeyCore)

    setupTownListLoader(townLostLoader, modelValue.value[KEY_TOWN])

    function RegionLevel () {
      if (!hasTown.value) return null
      return <RegionSelectLevel level={KEY_TOWN} />
    }

    return () => <RegionLevel />
  }
}
