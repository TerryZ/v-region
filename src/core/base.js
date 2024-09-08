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
  createLevel,
  getNextLevel,
  isPromise
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
function useData () {
  const data = ref({
    [KEY_PROVINCE]: createLevel(regionProvinces),
    [KEY_CITY]: createLevel(),
    [KEY_AREA]: createLevel(),
    [KEY_TOWN]: createLevel()
  })
  const loader = {
    [KEY_CITY]: getCities,
    [KEY_AREA]: getAreas,
    [KEY_TOWN]: undefined
  }

  const getDataValues = () => modelToValue(data)

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
  const setLevelByModel = (level, model) => {
    if (!model) return

    resetLowerLevel(level)

    data.value[level].key = model.key
    data.value[level].name = model.value

    const nextLevel = getNextLevel(level)

    if (!nextLevel) return

    const listLoader = loader[nextLevel]

    if (!listLoader) return

    const setList = list => {
      data.value[nextLevel].list = list
      data.value[nextLevel].parentKey = model.key
    }

    const result = listLoader(model)
    // setList(result)
    // console.log(result)
    if (isPromise(result)) {
      result.then(list => setList(list))
    } else {
      setList(result)
    }
  }
  // 响应 modelValue 变更
  const setLevelByKey = (level, key) => {
    const model = data.value[level].list.find(val => val.key === key)
    setLevelByModel(level, model)
  }
  const getLevelModel = level => {
    const levelModel = data.value[level]
    if (!levelModel.key) return
    return { key: levelModel.key, value: levelModel.name }
  }
  const setupTownListLoader = async (fn, townKey) => {
    loader[KEY_TOWN] = fn
    // if (!data.value[KEY_TOWN].key) return

    const areaModel = getLevelModel(KEY_AREA)
    data.value[KEY_TOWN].list = await fn(areaModel)
    setLevelByKey(KEY_TOWN, townKey)
  }
  const parseDataModel = () => {
    const model = {}
    LEVEL_KEYS.forEach(level => {
      model[level] = getLevelModel(level)
    })
    return model
  }

  return {
    data,
    loader,
    getDataValues,
    resetLowerLevel,
    parseDataModel,
    setLevelByKey,
    setLevelByModel,
    setupTownListLoader
  }
}
export function useRegion (props, emit) {
  const { emitUpdateModelValue, emitChange } = useEvent(emit)
  const { hasCity, hasArea, hasTown } = useState(props)
  const {
    data,
    loader,
    getDataValues,
    setLevelByModel,
    setLevelByKey,
    resetLowerLevel,
    parseDataModel,
    setupTownListLoader
  } = useData()

  // 初始为空，应用到乡镇级别时，再设置相关处理函数
  const getTown = ref()

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

  // TODO: data 从 reactive 换成 ref，评估是否还需要 set
  const setData = val => {
    // Object.assign(data.value, val)
    data.value = val
  }
  function emitData (emitModel = true) {
    if (emitModel) emitUpdateModelValue(data.value)
    emitChange(parseDataModel())
  }
  function reset () {
    resetLowerLevel()
    emitData()
  }
  function setLevel (level, val) {
    // data.value[level] = val

    // resetLowerLevel(level)
    setLevelByModel(level, val)
    emitData()
  }
  function getLevelList (level) {
    return data.value[level].list
  }
  // 将 v-model 输入的值转换为数据模型
  // TODO: 改造第 4 级的数据处理
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
    // console.log(values)
    // console.log(levels)

    resetLowerLevel()
    levels.forEach(level => {
      setLevelByKey(level, values[level])
    })
    // const model = valueToModel(values, levels)

    // if (
    //   typeof getTown.value === 'function' &&
    //   levels.includes(KEY_TOWN) &&
    //   values.town
    // ) {
    //   model[KEY_TOWN] = await getTown.value(model.area, values.town)
    // }

    // setData(model)
    // 经过校验和清洗后，若值发生变化，则响应 modelValue 变更事件
    emitData(!valueEqualToModel(props.modelValue, data.value))
  }

  onBeforeMount(() => parseValueToModel())

  provide(injectKeyCore, {
    modelValue: toRef(props, 'modelValue'),
    data,
    disabled: toRef(props, 'disabled'),
    setLevelByModel,
    setupTownListLoader
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
    getLevelList
  }
}

export function useRegionTown (modelValue, data) {
  const towns = ref([])

  watchEffect(async () => {
    // towns.value = await getTowns(data.value?.area)
    // // console.log(towns.value)
    // const townKey = modelValue.value?.town
    // console.log(modelValue.value)
    // if (townKey && towns.value.some(item => item.key === townKey)) {
    //   data.value.town = towns.value.find(item => item.key === townKey)
    // }
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
    townLostLoader: getTowns,
    getRegionTown
  }
}
