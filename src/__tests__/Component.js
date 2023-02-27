import { h } from 'vue'
import { useState, availableLevels } from '../utils/helper'
import { useData, commonProps, commonEmits } from '../utils/data'

export default {
  props: {
    ...commonProps
  },
  emits: commonEmits,
  setup (props, { emit, expose }) {
    const {
      data,
      provinces,
      cities,
      areas,
      towns,
      reset,
      setData,
      setLevel,
      getData,
      isComplete,
      regionText,
      getLevelList
    } = useData(props, emit)

    const { haveCity, haveArea, haveTown } = useState(props)

    function getAvailableLevels () {
      return availableLevels(props)
    }

    expose({
      haveCity,
      haveArea,
      haveTown,
      getAvailableLevels,

      data,
      provinces,
      cities,
      areas,
      towns,
      reset,
      setData,
      setLevel,
      getData,
      isComplete,
      regionText,
      getLevelList
    })

    return () => h('div')
  }
}
