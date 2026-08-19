import {
  ref, computed, toRefs
} from 'vue'
import type { Ref, ComputedRef } from 'vue'

import {
  PROVINCE, CITY, AREA, TOWN, LEVEL_KEYS
} from '../constants'
import { regionProvinces } from '../formatted'
import { getCities, getAreas } from './list-loader'
import { modelToValue, modelToValues } from './parse'

import type { RegionItem, RegionProps } from '../types'

/**
 * 响应 `v-model` 与 `change` 事件
 *
 * 要求组件中已定义 `update:modelValue` 与 `change`
 * @param {function} emit 事件响应对象
 */
export function useEvent(emit) {
  return {
    emitUpdateModelValue: data => emit?.('update:modelValue', data),
    emitUpdateNames: data => emit?.('update:names', data),
    emitChange: data => emit?.('change', data)
  }
}

const createRegionLevel = (
  enable: Ref<boolean> | ComputedRef<boolean>, list?: RegionItem[]
) => ({
  key: undefined,
  name: undefined,
  list: list || [],
  enable,
  getModel() {
    return this.key ? { key: this.key, value: this.name } : undefined
  }
})
const getLevelIndex = (level: string) => LEVEL_KEYS.indexOf(level)

export function useRegionCore(props: RegionProps) {
  const { city, area, town, autoSelectFirst } = toRefs(props)

  const setupTown = ref(false)




  const hasCity = computed(() => city?.value)
  const hasArea = computed(() => city?.value && area?.value)
  const hasTown = computed(() => city?.value && area?.value && town?.value && setupTown.value)
  const data = ref({
    [PROVINCE]: createRegionLevel(ref(true), regionProvinces),
    [CITY]: createRegionLevel(hasCity),
    [AREA]: createRegionLevel(hasArea),
    [TOWN]: createRegionLevel(hasTown)
  })
  const isComplete = () => (
    Object.values(data.value).filter(val => val.enable).every(val => val.key)
  )
  const setModel = (level: string, model) => {
    data.value[level].key = model?.key
    data.value[level].name = model?.value
  }
  const getLevelModel = (level: string) => data.value[level].getModel()
  const getModelFormList = (level: string, key: string) => (
    data.value[level].list.find((val: RegionItem) => val.key === key)
  )
  const resetRegion = (startLevel: string) => {
    const startIndex = getLevelIndex(startLevel)
    // reset level model
    LEVEL_KEYS.slice(startIndex).forEach(level => setModel(level))
    // reset level list
    LEVEL_KEYS.slice(startIndex + 1).forEach(level => { data.value[level].list = [] })
  }
  const getModel = (level: string, options) => {
    const value = options.values?.[level]?.trim()

    if (typeof value === 'object') return value
    if (typeof value === 'string' && value) {
      const model = getModelFormList(level, value)
      if (model) return model
      // 无效的编码
      throw new Error()
    }
    // 启用 auto-select-first 或列表中仅有单一项目的场景，自动选中该级别项目
    if (
      !options?.modelValueChange &&
      (autoSelectFirst.value || data.value[level].list.length === 1)
    ) {
      return data.value[level].list.at(0)
    }

    throw new Error()
  }
  const setLevelModel = (level: string, options) => {
    const model = getModel(level, options)
    setModel(level, model)
    return options
  }
  const setLevelList = (level: string, options, list: RegionItem[], enable: boolean) => {
    if (!enable.value || !list.length) throw new Error(level + 'list')
    data.value[level].list = list
    return options
  }
  const setModelJobs = LEVEL_KEYS.map(level => options => setLevelModel(level, options))
  const loadListJobs = [
    options => setLevelList(
      CITY, options, getCities(getLevelModel(PROVINCE)), hasCity
    ),
    options => setLevelList(
      AREA, options, getAreas(getLevelModel(CITY)), hasArea
    )
  ]
  const createJobs = (startLevel: string) => {
    return setModelJobs.reduce((jobs, fn, index) => {
      if (index >= getLevelIndex(startLevel)) {
        jobs.push(fn)
        if (index < loadListJobs.length) jobs.push(loadListJobs.at(index))
      }
      return jobs
    }, [])
  }
  const executeRegionScheduling = (startLevel: string, options) => {
    resetRegion(startLevel)

    const scheduling = createJobs(startLevel).reduce(
      (promise, fn) => promise.then(fn), Promise.resolve(options)
    )

    return scheduling.catch(() => { })
  }
  const setRegion = values => {
    const options = { values, modelValueChange: true }
    return executeRegionScheduling(PROVINCE, options)
  }
  const setRegionLevel = (level: string, values) => {
    return executeRegionScheduling(level, { values })
  }
  // 装配乡镇级别列表拉取实现
  const setupTownListLoader = (fn) => {
    loadListJobs[getLevelIndex(AREA)] = options => fn(getLevelModel(AREA)).then(
      list => setLevelList(TOWN, options, list || [], hasTown)
    )
    setupTown.value = true
  }
  const toValues = () => modelToValue(data.value, 'key')
  const toNames = () => modelToValues(data.value, 'name')
  const toModel = () => Object.fromEntries(
    LEVEL_KEYS.map(level => [level, getLevelModel(level)])
  )

  return {
    data,
    hasCity,
    hasArea,
    hasTown,
    isComplete,
    resetRegion,
    setRegion,
    setRegionLevel,
    setupTownListLoader,
    toValues,
    toModel,
    toNames
  }
}
