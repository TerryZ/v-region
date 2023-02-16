import './styles/select.sass'

import { h, provide, toRef, defineComponent } from 'vue'
import RegionSelect from './components/Select'
import { useLanguage, useState, availableLevels } from './utils/helper'
import { modelToRegion } from './utils/parse'
import { commonProps, useData, dataChange } from './utils/data'

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
      list, data,
      setData, setProvince, setCity, setArea, setTown,
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
          console.log(val)
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
        generateLevel(list.provinces, data.province, val => setProvince(val))
      )

      if (haveCity) {
        selects.push(
          generateLevel(list.cities, data.city, val => setCity(val))
        )
      }
      if (haveArea) {
        selects.push(
          generateLevel(list.areas, data.area, val => setArea(val))
        )
      }
      if (haveTown) {
        selects.push(
          generateLevel(list.towns, data.town, val => setTown(val))
        )
      }

      return h('div', selects)
    }
  }
})
