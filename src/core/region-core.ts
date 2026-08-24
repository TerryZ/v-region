import { ref, computed, toRefs } from 'vue'
import type { Ref, ComputedRef, ExtractPropTypes } from 'vue'

import { PROVINCE, CITY, AREA, TOWN, LEVEL_KEYS } from '../constants'
import { regionProvinces } from '../formatted'
import { getCities, getAreas } from './list-loader'
import { modelToValue, modelToValues } from './parse'
import { getParentLevel, getLevelIndex } from './helper'

import type {
  RegionItem,
  RegionProps,
  RegionValues,
  RegionLevel,
  RegionLevelData,
  AsyncLevelListLoader
} from '../types'

interface StepContext {
  values: RegionValues
  modelValueChange?: boolean
}

export const townsCache = new Map<string, RegionItem[]>()

const createLevel = (
  enable: Ref<boolean> | ComputedRef<boolean>,
  list?: RegionItem[]
): RegionLevelData => ({
  key: undefined,
  name: undefined,
  list: list || [],
  enable,
  getModel() {
    return this.key ? { key: this.key, value: this.name } : undefined
  }
})

export function useRegionCore(props: ExtractPropTypes<RegionProps>) {
  const { city, area, town, autoSelectFirst } = toRefs(props)

  const loading = ref(false)
  const setupTown = ref(false)

  const hasCity = computed(() => !!city?.value)
  const hasArea = computed(() => !!(hasCity.value && area?.value))
  const hasTown = computed(() => !!(hasArea.value && town?.value && setupTown.value))
  const state = ref({
    [PROVINCE]: createLevel(ref(true), regionProvinces),
    [CITY]: createLevel(hasCity),
    [AREA]: createLevel(hasArea),
    [TOWN]: createLevel(hasTown)
  })
  const isComplete = () =>
    Object.values(state.value)
      .filter((val) => val.enable)
      .every((val) => val.key)
  const setModel = (level: RegionLevel, model?: RegionItem) => {
    state.value[level].key = model?.key
    state.value[level].name = model?.value
  }
  const getLevelModel = (level: RegionLevel) => state.value[level].getModel()
  const getModelFormList = (level: RegionLevel, key: string) =>
    state.value[level].list.find((val: RegionItem) => val.key === key)
  const resetRegion = (startLevel: RegionLevel) => {
    const startIndex = getLevelIndex(startLevel)
    // reset level model
    LEVEL_KEYS.slice(startIndex).forEach((level) => setModel(level))
    // reset level list
    LEVEL_KEYS.slice(startIndex + 1).forEach((level) => {
      state.value[level].list = []
    })
  }

  const toValues = () => modelToValue(state.value, 'key')
  const toNames = () => modelToValues(state.value, 'name')
  const toModel = () => Object.fromEntries(LEVEL_KEYS.map((level) => [level, getLevelModel(level)]))

  // 装配乡镇级别列表拉取实现
  const setupTownListLoader = (fn: AsyncLevelListLoader) => {
    loadListSteps[getLevelIndex(AREA)] = async () => await setLevelList(TOWN, fn, hasTown)
    setupTown.value = true
  }
  const getModel = (level: RegionLevel, ctx: StepContext) => {
    const value = ctx.values?.[level]?.trim()

    if (typeof value === 'object') return value
    if (typeof value === 'string' && value) {
      const model = getModelFormList(level, value)
      if (model) return model
      // 无效的编码
      throw new Error()
    }
    // 启用 auto-select-first 或列表中仅有单一项目的场景，自动选中该级别项目
    if (
      !ctx?.modelValueChange &&
      (autoSelectFirst?.value || state.value[level].list.length === 1)
    ) {
      return state.value[level].list.at(0)
    }

    throw new Error()
  }
  const setLevelModel = (level: RegionLevel, ctx: StepContext) => {
    const model = getModel(level, ctx)
    setModel(level, model)
  }
  const setLevelList = async (
    level: RegionLevel,
    listGetter: (model: RegionItem) => RegionItem[] | Promise<RegionItem[]>,
    enable: ComputedRef<boolean>
  ) => {
    if (!enable.value) throw new Error(level + ' disabled')
    const model = getLevelModel(getParentLevel(level)!)
    if (!model) throw new Error(level + ' model empty')
    state.value[level].list = await listGetter(model)
  }
  const setModelSteps = LEVEL_KEYS.map((level) => (ctx: StepContext) => setLevelModel(level, ctx))
  const loadListSteps = [
    async () => await setLevelList(CITY, getCities, hasCity),
    async () => await setLevelList(AREA, getAreas, hasArea)
  ]

  const stepRunner = async (startLevel: RegionLevel, ctx: StepContext) => {
    loading.value = true
    resetRegion(startLevel)
    try {
      const startIndex = getLevelIndex(startLevel)
      const levels = LEVEL_KEYS.slice(startIndex)
      for (let index = 0; index < levels.length; index++) {
        setModelSteps.at(startIndex + index)!(ctx)
        await loadListSteps.at(startIndex + index)?.()
      }
    } catch {}
    loading.value = false
  }

  const setRegion = (values: RegionValues) => {
    const options = { values, modelValueChange: true }
    return stepRunner(PROVINCE, options)
  }
  const setRegionLevel = (level: RegionLevel, values: RegionValues) => {
    return stepRunner(level, { values })
  }

  return {
    state,
    hasCity,
    hasArea,
    hasTown,
    loading,
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
