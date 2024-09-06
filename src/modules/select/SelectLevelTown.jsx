import { inject, h } from 'vue'

import { injectKeyBase, KEY_TOWN } from '../../constants'
import { useRegionTown } from '../../core/base'

import RegionSelectLevel from './SelectLevel'

export default {
  name: 'RegionSelectTown',
  setup () {
    const { modelValue, data, hasTown, setLevel, getTown } = inject(injectKeyBase)
    const { towns, getRegionTown } = useRegionTown(modelValue, data)

    // getTown.value = getRegionTown

    function RegionLevel () {
      if (!hasTown.value) return null
      return h(RegionSelectLevel, {
        list: towns,
        modelValue: data.value.town,
        'onUpdate:modelValue': val => setLevel(KEY_TOWN, val)
      })
    }

    return () => <RegionLevel />
  }
}
