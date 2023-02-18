import './styles/select.sass'

import { h, provide, toRef, defineComponent } from 'vue'
import RegionSelect from './components/Select'
import { useLanguage, useState, availableLevels } from './utils/helper'
import { modelToRegion } from './utils/parse'
import { commonProps, useData, dataChange } from './utils/data'
import { PROVINCE_KEY, CITY_KEY, AREA_KEY, TOWN_KEY } from './constants'

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
      data,
      provinces, cities, areas, towns,
      setData, setLevel,
      getData, reset
    } = useData(props)
    const lang = useLanguage()
    const { haveCity, haveArea, haveTown } = useState(props)

    provide('disabled', toRef(props, 'disabled'))
    provide('blank', props.blank)

    function generateLevel (list, model, callback) {
      return h(RegionSelect, {
        list,
        blankText: lang.pleaseSelect,
        modelValue: model,
        'onUpdate:modelValue': val => {
          callback(val)
          dataChange(emit, getData())
        },
        onVisibleChange (val) {
          // console.log(val)
        }
      })
    }

    if (props.modelValue && Object.keys(props.modelValue).length) {
      modelToRegion(props.modelValue, availableLevels(props)).then(resp => {
        setData(resp)
      })
    }

    expose({ reset })

    return () => {
      const selects = []

      selects.push(
        generateLevel(provinces, data.province, val => { setLevel(PROVINCE_KEY, val) })
      )

      if (haveCity) {
        selects.push(
          generateLevel(cities, data.city, val => { setLevel(CITY_KEY, val) })
        )
      }
      if (haveArea) {
        selects.push(
          generateLevel(areas, data.area, val => { setLevel(AREA_KEY, val) })
        )
      }
      if (haveTown) {
        selects.push(
          generateLevel(towns, data.town, val => { setLevel(TOWN_KEY, val) })
        )
      }

      return h('div', selects)
    }
  }
})
