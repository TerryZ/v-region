import { PROVINCE_LEVEL } from '../constants'
import { getRegionByModel, validModel, availableLevels } from '../helper'

export default {
  props: {
    city: {
      type: Boolean,
      default: true
    },
    area: {
      type: Boolean,
      default: true
    },
    town: {
      type: Boolean,
      default: false
    },
    i18n: {
      type: String,
      default: 'cn'
    },
    value: Object
  },
  data () {
    return {
      // levels list data
      listProvince: [],
      listCity: [],
      listArea: [],
      listTown: [],

      lang: {},

      region: {
        province: null,
        city: null,
        area: null,
        town: null
      }
    }
  },
  watch: {
    value: {
      handler (val) {
        if (validModel(val) && this.differentModel(val)) {
          this.clearRegion(PROVINCE_LEVEL)
          this.region = getRegionByModel(val, this.availableLevels)
          this.change(true)
        }
      },
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
    }
  }
}
