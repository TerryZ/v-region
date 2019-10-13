import language from '../language'
import { srcProvince } from '../formatted.js'
import {
  GROUP,
  PROVINCE_LEVEL, CITY_LEVEL, AREA_LEVEL,
  LEVEL_LIST, LEVELS
} from '../constants'

import { getRegionByModel, validModel, getLoader } from '../helper'

export default {
  methods: {
    modelChange (val) {
      if (validModel(val) && this.differentModel(val)) {
        this.clearRegion(PROVINCE_LEVEL)
        this.region = getRegionByModel(val, this.availableLevels)
        this.change(true)
      }
    },
    /**
     * Region contents change
     *
     * @param {boolean} [initialize=false]
     */
    change (initialize = false) {
      this.regionHandle()
      this.emit(initialize)
    },
    /**
     * Plugin data change events
     * below plugin types are in use
     *
     * - Select
     * - Group
     * - Column
     *
     * @param {boolean} [input=false]
     */
    emit (input = false) {
      if (!input) {
        const model = {}
        Object.entries(this.region)
          .forEach(([key, value]) => {
            model[key] = value ? value.key : null
          })
        this.$emit('input', model)
      }
      this.$emit('values', JSON.parse(JSON.stringify(this.region)))
    },
    /**
     * Check if model and region data are equal
     *
     * @param {object} model
     * @returns
     */
    differentModel (model) {
      if (!model) return false
      const levelResult = []
      const { province, city, area, town } = this.region
      levelResult.push(Boolean(model.province === province || (province && province.key) === model.province))
      levelResult.push(Boolean(model.city === city || (city && city.key) === model.city))
      levelResult.push(Boolean(model.area === area || (area && area.key) === model.area))
      levelResult.push(Boolean(model.town === town || (town && town.key) === model.town))
      // console.log(levelResult)
      return levelResult.some(val => val === false)
    },
    regionHandle () {
      // eslint-disable-next-line no-unused-vars
      for (const level of LEVELS.map(val => val.index)) {
        if (!this.levelHandle(level, getLoader(level))) break
      }
    },
    levelHandle (level, load) {
      const key = LEVEL_LIST[level]
      const parentKey = level === PROVINCE_LEVEL ? null : LEVEL_LIST[level - 1]
      const listName = 'list' + key.charAt().toUpperCase() + key.substring(1)
      if (level === PROVINCE_LEVEL || this[key]) {
        if (this.region[parentKey]) {
          this[listName] = load(this.region[parentKey])
        }
        if (!this.levelCheck(this[listName], this.region[key])) {
          this.clearRegion(level)
          return false
        }
      }
      return true
    },
    levelCheck (list, attr) {
      if (!list.length || !attr) return false
      return list.some(val => val.key === attr.key)
    },
    /**
     * Clear region fields
     *
     * @param {number} level
     */
    clearRegion (level) {
      const fields = LEVEL_LIST.slice(level)
      Object.keys(this.region).forEach(val => {
        if (fields.includes(val)) this.region[val] = null
      })
      /* eslint-disable no-fallthrough */
      switch (level) {
        case PROVINCE_LEVEL: this.listCity = []
        case CITY_LEVEL: this.listArea = []
        case AREA_LEVEL: this.listTown = []
      }
    }
  },
  created () {
    // sort by length and code
    this.listProvince = this.type === GROUP
      ? srcProvince.slice().sort((a, b) => {
        const gap = a.value.length - b.value.length
        return gap === 0 ? Number(a.key) - Number(b.key) : gap
      })
      : srcProvince.slice()
    this.lang = language[this.i18n]
    if (this.value && Object.keys(this.value).length) this.modelChange(this.value)
  }
}
