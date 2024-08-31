import '../styles/column.sass'

import { h, ref, defineComponent } from 'vue'
import RegionColumn from './Column'

import { PROVINCE_KEY, CITY_KEY, AREA_KEY, TOWN_KEY } from '../constants'
import { useState } from '../utils/helper'
import { commonProps, commonEmits, useData } from '../utils/data'

export default defineComponent({
  name: 'RegionColumnsCore',
  props: {
    ...commonProps
  },
  emits: [...commonEmits, 'adjust', 'complete'],
  setup (props, { emit, expose }) {
    const {
      data, provinces, cities, areas, towns,
      setLevel, reset, isComplete, regionText
    } = useData(props, emit)
    const { hasCity, hasArea, hasTown } = useState(props)

    function generateColumn (list, haveChild, value, callback) {
      return h(RegionColumn, {
        list,
        haveChild,
        modelValue: value,
        'onUpdate:modelValue': val => {
          callback(val)
          emit('adjust')
          if (isComplete.value) {
            emit('complete')
          }
        }
      })
    }

    expose({ region: data, reset, regionText })

    return () => {
      const columns = []
      columns.push( // province
        generateColumn(
          provinces, hasCity, data.province, val => { setLevel(PROVINCE_KEY, val) }
        )
      )
      if (hasCity.value && cities.value.length) { // city
        columns.push(
          generateColumn(
            cities, hasArea, data.city, val => { setLevel(CITY_KEY, val) }
          )
        )
      }
      if (hasArea.value && areas.value.length) { // area
        columns.push(
          generateColumn(
            areas, hasTown, data.area, val => { setLevel(AREA_KEY, val) }
          )
        )
      }
      if (hasTown.value && towns.value.length) { // town
        columns.push(
          generateColumn(
            towns, ref(false), data.town, val => { setLevel(TOWN_KEY, val) }
          )
        )
      }

      return h('div', { class: 'rg-column-container' }, columns)
    }
  }
})
