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
      blank: props.blank,
      customTriggerClass: props.customTriggerClass,
      customContainerClass: props.customContainerClass
    })

    function RegionLevel ({ hasLevel = true, level }) {
      if (!hasLevel) return null
      return <RegionSelectLevel level={level} />
    }

    return () => {
      return (
        <div>
          <RegionLevel level={KEY_PROVINCE} />
          <RegionLevel hasLevel={hasCity.value} level={KEY_CITY} />
          <RegionLevel hasLevel={hasArea.value} level={KEY_AREA} />
          {slots.default?.()}
        </div>
      )
    }
  }
})
