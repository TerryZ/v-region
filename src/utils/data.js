import { ref, reactive, computed, toRaw, watch } from 'vue'
import { TOWN_KEY, LEVEL_KEYS } from '../constants'
import { CN } from '../language'
import { regionProvinces } from '../formatted'
import { regionToModel } from './parse'
import { getCities, getAreas, getTowns } from './helper'

export const commonProps = {
  city: { type: Boolean, default: true },
  area: { type: Boolean, default: true },
  town: { type: Boolean, default: false },
  language: { type: String, default: CN },
  modelValue: { type: Object, default: undefined }
}

/**
 * 响应 `v-model` 与 `change` 事件
 *
 * 要求组件中已定义 `update:modelValue` 与 `change`
 * @param {function} emit 事件响应对象
 * @param {object} data 数据
 */
export function dataChange (emit, data) {
  emit('update:modelValue', regionToModel(data))
  emit('change', data)
}

export function useData (props) {
  const data = reactive({
    province: undefined,
    city: undefined,
    area: undefined,
    town: undefined
  })

  const provinces = computed(() => regionProvinces)
  const cities = computed(() => getCities(data.province))
  const areas = computed(() => getAreas(data.city))
  const towns = ref([])

  watch(() => data.area, val => {
    getTowns(val).then(resp => { towns.value = resp })
  })

  /**
   * 清除级别数据
   * @param {string} level 级别编码，传递空内容则清除所有级别数据
   */
  function clearData (level) {
    if (level === TOWN_KEY) return

    const index = LEVEL_KEYS.findIndex(val => val === level)
    const levels = level
      ? LEVEL_KEYS.filter((val, idx) => idx > index)
      : LEVEL_KEYS

    levels.forEach(key => { data[key] = undefined })
  }
  function setData (val) {
    Object.assign(data, val)
  }
  function setLevel (level, val) {
    data[level] = val

    clearData(level)
  }
  function getData () {
    return toRaw(data)
  }

  return {
    data,

    provinces,
    cities,
    areas,
    towns,

    reset: clearData,
    setData,
    setLevel,
    getData
  }
}
