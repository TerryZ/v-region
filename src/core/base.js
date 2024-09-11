import { ref, computed, watch, provide, toRef } from 'vue'

import {
  KEY_PROVINCE, KEY_CITY, KEY_AREA, KEY_TOWN, LEVEL_KEYS,
  injectKeyCore
} from '../constants'
import { CN } from '../language'
import { regionProvinces } from '../formatted'
import {
  getRegionText,
  getLowerLevels,
  valueEqualToModel,
  availableValues,
  availableLevels,
  createLevel,
  getCities,
  getAreas,
  getLanguage,
  useState
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
/**
 * Region 核心数据模块
 * @returns {object}
 */
function useData () {
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

  const getModel = (level, key) => (
    data.value[level].list.find(val => val.key === key)
  )
  const setModel = (level, model) => {
    data.value[level].key = model ? model.key : undefined
    data.value[level].name = model ? model.value : undefined
  }
  const levelListLoader = async (level, parentLevel, loader) => {
    const model = getLevelModel(parentLevel)
    data.value[level].list = await loader(model)
    data.value[level].parentKey = model.key
  }
  const setupTownListLoader = async (fn, townKey) => {
    const townListLoader = async () => {
      const areaModel = getLevelModel(KEY_AREA)
      if (!areaModel) return
      data.value[KEY_TOWN].list = await fn(areaModel)
      data.value[KEY_TOWN].parentKey = areaModel.key
    }
    nextLevelListLoader[KEY_AREA] = townListLoader

    await townListLoader()
    const model = getModel(KEY_TOWN, townKey)
    setLevelByModel(KEY_TOWN, model)
  }
  // ui 操作设置级别
  const setLevelByModel = async (level, model) => {
    if (!model) return

    resetLowerLevel(level)

    setModel(level, model)
    await nextLevelListLoader[level]?.()
  }
  const setModelByValues = async (availableLevels, availableValues) => {
    const hasNextLevel = level => {
      const index = availableLevels.findIndex(val => val === level)
      return index !== -1 && index < availableLevels.length - 1
    }
    const setLevelData = async (level, key) => {
      const model = getModel(level, key)

      if (!model) return

      resetLowerLevel(level)
      setModel(level, model)

      if (!hasNextLevel(level)) return

      await nextLevelListLoader[level]?.()
    }

    for (const level of availableLevels) {
      await setLevelData(level, availableValues[level])
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
  const getLevelModel = level => {
    const model = data.value[level]
    if (!model.key) return
    return { key: model.key, value: model.name }
  }
  const getDataValues = () => modelToValue(data)
  const parseDataModel = () => {
    return Object.fromEntries(
      LEVEL_KEYS.map(level => [level, getLevelModel(level)])
    )
  }

  return {
    data,
    getDataValues,
    resetLowerLevel,
    parseDataModel,
    setLevelByModel,
    setModelByValues,
    setupTownListLoader
  }
}
/**
 * Region 核心数据与组件交互
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
    setLevelByModel,
    setModelByValues,
    resetLowerLevel,
    parseDataModel,
    setupTownListLoader
  } = useData()

  // TODO: to remove
  const provinces = computed(() => regionProvinces)
  const cities = computed(() => getCities(data.value.province))
  const areas = computed(() => getAreas(data.value.city))
  const regionText = computed(() => getRegionText(data))
  // ?
  const isComplete = computed(() => {
    if (!hasCity.value && data.value[KEY_PROVINCE]) return true
    if (!hasArea.value && data.value[KEY_CITY]) return true
    if (!hasTown.value && data.value[KEY_AREA]) return true
    return !!data.value[KEY_TOWN]
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
    const values = availableValues(props.modelValue)
    // props 设置的有效的级别列表
    const levels = availableLevels(props)
    await setModelByValues(levels, values)
    // 经过校验和清洗后，若值发生变化，则响应 modelValue 变更事件
    emitData(!valueEqualToModel(props.modelValue, data.value))
  }
  function emitData (emitModel = true) {
    if (emitModel) emitUpdateModelValue(data.value)
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

    reset,
    setLevel,
    getLevelList
  }
}
