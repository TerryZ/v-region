import { reactive, watch } from 'vue'
import { CN } from '../language'
import { regionProvinces } from '../formatted'

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

  watch(data, val => {
    console.log(val)
  }, { deep: true })

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

  return {
    list,
    data,
    resetRegionList,
    resetRegionData
  }
}
