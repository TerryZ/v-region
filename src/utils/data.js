import { reactive } from 'vue'
import { CN } from '../language'
import { regionProvinces } from '../formatted'
import { loadCities, loadAreas, loadTowns } from './helper'

export const commonProps = {
  city: { type: Boolean, default: true },
  area: { type: Boolean, default: true },
  town: { type: Boolean, default: false },
  language: { type: String, default: CN },
  modelValue: { type: Object, default: undefined }
}

export function useData (props) {
  const list = reactive({
    provinces: regionProvinces,
    cities: [],
    areas: [],
    towns: []
  })
  const data = reactive({
    province: {},
    city: undefined,
    area: undefined,
    town: undefined
  })

  function resetRegionList () {
    list.cities = []
    list.areas = []
    list.towns = []
  }
  function resetRegionData () {
    data.province = undefined
    data.city = undefined
    data.area = undefined
    data.town = undefined
  }
  function setProvince (val) {
    data.province = val
    data.city = undefined
    data.area = undefined
    data.town = undefined
    list.cities = loadCities(val)
    list.areas = []
    list.towns = []
  }
  function setCity (val) {
    data.city = val
    data.area = undefined
    data.town = undefined
    list.areas = loadAreas(val)
    list.towns = []
  }
  function setArea (val) {
    data.area = val
    data.town = undefined
    loadTowns(val).then(resp => {
      list.towns = resp
    })
  }
  function setTown (val) {
    data.town = val
  }

  return {
    list,
    data,
    resetRegionList,
    resetRegionData,
    setProvince,
    setCity,
    setArea,
    setTown
  }
}
