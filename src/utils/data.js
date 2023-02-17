import { reactive, toRaw } from 'vue'
import { CITY_KEY, AREA_KEY, TOWN_KEY } from '../constants'
import { CN } from '../language'
import { regionProvinces } from '../formatted'
import { regionToModel } from './parse'
import { getCities, getAreas, getTowns } from './helper'

export const commonProps = {
  city: { type: Boolean, default: true },
  area: { type: Boolean, default: true },
  town: { type: Boolean, default: false },
  language: { type: String, default: CN },
  modelValue: { type: Object, default: undefined }
}

/**
 * 响应 `v-model` 与 `change` 事件
 *
 * 要求组件中已定义 `update:modelValue` 与 `change`
 * @param {function} emit 事件响应对象
 * @param {object} data 数据
 */
export function dataChange (emit, data) {
  emit('update:modelValue', regionToModel(data))
  emit('change', data)
}

function useRegionData () {
  const data = reactive({
    province: {},
    city: undefined,
    area: undefined,
    town: undefined
  })

  function reset () {
    data.province = undefined
    data.city = undefined
    data.area = undefined
    data.town = undefined
  }
  function setData (val) {
    Object.assign(data, val)
  }

  return {
    data,
    reset,
    setData
  }
}

function useRegionList () {
  const list = reactive({
    provinces: regionProvinces,
    cities: [],
    areas: [],
    towns: []
  })

  function reset () {
    list.cities = []
    list.areas = []
    list.towns = []
  }

  function loadLevelList (level, parentData) {
    switch (level) {
      case CITY_KEY: return (list.cities = getCities(parentData))
      case AREA_KEY: return (list.areas = getAreas(parentData))
      case TOWN_KEY:
        getTowns(parentData).then(resp => { list.towns = resp })
    }
  }

  return {
    list,
    reset,
    loadLevelList
  }
}

export function useData (props) {
  const data = useRegionData()
  const list = useRegionList()

  function reset () {
    list.reset()
    data.reset()
  }
  function setData (val) {
    Object.assign(data, val)

    list.reset()
  }
  function setProvince (val) {
    data.province = val
    data.city = undefined
    data.area = undefined
    data.town = undefined
    list.cities = getCities(val)
    list.areas = []
    list.towns = []
  }
  function setCity (val) {
    data.city = val
    data.area = undefined
    data.town = undefined
    list.areas = getAreas(val)
    list.towns = []
  }
  function setArea (val) {
    data.area = val
    data.town = undefined
    getTowns(val).then(resp => {
      list.towns = resp
    })
  }
  function setTown (val) {
    data.town = val
  }
  function getData () {
    return toRaw(data.data)
  }

  return {
    list,
    data,
    reset,
    setData,
    setProvince,
    setCity,
    setArea,
    setTown,
    getData
  }
}
