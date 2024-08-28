import { ref, reactive, computed, toRaw, watch, onBeforeMount } from 'vue'
import { PROVINCE_KEY, CITY_KEY, AREA_KEY, TOWN_KEY } from '../constants'
import { regionProvinces } from '../formatted'
import { modelToRegion } from '../utils/parse'
import {
  getCities, getAreas, getTowns,
  availableLevels, getLevels, useState
} from '../utils/helper'
import { useEvent } from './base'

export function useFullRegion (props, emit) {
  const { emitUpdateModelValue, emitChange } = useEvent(emit)
  const { haveCity, haveArea, haveTown } = useState(props)

  const data = reactive({
    province: undefined,
    city: undefined,
    area: undefined,
    town: undefined
  })

  const provinces = computed(() => regionProvinces)
  const cities = computed(() => getCities(data.province))
  const areas = computed(() => getAreas(data.city))
  const towns = ref([])
  const isComplete = computed(() => {
    if (!haveCity.value && data.province) return true
    if (!haveArea.value && data.city) return true
    if (!haveTown.value && data.area) return true
    return Boolean(data.town)
  })
  const regionText = computed(() => {
    return Object.values(data)
      .filter(val => val)
      .map(val => val.value)
      .join('')
  })

  watch(() => data.area, val => {
    getTowns(val).then(resp => { towns.value = resp })
  })
  watch(() => props.modelValue, () => modelToData())

  const getData = () => toRaw(data)
  const setData = val => Object.assign(data, val)
  /**
   * 清除级别数据
   * @param {string} level 级别编码，传递空内容则清除所有级别数据
   */
  function clearData (level) {
    if (level === TOWN_KEY) return

    getLevels(level).forEach(key => { data[key] = undefined })
  }
  function reset () {
    clearData()
    emitUpdateModelValue(getData())
    emitChange(getData())
  }
  function setLevel (level, val) {
    data[level] = val

    clearData(level)

    emitUpdateModelValue(getData())
    emitChange(getData())
  }
  function getLevelList (level) {
    switch (level) {
      case PROVINCE_KEY: return provinces
      case CITY_KEY: return cities
      case AREA_KEY: return areas
      case TOWN_KEY: return towns
    }
  }
  function modelToData () {
    if (!props.modelValue || !Object.keys(props.modelValue).length) {
      return
    }
    modelToRegion(props.modelValue, availableLevels(props)).then(resp => {
      setData(resp)
      emitChange(getData())
    })
  }

  onBeforeMount(() => modelToData())

  return {
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
  }
}
