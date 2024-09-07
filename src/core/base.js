import { ref, computed, watch, watchEffect, onBeforeMount, provide, toRef } from 'vue'

import {
  KEY_PROVINCE, KEY_CITY, KEY_AREA, KEY_TOWN, LEVEL_KEYS,
  injectKeyCore
} from '../constants'
import { CN } from '../language'
import { regionProvinces } from '../formatted'
import { getCities, getAreas, getLevels, useState } from '../utils/helper'
import {
  getRegionText,
  getTowns,
  getTownModel,
  getLowerLevels,
  valueEqualToModel,
  availableValues,
  availableLevels,
  createLevel
} from './helper'
import { valueToModel, modelToValue } from './parse'
import { regionCities } from 'types'

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
function useData () {
  const data = ref({
    [KEY_PROVINCE]: createLevel(regionProvinces),
    [KEY_CITY]: createLevel(),
    [KEY_AREA]: createLevel(),
    [KEY_TOWN]: createLevel()
  })
  const loader = {
    [KEY_CITY]: parentKey => getCities(parentKey),
    [KEY_AREA]: parentKey => getAreas(parentKey),
    [KEY_TOWN]: undefined
  }

  const getDataValues = () => modelToValue(data)

  const resetLevel = (level) => {
    data.value[level].key = undefined
    data.value[level].name = undefined
    data.value[level].list = []
  }
  /**
   * 清除级别数据
   * @param {string} level 级别编码，传递空内容则清除所有级别数据
   */
  const resetLowerLevel = level => {
    if (level === KEY_TOWN) return
    getLowerLevels(level).forEach(level => resetLevel(level))
  }
  const setLevelByKey = (level, key, list) => {
    const model = list.find(val => val.key === key)
    data.value[level].key = model?.key
    data.value[level].name = model?.value
  }
  const setTownListLoader = fn => {
    loader[KEY_TOWN] = parentKey => fn(parentKey)
  }

  return {
    data,
    getDataValues,
    resetLowerLevel,
    setTownListLoader
  }
}
export function useRegion (props, emit) {
  const { emitUpdateModelValue, emitChange } = useEvent(emit)
  const { hasCity, hasArea, hasTown } = useState(props)
  const {
    data,
    getDataValues,
    resetLowerLevel,
    setTownListLoader
  } = useData()

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
    // switch (level) {
    //   case KEY_PROVINCE: return provinces
    //   case KEY_CITY: return cities
    //   case KEY_AREA: return areas
    // }
    return data.value[level].list
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

    resetLowerLevel()
    //
    const model = valueToModel(values, levels)

    if (
      typeof getTown.value === 'function' &&
      levels.includes(KEY_TOWN) &&
      values.town
    ) {
      model[KEY_TOWN] = await getTown.value(model.area, values.town)
    }

    setData(model)
    // 经过校验和清洗后，若值发生变化，则响应 modelValue 变更事件
    emitData(!valueEqualToModel(props.modelValue, model))
  }

  onBeforeMount(() => parseValuesToModel())

  provide(injectKeyCore, {
    modelValue: toRef(props, 'modelValue'),
    data,
    setTownListLoader
  })

  return {
    data,
    provinces,
    cities,
    areas,
    isComplete,
    regionText,
    getTown,

    reset,
    setLevel,
    getLevelList,
    setTownListLoader
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
