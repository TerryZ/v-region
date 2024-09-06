import { ref, computed, watch, watchEffect, onBeforeMount } from 'vue'

import { KEY_PROVINCE, KEY_CITY, KEY_AREA, KEY_TOWN } from '../constants'
import { CN } from '../language'
import { regionProvinces } from '../formatted'
import { getCities, getAreas, getLevels, useState } from '../utils/helper'
import {
  getRegionText,
  getTowns,
  getTownModel,
  valueEqualToModel,
  availableValues,
  availableLevels
} from './helper'
import { valueToModel, modelToValue } from './parse'

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
    emitUpdateModelValue: data => emit('update:modelValue', modelToValue(data)),
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
  // 初始为空，应用到乡镇级别时，再设置相关处理函数
  const getTown = ref()

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

  watch(() => props.modelValue, () => parseValuesToModel())

  // TODO: data 从 reactive 换成 ref，评估是否还需要 set
  const setData = val => {
    // Object.assign(data.value, val)
    data.value = val
  }
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
  // 将 v-model 输入的值转换为数据模型
  // TODO: 改造第 4 级的数据处理
  async function parseValuesToModel () {
    if (!props.modelValue || !Object.keys(props.modelValue).length) {
      return
    }
    // 值与模型一致，不进行转换
    if (valueEqualToModel(props.modelValue, data.value)) {
      return
    }
    const values = availableValues(props.modelValue)
    const levels = availableLevels(props)
    console.log(values)
    console.log(levels)
    const model = valueToModel(values, levels)

    if (typeof getTown.value === 'function' && values.town) {
      model[KEY_TOWN] = await getTown.value(model.area, values.town)
    }

    setData(model)
    console.log(valueEqualToModel(props.modelValue, model))
    emitData(!valueEqualToModel(props.modelValue, model))
  }

  onBeforeMount(() => parseValuesToModel())

  return {
    data,
    provinces,
    cities,
    areas,
    isComplete,
    regionText,
    getTown,

    reset,
    setData,
    setLevel,
    getLevelList
  }
}

export function useRegionTown (modelValue, data) {
  const towns = ref([])

  watchEffect(async () => {
    towns.value = await getTowns(data.value?.area)
    // console.log(towns.value)
    const townKey = modelValue.value?.town
    console.log(modelValue.value)
    if (townKey && towns.value.some(item => item.key === townKey)) {
      data.value.town = towns.value.find(item => item.key === townKey)
    }
  })

  async function getRegionTown (areaModel, townKey) {
    // if (!townKey) return
    // if (towns.value.some(item => item.key === townKey)) {
    //   return towns.value.find(item => item.key === townKey)
    // }
    // console.log('not in towns')
    // return await getTownModel(areaModel, townKey)
  }

  // onBeforeMount(async () => {
  //   if (!modelValue.value?.town) return
  //   data.value.town = await getRegionTown(data.value.area, modelValue.value.town)
  // })

  return {
    towns,
    getRegionTown
  }
}
