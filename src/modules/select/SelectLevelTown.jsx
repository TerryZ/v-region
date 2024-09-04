import { inject, h } from 'vue'

import { injectKeyBase, KEY_TOWN } from '../../constants'
import { useRegionTown } from '../../core/base'

import RegionSelectLevel from './SelectLevel'

export default {
  setup () {
    const {
      data,
      hasTown,
      setLevel
    } = inject(injectKeyBase)

    const { towns } = useRegionTown(data, setLevel)

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
