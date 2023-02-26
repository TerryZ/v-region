import './styles/select.sass'

import { h, provide, toRef, defineComponent } from 'vue'
import RegionSelect from './components/Select'

import { PROVINCE_KEY, CITY_KEY, AREA_KEY, TOWN_KEY } from './constants'
import { useLanguage, useState } from './utils/helper'
import { commonProps, useData } from './utils/data'

export default defineComponent({
  name: 'RegionSelects',
  props: {
    ...commonProps,
    blank: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit, expose }) {
    const {
      data, provinces, cities, areas, towns,
      setLevel, reset
    } = useData(props, emit)
    const { haveCity, haveArea, haveTown } = useState(props)
    const lang = useLanguage(props.language)

    provide('disabled', toRef(props, 'disabled'))
    provide('blank', props.blank)

    function generateLevel (list, model, callback, refObject) {
      return h(RegionSelect, {
        ref: refObject,
        list,
        blankText: lang.pleaseSelect,
        modelValue: model,
        'onUpdate:modelValue': val => callback(val)
      })
    }

    expose({ reset })

    return () => {
      const selects = []

      selects.push(
        generateLevel(provinces, data.province, val => { setLevel(PROVINCE_KEY, val) })
      )

      if (haveCity.value) {
        selects.push(
          generateLevel(cities, data.city, val => { setLevel(CITY_KEY, val) })
        )
      }
      if (haveArea.value) {
        selects.push(
          generateLevel(areas, data.area, val => { setLevel(AREA_KEY, val) })
        )
      }
      if (haveTown.value) {
        selects.push(
          generateLevel(towns, data.town, val => { setLevel(TOWN_KEY, val) })
        )
      }

      return h('div', selects)
    }
  }
})
