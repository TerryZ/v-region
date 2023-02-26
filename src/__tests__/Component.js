import { h } from 'vue'
import { useState, availableLevels } from '../utils/helper'

export default {
  props: {
    city: Boolean,
    area: Boolean,
    town: Boolean
  },
  setup (props, { expose }) {
    const { haveCity, haveArea, haveTown } = useState(props)

    function getAvailableLevels () {
      return availableLevels(props)
    }

    expose({
      haveCity,
      haveArea,
      haveTown,
      getAvailableLevels
    })

    return () => h('div')
  }
}
