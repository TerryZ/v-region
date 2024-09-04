import { ref, computed, watch, watchEffect, onBeforeMount } from 'vue'

import { KEY_PROVINCE, KEY_CITY, KEY_AREA, KEY_TOWN } from '../constants'
import { CN } from '../language'
import { regionProvinces } from '../formatted'
import { regionToModel, valueToModel, getTownModel } from '../utils/parse'
import {
  getCities, getAreas, getTowns,
  availableLevels, getLevels, useState
} from '../utils/helper'
import { getRegionText, valueEqualToModel } from './helper'

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

  const data = ref({
    province: undefined,
    city: undefined,
    area: undefined,
    town: undefined
  })

  const provinces = computed(() => regionProvinces)
  const cities = computed(() => getCities(data.value.province))
  const areas = computed(() => getAreas(data.value.city))
  const regionText = computed(() => getRegionText(data))
  const isComplete = computed(() => {
    if (!hasCity.value && data.value.province) return true
    if (!hasArea.value && data.value.city) return true
    if (!hasTown.value && data.value.area) return true
    return !!data.value.town
  })

  watch(() => props.modelValue, () => modelToData())

  // TODO: data 从 reactive 换成 ref，评估是否还需要 set
  const setData = val => Object.assign(data.value, val)
  function emitData (emitModel = true) {
    if (emitModel) emitUpdateModelValue(data.value)
    emitChange(data.value)
  }
  /**
   * 清除级别数据
   * @param {string} level 级别编码，传递空内容则清除所有级别数据
   */
  function resetLowerLevel (level) {
    if (level === KEY_TOWN) return
    getLevels(level).forEach(key => { data.value[key] = undefined })
  }
  function reset () {
    resetLowerLevel()
    emitData()
  }
  function setLevel (level, val) {
    data.value[level] = val

    resetLowerLevel(level)
    emitData()
  }
  function getLevelList (level) {
    switch (level) {
      case KEY_PROVINCE: return provinces
      case KEY_CITY: return cities
      case KEY_AREA: return areas
    }
  }
  function modelToData () {
    if (!props.modelValue || !Object.keys(props.modelValue).length) {
      return
    }
    if (valueEqualToModel(props.modelValue, data.value)) {
      return
    }
    valueToModel(props.modelValue, availableLevels(props)).then(resp => {
      setData(resp)
      emitData(false) // only trigger `change` event
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
    getLevelList
  }
}

export function useRegionTown (data, setLevel) {
  const towns = ref([])

  watchEffect(async () => {
    towns.value = await getTowns(data.value?.area)
    // if (!town || !inLevel(KEY_TOWN) || !region[KEY_AREA]) return region
    // TODO: 设置 town 的数据模型
    data.value[KEY_TOWN] = await getTownModel(
      data.value[KEY_AREA], data.value?.town
    )
  })

  // function getFullyLevelList (level) {
  //   if (level === KEY_TOWN) return towns
  //   return getLevelList(level)
  // }

  return {
    towns
  }
}
