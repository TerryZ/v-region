import { ref, computed, watch, provide, toRef, inject, onMounted } from 'vue'

import {
  KEY_PROVINCE, KEY_CITY, KEY_AREA, KEY_TOWN, LEVEL_KEYS,
  injectKeyCore, injectKeySelector
} from '../constants'
import { regionProvinces } from '../formatted'
import {
  isEmptyValues,
  getRegionText,
  getLowerLevels,
  valueEqualToModel,
  getAvailableValues,
  getAvailableLevels,
  createLevel,
  getLanguage,
  useState
} from './helper'
import { getCities, getAreas } from './list-loader'
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
  const fullLevels = ref(false)
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
  const availableLevels = computed(() => getAvailableLevels(props, fullLevels.value))
  const hasNextLevel = level => {
    const index = availableLevels.value.findIndex(val => val === level)
    return index !== -1 && index < availableLevels.value.length - 1
  }
  const getNextLevel = level => {
    const index = availableLevels.value.findIndex(val => val === level)
    return availableLevels.value.at(index + 1)
  }

  const levelListLoader = async (level, parentLevel, loader) => {
    const model = getLevelModel(parentLevel)
    data.value[level].list = await loader(model)
  }
  // 装配乡镇级别列表拉取实现
  const setupTownListLoader = async (fn) => {
    nextLevelListLoader[KEY_AREA] = async () => {
      const areaModel = getLevelModel(KEY_AREA)
      if (!areaModel) return
      data.value[KEY_TOWN].list = await fn(areaModel)
    }

    fullLevels.value = true
    // await nextLevelListLoader[KEY_AREA]()
    // const model = getModel(KEY_TOWN, props.modelValue?.[KEY_TOWN])
    // await setLevelByModel(KEY_TOWN, model)
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
  const parseDataValues = () => modelToValue(data.value)
  const parseDataModel = () => Object.fromEntries(
    LEVEL_KEYS.map(level => [level, getLevelModel(level)])
  )

  return {
    data,
    availableLevels,
    getNextLevel,
    parseDataValues,
    parseDataModel,
    resetLowerLevel,
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
    getNextLevel,
    parseDataValues,
    setLevelByModel,
    setModelByValues,
    resetLowerLevel,
    parseDataModel,
    setupTownListLoader
  } = useData(props)

  const regionText = computed(() => getRegionText(data.value, props.separator))
  const isComplete = computed(() => (
    availableLevels.value.every(level => !!data.value[level].key)
  ))

  const selector = inject(injectKeySelector, undefined)

  watch(() => props.modelValue, parseValueToModel)
  // 界面渲染完成，乡镇级别挂载完成，执行数据转换与匹配
  onMounted(parseValueToModel)

  /**
   * 将 v-model 输入的值转换为数据模型
   *
   * 入参数据模型格式:
   * {
   *   province: string,
   *   city: string,
   *   area: string,
   *   town: string
   * }
   *
   * 数据模型格式:
   * {
   *   province: { key: string, value: string },
   *   city: { key: string, value: string },
   *   area: { key: string, value: string },
   *   town: { key: string, value: string }
   * }
   */
  async function parseValueToModel () {
    if (!props.modelValue || !Object.keys(props.modelValue).length) {
      return
    }
    // 值与模型一致，不进行转换
    if (valueEqualToModel(props.modelValue, data.value)) {
      return
    }
    // 校验与清洗后的 modelValue 值
    const cleanedValues = getAvailableValues(props.modelValue)

    if (isEmptyValues(cleanedValues)) return reset()

    await setModelByValues(cleanedValues)
    // 经过校验和清洗后，若值发生变化，则响应 modelValue 变更事件
    emitData(!valueEqualToModel(props.modelValue, data.value))
  }
  function emitData (emitModel = true) {
    if (emitModel) emitUpdateModelValue(parseDataValues())
    emitChange(parseDataModel())
    // 将数据模型传递给 dropdown 用于 trigger 的选中内容展示
    selector?.setRegionModel?.(parseDataModel())
  }
  function reset () {
    resetLowerLevel()
    emitData()
  }
  async function setLevel (level, val) {
    await setLevelByModel(level, val)
    emitData()
  }

  provide(injectKeyCore, {
    modelValue: toRef(props, 'modelValue'),
    disabled: toRef(props, 'disabled'),
    data,
    lang,
    isComplete,
    hasCity,
    hasArea,
    hasTown,
    getNextLevel,
    setLevel,
    setupTownListLoader
  })

  return {
    data,
    lang,
    isComplete,
    regionText,
    hasCity,
    hasArea,
    hasTown,
    availableLevels,
    getNextLevel,

    reset,
    setLevel,
    setupTownListLoader
  }
}
