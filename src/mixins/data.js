import { availableLevels } from '../utils/helper'
import language, { CN } from '../language'

export default {
  props: {
    city: { type: Boolean, default: true },
    area: { type: Boolean, default: true },
    town: { type: Boolean, default: false },
    language: { type: String, default: CN },
    value: Object
  },
  data () {
    return {
      // levels list data
      listProvince: [],
      listCity: [],
      listArea: [],
      listTown: [],

      region: {
        province: undefined,
        city: undefined,
        area: undefined,
        town: undefined
      }
    }
  },
  watch: {
    value: {
      handler: 'modelChange',
      deep: true
    }
  },
  computed: {
    selectedText () {
      const arr = []
      const { province, city, area, town } = this.region
      if (province) arr.push(province.value)
      if (city) arr.push(city.value)
      if (area) arr.push(area.value)
      if (town) arr.push(town.value)
      return arr.join('')
    },
    availableLevels () {
      return availableLevels(this.city, this.area, this.town)
    },
    currentLevels () {
      return Object.entries(this.region)
        .filter(([key, value]) => value)
        .map(([key, value]) => key)
    },
    lang () {
      return language[this.language.toLowerCase()]
    }
  }
}
