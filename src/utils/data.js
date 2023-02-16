import { reactive, toRaw } from 'vue'
import { CN } from '../language'
import { regionProvinces } from '../formatted'
import { regionToModel } from './parse'
import { loadCities, loadAreas, loadTowns } from './helper'

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

  function reset () {
    resetRegionList()
    resetRegionData()
  }
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
  function setData (val) {
    Object.assign(data, val)
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
  function getData () {
    return toRaw(data)
  }

  return {
    list,
    data,
    reset,
    resetRegionList,
    resetRegionData,
    setData,
    setProvince,
    setCity,
    setArea,
    setTown,
    getData
  }
}
