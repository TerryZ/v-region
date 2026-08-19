import '../../styles/select.sass'

import { provide, defineComponent } from 'vue'

import RegionSelectLevel from './SelectLevel'

import {
  PROVINCE, CITY, AREA, keyInternal
} from '../../constants'
import { mergeBaseProps, mergeEmits } from '../../core/options'
import { useRegionUI } from '../../core/region-ui'

export default defineComponent({
  name: 'RegionSelects',
  props: mergeBaseProps({
    disabled: { type: Boolean, default: false },
    blank: { type: Boolean, default: true }
  }),
  emits: mergeEmits(),
  setup (props, { emit, slots }) {
    const { hasCity, hasArea } = useRegionUI(props, emit)

    provide(keyInternal, { blank: props.blank })

    function RegionLevel ({ enable = true, level }) {
      if (!enable) return null
      return <RegionSelectLevel level={level} />
    }

    return () => (
      <div class="rg-selects">
        <RegionLevel level={PROVINCE} />
        <RegionLevel level={CITY} enable={hasCity.value} />
        <RegionLevel level={AREA} enable={hasArea.value} />
        {slots.default?.()}
      </div>
    )
  }
})
