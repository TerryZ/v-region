import '../../styles/select.sass'

import { provide, defineComponent } from 'vue'

import RegionSelectLevel from './SelectLevel'

import { PROVINCE, CITY, AREA, keyInternal } from '../../constants'
import { mergeBaseProps, mergeEmits } from '../../composables/options'
import { useRegionUI } from '../../composables/region-ui'

import type { ExtractPropTypes } from 'vue'
import type { RegionLevel, RegionProps } from '../../types'

interface RegionLevelProps {
  enable?: boolean
  level: RegionLevel
}

export default defineComponent({
  name: 'RegionSelects',
  props: mergeBaseProps({
    disabled: { type: Boolean, default: false },
    blank: { type: Boolean, default: true }
  }),
  emits: mergeEmits(),
  setup(props, { emit, slots }) {
    const { hasCity, hasArea } = useRegionUI(props as ExtractPropTypes<RegionProps>, emit)

    provide(keyInternal, { blank: props.blank })

    function RegionLevel({ enable = true, level }: RegionLevelProps) {
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
