import { ref, computed, watch, provide, toRef } from 'vue'

import {
  KEY_PROVINCE, KEY_CITY, KEY_AREA, KEY_TOWN, LEVEL_KEYS,
  injectKeyCore
} from '../constants'
import { regionProvinces } from '../formatted'
import {
  getRegionText,
  getLowerLevels,
  valueEqualToModel,
  getAvailableValues,
  getAvailableLevels,
  createLevel,
  getCities,
  getAreas,
  getLanguage,
  useState
} from './helper'
import { modelToValue } from './parse'

/**
 * 响应 `v-model` 与 `change` 事件
 *
 * 要求组件中已定义 `update:modelValue` 与 `change`
 * @param {function} emit 事件响应对象
 */
export function useEvent (emit) {
  return {
    emitUpdateModelValue: data => emit && emit('update:modelValue', data),
    emitChange: data => emit && emit('change', data)
  }
}
/**
 * Region 核心数据模块
 * @returns {object}
 */
function useData (props) {
  const data = ref({
    [KEY_PROVINCE]: createLevel(regionProvinces),
    [KEY_CITY]: createLevel(),
    [KEY_AREA]: createLevel(),
    [KEY_TOWN]: createLevel()
  })
  const nextLevelListLoader = {
    [KEY_PROVINCE]: () => levelListLoader(KEY_CITY, KEY_PROVINCE, getCities),
    [KEY_CITY]: () => levelListLoader(KEY_AREA, KEY_CITY, getAreas),
    [KEY_AREA]: () => {},
    [KEY_TOWN]: () => {}
  }
  // props 设置的有效的级别列表
  const availableLevels = computed(() => getAvailableLevels(props))
  const hasNextLevel = level => {
    const index = availableLevels.value.findIndex(val => val === level)
    return index !== -1 && index < availableLevels.value.length - 1
  }

  const levelListLoader = async (level, parentLevel, loader) => {
    const model = getLevelModel(parentLevel)
    data.value[level].list = await loader(model)
    data.value[level].parentKey = model.key
  }
  const setupTownListLoader = async (fn) => {
    nextLevelListLoader[KEY_AREA] = async () => {
      const areaModel = getLevelModel(KEY_AREA)
      if (!areaModel) return
      data.value[KEY_TOWN].list = await fn(areaModel)
      data.value[KEY_TOWN].parentKey = areaModel.key
    }

    await nextLevelListLoader[KEY_AREA]()
    const model = getModel(KEY_TOWN, props.modelValue?.[KEY_TOWN])
    setLevelByModel(KEY_TOWN, model)
  }
  // 在列表中查找数据模型
  const getModel = (level, key) => (
    data.value[level].list.find(val => val.key === key)
  )
  const setModel = (level, model) => {
    data.value[level].key = model ? model.key : undefined
    data.value[level].name = model ? model.value : undefined
  }
  // ui 操作设置级别
  const setLevelByModel = async (level, model) => {
    if (!model) return

    resetLowerLevel(level)
    setModel(level, model)
    if (!hasNextLevel(level)) return

    await nextLevelListLoader[level]?.()
  }
  // 响应 v-model 变更
  const setModelByValues = async (availableValues) => {
    for (const level of availableLevels.value) {
      const model = getModel(level, availableValues[level])
      await setLevelByModel(level, model)
    }
  }
  const resetLevel = (level) => {
    setModel(level)
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
  // 在 data 数据对象中获得级别的数据模型
  const getLevelModel = level => {
    const { key, name } = data.value[level]
    return key ? { key, value: name } : undefined
  }
  const getDataValues = () => modelToValue(data.value)
  const parseDataModel = () => Object.fromEntries(
    LEVEL_KEYS.map(level => [level, getLevelModel(level)])
  )

  return {
    data,
    availableLevels,
    hasNextLevel,
    getDataValues,
    resetLowerLevel,
    parseDataModel,
    setLevelByModel,
    setModelByValues,
    setupTownListLoader
  }
}
/**
 * Region 核心数据与组件交互，与组件对接
 * @param {object} props
 * @param {string[]} emit
 * @returns {object}
 */
export function useRegion (props, emit) {
  const { emitUpdateModelValue, emitChange } = useEvent(emit)
  const { hasCity, hasArea, hasTown } = useState(props)
  const lang = getLanguage(props.language)
  const {
    data,
    availableLevels,
    getDataValues,
    setLevelByModel,
    setModelByValues,
    resetLowerLevel,
    parseDataModel,
    setupTownListLoader
  } = useData(props)

  // TODO: to remove
  const provinces = computed(() => regionProvinces)
  const cities = computed(() => getCities(data.value.province))
  const areas = computed(() => getAreas(data.value.city))
  const regionText = computed(() => getRegionText(data.value, props.separator))
  // ?
  const isComplete = computed(() => {
    if (!hasCity.value && data.value[KEY_PROVINCE].key) return true
    if (!hasArea.value && data.value[KEY_CITY].key) return true
    if (!hasTown.value && data.value[KEY_AREA].key) return true
    return !!data.value[KEY_TOWN].key
  })

  watch(() => props.modelValue, () => parseValueToModel(), { immediate: true })

  // 将 v-model 输入的值转换为数据模型
  async function parseValueToModel () {
    if (!props.modelValue || !Object.keys(props.modelValue).length) {
      return
    }
    // 值与模型一致，不进行转换
    if (valueEqualToModel(props.modelValue, data.value)) {
      return
    }
    // 校验与清洗后的 modelValue 值
    const values = getAvailableValues(props.modelValue)
    await setModelByValues(values)
    // 经过校验和清洗后，若值发生变化，则响应 modelValue 变更事件
    emitData(!valueEqualToModel(props.modelValue, data.value))
  }
  function emitData (emitModel = true) {
    if (emitModel) emitUpdateModelValue(getDataValues())
    emitChange(parseDataModel())
  }
  function reset () {
    resetLowerLevel()
    emitData()
  }
  async function setLevel (level, val) {
    await setLevelByModel(level, val)
    emitData()
  }
  // TODO: to remove
  function getLevelList (level) {
    return data.value[level].list
  }

  provide(injectKeyCore, {
    modelValue: toRef(props, 'modelValue'),
    disabled: toRef(props, 'disabled'),
    data,
    lang,
    hasCity,
    hasArea,
    hasTown,
    setLevel,
    setupTownListLoader
  })

  return {
    data,
    lang,
    provinces,
    cities,
    areas,
    isComplete,
    regionText,
    hasCity,
    hasArea,
    hasTown,
    availableLevels,

    reset,
    setLevel,
    getLevelList
  }
}
