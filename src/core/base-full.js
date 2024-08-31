import { ref, computed, watch } from 'vue'
import { TOWN_KEY } from '../constants'
import { getTowns, useState } from '../utils/helper'
import { useRegion } from './base'

export function useFullRegion (props, emit) {
  const { hasTown } = useState(props)
  const {
    data,
    provinces,
    cities,
    areas,
    isComplete,
    regionText,
    reset,
    setData,
    setLevel,
    getData,
    getLevelList
  } = useRegion(props, emit)
  const towns = ref([])
  // const isFullyComplete = computed(() => {
  //   if (!hasTown.value && isComplete.value) return true
  //   return Boolean(data.town)
  // })

  watch(() => data.area, val => {
    getTowns(val).then(resp => { towns.value = resp })
  })

  function getFullyLevelList (level) {
    if (level === TOWN_KEY) return towns
    return getLevelList(level)
  }

  return {
    data,
    provinces,
    cities,
    areas,
    towns,
    regionText,
    isComplete,

    reset,
    setData,
    setLevel,
    getData,
    getLevelList: getFullyLevelList
  }
}
