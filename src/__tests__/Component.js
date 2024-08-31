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

    const { hasCity, hasArea, hasTown } = useState(props)

    function getAvailableLevels () {
      return availableLevels(props)
    }

    expose({
      hasCity,
      hasArea,
      hasTown,
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
