import '../../styles/select.sass'

import { provide, defineComponent } from 'vue'

import RegionSelectLevel from './SelectLevel'

import {
  KEY_PROVINCE, KEY_CITY, KEY_AREA,
  injectKeyBase
} from '../../constants'
import { mergeSelectorProps, mergeEmits } from '../../core/options'
import { useRegion } from '../../core/base'

export default defineComponent({
  name: 'RegionSelects',
  props: mergeSelectorProps({
    blank: { type: Boolean, default: true }
  }),
  emits: mergeEmits(),
  setup (props, { emit, slots }) {
    const { hasCity, hasArea } = useRegion(props, emit)

    provide(injectKeyBase, {
      blank: props.blank
    })

    function RegionLevel ({ hasLevel = true, level }) {
      if (!hasLevel) return null
      return <RegionSelectLevel level={level} />
    }

    return () => (
      <div class="rg-selects">
        <RegionLevel level={KEY_PROVINCE} />
        <RegionLevel level={KEY_CITY} hasLevel={hasCity.value} />
        <RegionLevel level={KEY_AREA} hasLevel={hasArea.value} />
        {slots.default?.()}
      </div>
    )
  }
})
