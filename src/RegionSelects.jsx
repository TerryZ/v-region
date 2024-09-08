import './styles/select.sass'

import { provide, defineComponent } from 'vue'

import RegionSelectLevel from './modules/select/SelectLevel'

import {
  KEY_PROVINCE,
  KEY_CITY,
  KEY_AREA,
  injectKeyBase
} from './constants'
import { useLanguage, useState } from './utils/helper'
import { mergeSelectorProps, mergeEmits, useRegion } from './core/base'

export default defineComponent({
  name: 'RegionSelects',
  props: mergeSelectorProps({
    blank: { type: Boolean, default: true }
  }),
  emits: mergeEmits(),
  setup (props, { emit, slots }) {
    useRegion(props, emit)
    const { hasCity, hasArea, hasTown } = useState(props)
    const lang = useLanguage(props.language)

    provide(injectKeyBase, {
      hasTown,
      blank: props.blank,
      blankText: lang.pleaseSelect,
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
          <RegionLevel
            hasLevel={hasCity.value}
            level={KEY_CITY}
          />
          <RegionLevel
            hasLevel={hasArea.value}
            level={KEY_AREA}
          />
          {slots.default?.()}
        </div>
      )
    }
  }
})
