import { reactive, computed, toRaw, watch, onBeforeMount } from 'vue'

import { PROVINCE_KEY, CITY_KEY, AREA_KEY, TOWN_KEY } from '../constants'
import { CN } from '../language'
import { regionProvinces } from '../formatted'
import { regionToModel, modelToRegion } from '../utils/parse'
import {
  getCities, getAreas,
  availableLevels, getLevels, useState
} from '../utils/helper'

export function mergeBaseProps (props) {
  return {
    city: { type: Boolean, default: true },
    area: { type: Boolean, default: true },
    // town: { type: Boolean, default: false },
    language: { type: String, default: CN },
    modelValue: { type: Object, default: undefined },
    ...props
  }
}
export function mergeSelectorProps (props) {
  return mergeBaseProps({
    disabled: { type: Boolean, default: false },
    /** 为触发对象添加自定义样式类 */
    customTriggerClass: { type: String, default: '' },
    /** 为下拉容器添加自定义样式类 */
    customContainerClass: { type: String, default: '' },
    ...props
  })
}

export function mergeEmits (emit) {
  return ['update:modelValue', 'change', ...(emit || [])]
}

/**
 * 响应 `v-model` 与 `change` 事件
 *
 * 要求组件中已定义 `update:modelValue` 与 `change`
 * @param {function} emit 事件响应对象
 */
export function useEvent (emit) {
  return {
    emitUpdateModelValue: data => emit('update:modelValue', regionToModel(data)),
    emitChange: data => emit('change', data)
  }
}

export function useRegion (props, emit) {
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
    isComplete,
    regionText,

    reset,
    setData,
    setLevel,
    getData,
    getLevelList
  }
}
