import { ref, reactive, computed, toRaw, watch, watchEffect, onBeforeMount } from 'vue'

import { PROVINCE_KEY, CITY_KEY, AREA_KEY, TOWN_KEY } from '../constants'
import { CN } from '../language'
import { regionProvinces } from '../formatted'
import { regionToModel, modelToRegion, getTownModel } from '../utils/parse'
import {
  getCities, getAreas, getTowns,
  availableLevels, getLevels, useState
} from '../utils/helper'
import { getRegionText, modelEqualToRegion } from './helper'

export function mergeBaseProps (props) {
  return {
    city: { type: Boolean, default: true },
    area: { type: Boolean, default: true },
    town: { type: Boolean, default: true },
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
  const { hasCity, hasArea, hasTown } = useState(props)

  const data = reactive({
    province: undefined,
    city: undefined,
    area: undefined,
    town: undefined
  })

  const provinces = computed(() => regionProvinces)
  const cities = computed(() => getCities(data.province))
  const areas = computed(() => getAreas(data.city))
  const regionText = computed(() => getRegionText(data))
  const isComplete = computed(() => {
    if (!hasCity.value && data.province) return true
    if (!hasArea.value && data.city) return true
    if (!hasTown.value && data.area) return true
    return !!data.town
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
  function emitData (emitModel = true) {
    if (emitModel) emitUpdateModelValue(getData())
    emitChange(getData())
  }
  function reset () {
    clearData()
    emitData()
  }
  function setLevel (level, val) {
    data[level] = val

    clearData(level)
    emitData()
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
    if (modelEqualToRegion(props.modelValue, getData())) {
      return
    }
    modelToRegion(props.modelValue, availableLevels(props)).then(resp => {
      setData(resp)
      emitData(false)
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

export function useRegionTown (data, setLevel) {
  const towns = ref([])

  watchEffect(async () => {
    towns.value = await getTowns(data?.area)
    // if (!town || !inLevel(TOWN_KEY) || !region[AREA_KEY]) return region
    // TODO: 设置 town 的数据模型
    data[TOWN_KEY] = await getTownModel(data[AREA_KEY], data?.town)
  })

  // function getFullyLevelList (level) {
  //   if (level === TOWN_KEY) return towns
  //   return getLevelList(level)
  // }

  return {
    towns
  }
}
