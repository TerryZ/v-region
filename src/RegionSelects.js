import './styles/select.sass'

import { h, provide, toRef } from 'vue'
import RegionSelect from './components/Select'
import { useLanguage, useState } from './utils/helper'
import { useData, commonProps } from './utils/data'

export default {
  name: 'RegionSelects',
  props: {
    ...commonProps,
    blank: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false }
  },
  setup (props) {
    const { list, data } = useData(props)
    const lang = useLanguage()
    const { haveCity, haveArea, haveTown } = useState(props)

    provide('disabled', toRef(props, 'disabled'))
    provide('blank', props.blank)

    function generateLevel ({ list, model, callback }) {
      return h(RegionSelect, {
        blankText: lang.pleaseSelect,
        modelValue: model,
        list,
        'onUpdate:modelValue': val => {
          console.log(val)
          callback(val)
          // this.change()
        }
      })
    }

    return () => {
      const selects = []

      selects.push(generateLevel({
        list: list.provinces,
        model: data.province,
        callback: val => {
          data.province = val
        }
      }))

      if (haveCity) {
        selects.push(generateLevel({
          list: list.cities,
          model: data.city,
          callback: val => { data.city = val }
        }))
      }
      if (haveArea) {
        selects.push(generateLevel({
          list: list.areas,
          model: data.area,
          callback: val => { data.area = val }
        }))
      }
      if (haveTown) {
        selects.push(generateLevel({
          list: list.towns,
          model: data.town,
          callback: val => { data.town = val }
        }))
      }

      return h('div', selects)
    }
  }
}
