import { inject, h, onBeforeMount } from 'vue'

import { injectKeyBase, KEY_TOWN } from '../../constants'
import { useRegionTown } from '../../core/base'
import { getTownModel } from '../../core/parse'

import RegionSelectLevel from './SelectLevel'

export default {
  setup () {
    const { modelValue, data, hasTown, setLevel, getTown } = inject(injectKeyBase)

    const { towns } = useRegionTown(modelValue, data)

    getTown.value = getTownModel

    onBeforeMount(async () => {
      if (modelValue.value?.town) {
        data.value.town = await getTownModel(data.value.area, modelValue.value.town)
      }
    })

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
