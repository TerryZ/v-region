import './styles/select.sass'

import { h, provide, toRef, defineComponent } from 'vue'

import RegionSelectLevel from './modules/select/SelectLevel'

import {
  PROVINCE_KEY,
  CITY_KEY,
  AREA_KEY,
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
  setup (props, { emit, expose, slots }) {
    const {
      data, provinces, cities, areas,
      setLevel, reset
    } = useRegion(props, emit)
    const { hasCity, hasArea, hasTown } = useState(props)
    const lang = useLanguage(props.language)

    provide(injectKeyBase, {
      data,
      hasTown,
      setLevel,
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
      <div>
        <RegionLevel
          list={provinces}
          value={data.value.province}
          levelKey={PROVINCE_KEY}
        />
        <RegionLevel
          hasLevel={hasCity.value}
          list={cities}
          value={data.value.city}
          levelKey={CITY_KEY}
        />
        <RegionLevel
          hasLevel={hasArea.value}
          list={areas}
          value={data.value.area}
          levelKey={AREA_KEY}
        />
        {slots.default?.()}
      </div>
    )
  }
})
