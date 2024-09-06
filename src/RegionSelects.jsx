import './styles/select.sass'

import { h, provide, toRef, defineComponent } from 'vue'

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
  setup (props, { emit, expose, slots }) {
    const {
      data, provinces, cities, areas,
      setLevel, reset, getTown
    } = useRegion(props, emit)
    const { hasCity, hasArea, hasTown } = useState(props)
    const lang = useLanguage(props.language)

    provide(injectKeyBase, {
      modelValue: toRef(props, 'modelValue'),
      data,
      hasTown,
      setLevel,
      getTown,
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

    return () => {
      return (
        <div>
          <RegionLevel
            list={provinces}
            value={data.value.province}
            levelKey={KEY_PROVINCE}
          />
          <RegionLevel
            hasLevel={hasCity.value}
            list={cities}
            value={data.value.city}
            levelKey={KEY_CITY}
          />
          <RegionLevel
            hasLevel={hasArea.value}
            list={areas}
            value={data.value.area}
            levelKey={KEY_AREA}
          />
          {slots.default?.()}
        </div>
      )
    }
  }
})
