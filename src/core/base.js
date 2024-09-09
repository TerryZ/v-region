import { ref, computed, watch, onBeforeMount, provide, toRef } from 'vue'

import {
  KEY_PROVINCE, KEY_CITY, KEY_AREA, KEY_TOWN, LEVEL_KEYS,
  injectKeyCore
} from '../constants'
import { CN } from '../language'
import { regionProvinces } from '../formatted'
import { getCities, getAreas, useState } from '../utils/helper'
import {
  getRegionText,
  getLowerLevels,
  valueEqualToModel,
  availableValues,
  availableLevels,
  createLevel
} from './helper'
import { modelToValue } from './parse'

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
function useData (settings) {
  const data = ref({
    [KEY_PROVINCE]: createLevel(regionProvinces),
    [KEY_CITY]: createLevel(),
    [KEY_AREA]: createLevel(),
    [KEY_TOWN]: createLevel()
  })
  const nextLevelListLoader = {
    [KEY_PROVINCE]: () => levelListLoader(KEY_CITY, KEY_PROVINCE, getCities),
    [KEY_CITY]: () => levelListLoader(KEY_AREA, KEY_CITY, getAreas),
    [KEY_AREA]: undefined
  }

  const levelListLoader = (level, parentLevel, loader) => {
    const model = getLevelModel(parentLevel)
    data.value[level].list = loader(model)
    data.value[level].parentKey = model.key
  }
  const setupTownListLoader = async (fn, townKey) => {
    const townListLoader = async (handler) => {
      const areaModel = getLevelModel(KEY_AREA)
      if (!areaModel) return
      data.value[KEY_TOWN].list = await fn(areaModel)
      data.value[KEY_TOWN].parentKey = areaModel.key
      handler && handler()
      // 响应数据变更
      settings?.triggerModelChangeEvent()
    }
    nextLevelListLoader[KEY_AREA] = townListLoader
    await townListLoader(() => setLevelByKey(KEY_TOWN, townKey))
  }
  const resetLevel = (level) => {
    data.value[level].key = undefined
    data.value[level].name = undefined
    if (level !== KEY_PROVINCE) data.value[level].list = []
  }
  /**
   * 清除级别数据
   * @param {string} level 级别编码，传递空内容则清除所有级别数据
   */
  const resetLowerLevel = level => {
    if (level === KEY_TOWN) return
    getLowerLevels(level).forEach(level => resetLevel(level))
  }
  // ui 操作设置级别
  const setLevelByModel = (level, model, handler) => {
    if (!model) return

    resetLowerLevel(level)

    data.value[level].key = model.key
    data.value[level].name = model.value

    nextLevelListLoader[level]?.(handler)
  }
  // 响应 modelValue 变更
  const setLevelByKey = (level, key, handler) => {
    const model = data.value[level].list.find(val => val.key === key)
    setLevelByModel(level, model, handler)
  }
  const setModelByValues = (availableLevels, availableValues) => {
    availableLevels
      .filter(val => val !== KEY_TOWN)
      .forEach(level => {
        // 在 area 级别设置模型并拉取 town 级别列表后，追加 town 级别的模型设置操作
        const handler = level === KEY_AREA && availableValues[KEY_TOWN]
          ? () => setLevelByKey(KEY_TOWN, availableValues[KEY_TOWN])
          : undefined
        setLevelByKey(level, availableValues[level], handler)
      })
  }
  const getLevelModel = level => {
    const levelModel = data.value[level]
    if (!levelModel.key) return
    return { key: levelModel.key, value: levelModel.name }
  }
  const getDataValues = () => modelToValue(data)
  const parseDataModel = () => {
    const model = {}
    LEVEL_KEYS.forEach(level => {
      model[level] = getLevelModel(level)
    })
    return model
  }

  return {
    data,
    getDataValues,
    resetLowerLevel,
    parseDataModel,
    setLevelByKey,
    setLevelByModel,
    setModelByValues,
    setupTownListLoader
  }
}
export function useRegion (props, emit) {
  const { emitUpdateModelValue, emitChange } = useEvent(emit)
  const { hasCity, hasArea, hasTown } = useState(props)
  const {
    data,
    setLevelByModel,
    setModelByValues,
    resetLowerLevel,
    parseDataModel,
    setupTownListLoader
  } = useData({
    triggerModelChangeEvent
  })

  const provinces = computed(() => regionProvinces)
  const cities = computed(() => getCities(data.value.province))
  const areas = computed(() => getAreas(data.value.city))
  const regionText = computed(() => getRegionText(data))
  // ?
  const isComplete = computed(() => {
    if (!hasCity.value && data.value.province) return true
    if (!hasArea.value && data.value.city) return true
    if (!hasTown.value && data.value.area) return true
    return !!data.value.town
  })

  watch(() => props.modelValue, () => parseValueToModel())
  onBeforeMount(() => parseValueToModel())

  function emitData (emitModel = true) {
    if (emitModel) emitUpdateModelValue(data.value)
    emitChange(parseDataModel())
  }
  // 经过校验和清洗后，若值发生变化，则响应 modelValue 变更事件
  function triggerModelChangeEvent () {
    emitData(!valueEqualToModel(props.modelValue, data.value))
  }
  function reset () {
    resetLowerLevel()
    emitData()
  }
  function setLevel (level, val) {
    setLevelByModel(level, val)
    emitData()
  }
  function getLevelList (level) {
    return data.value[level].list
  }
  // 将 v-model 输入的值转换为数据模型
  function parseValueToModel () {
    if (!props.modelValue || !Object.keys(props.modelValue).length) {
      return
    }
    // 值与模型一致，不进行转换
    if (valueEqualToModel(props.modelValue, data.value)) {
      return
    }
    // 校验与清洗后的 modelValue 值
    const values = availableValues(props.modelValue)
    // props 设置的有效的级别列表
    const levels = availableLevels(props)
    setModelByValues(levels, values)
    // 没有 town 级别时，响应数据变更事件
    // 因 town 级别的数据处理是异步的，所以需要另行处理
    if (!levels.includes(KEY_TOWN)) {
      triggerModelChangeEvent()
    }
  }

  provide(injectKeyCore, {
    modelValue: toRef(props, 'modelValue'),
    data,
    disabled: toRef(props, 'disabled'),
    setLevel,
    setupTownListLoader
  })

  return {
    data,
    provinces,
    cities,
    areas,
    isComplete,
    regionText,

    reset,
    setLevel,
    getLevelList
  }
}
