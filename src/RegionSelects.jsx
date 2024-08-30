import './styles/select.sass'

import { h, provide, toRef, defineComponent } from 'vue'

import RegionSelect from './components/Select'

import {
  PROVINCE_KEY,
  CITY_KEY,
  AREA_KEY,
  injectKeyProps
} from './constants'
import { useLanguage, useState } from './utils/helper'
import { mergeSelectorProps, mergeEmits, useRegion } from './core/base'

export default defineComponent({
  name: 'RegionSelects',
  props: mergeSelectorProps({
    blank: { type: Boolean, default: true }
  }),
  emits: mergeEmits(),
  setup (props, { emit, expose }) {
    const {
      data, provinces, cities, areas,
      setLevel, reset
    } = useRegion(props, emit)
    const { haveCity, haveArea } = useState(props)
    const lang = useLanguage(props.language)

    // TODO: to remove
    provide('disabled', toRef(props, 'disabled'))
    provide('blank', props.blank)
    provide('customTriggerClass', props.customTriggerClass)
    provide('customContainerClass', props.customContainerClass)

    provide(injectKeyProps, {
      disabled: toRef(props, 'disabled'),
      blank: props.blank,
      blankText: lang.pleaseSelect,
      customTriggerClass: props.customTriggerClass,
      customContainerClass: props.customContainerClass
    })

    // function generateLevel (list, model, callback) {
    //   return h(RegionSelect, {
    //     list,
    //     modelValue: model,
    //     'onUpdate:modelValue': val => callback(val)
    //   })
    // }
    function RegionLevel ({ hasLevel = true, list, value, levelKey }) {
      if (!hasLevel) return null
      return h(RegionSelect, {
        list,
        modelValue: value,
        'onUpdate:modelValue': val => setLevel(levelKey, val)
      })
    }

    expose({ reset })

    return () => {
      // const selects = []

      // selects.push(
      //   generateLevel(provinces, data.province, val => { setLevel(PROVINCE_KEY, val) })
      // )

      // if (haveCity.value) {
      //   selects.push(
      //     generateLevel(cities, data.city, val => { setLevel(CITY_KEY, val) })
      //   )
      // }
      // if (haveArea.value) {
      //   selects.push(
      //     generateLevel(areas, data.area, val => { setLevel(AREA_KEY, val) })
      //   )
      // }

      // return h('div', selects)
      return (
        <div>
          <RegionLevel
            list={provinces}
            value={data.province}
            level-key={PROVINCE_KEY}
          />
          <RegionLevel
            has-level={haveCity.value}
            list={cities}
            value={data.city}
            level-key={CITY_KEY}
          />
          <RegionLevel
            has-level={haveArea.value}
            list={areas}
            value={data.area}
            level-key={AREA_KEY}
          />
        </div>
      )
    }
  }
})
