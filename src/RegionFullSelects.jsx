import './styles/select.sass'

import { h, provide, toRef, defineComponent } from 'vue'

import RegionSelectLevel from './modules/select/SelectLevel'
import RegionSelects from './RegionSelects'

import {
  TOWN_KEY,
  injectKeyProps
} from './constants'
import { useLanguage, useState } from './utils/helper'
import { mergeSelectorProps, mergeEmits } from './core/base'
import { useFullRegion } from './core/base-full'

export default defineComponent({
  name: 'RegionFullSelects',
  props: mergeSelectorProps({
    town: { type: Boolean, default: true },
    blank: { type: Boolean, default: true }
  }),
  emits: mergeEmits(),
  setup (props, { emit, expose }) {
    const {
      data, towns,
      setLevel, reset
    } = useFullRegion(props, emit)
    const { hasTown } = useState(props)
    const lang = useLanguage(props.language)

    provide(injectKeyProps, {
      disabled: toRef(props, 'disabled'),
      blank: props.blank,
      blankText: lang.pleaseSelect,
      customTriggerClass: props.customTriggerClass,
      customContainerClass: props.customContainerClass
    })

    function RegionLevel ({ hasLevel = true, list, value, levelKey }) {
      if (!hasLevel) return null
      return h(RegionSelectLevel, {
        list,
        modelValue: value,
        'onUpdate:modelValue': val => setLevel(levelKey, val)
      })
    }

    expose({ reset })

    return () => (
      <RegionSelects>
        <RegionLevel
          hasLevel={hasTown.value}
          list={towns}
          value={data.town}
          levelKey={TOWN_KEY}
        />
      </RegionSelects>
    )
  }
})
