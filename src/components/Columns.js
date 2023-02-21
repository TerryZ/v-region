// import '../styles/icons.sass'
import '../styles/column.sass'

import { h } from 'vue'
import RegionColumn from './Column'

import { PROVINCE_KEY, CITY_KEY, AREA_KEY, TOWN_KEY } from '../constants'
import { useState } from '../utils/helper'
import { commonProps, useData } from '../utils/data'

/**
 * 级联数据列核心模块
 */
export default {
  name: 'RegionColumnsCore',
  props: {
    ...commonProps
  },
  emits: ['update:modelValue', 'change', 'adjust', 'complete'],
  setup (props, { emit, expose }) {
    const {
      data, provinces, cities, areas, towns,
      setLevel, reset, isComplete, regionText
    } = useData(props, emit)
    const { haveCity, haveArea, haveTown } = useState(props)

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
          provinces, haveCity, data.province, val => { setLevel(PROVINCE_KEY, val) }
        )
      )
      if (haveCity && cities.value.length) { // city
        columns.push(
          generateColumn(
            cities, haveArea, data.city, val => { setLevel(CITY_KEY, val) }
          )
        )
      }
      if (haveArea && areas.value.length) { // area
        columns.push(
          generateColumn(
            areas, haveTown, data.area, val => { setLevel(AREA_KEY, val) }
          )
        )
      }
      if (haveTown && towns.value.length) { // town
        columns.push(
          generateColumn(
            towns, false, data.town, val => { setLevel(TOWN_KEY, val) }
          )
        )
      }

      return h('div', { class: 'rg-column-container' }, columns)
    }
  }
}
