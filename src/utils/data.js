import { ref, reactive, computed, toRaw, watch, onBeforeMount } from 'vue'
import { KEY_PROVINCE, KEY_CITY, KEY_AREA, KEY_TOWN } from '../constants'
import { CN } from '../language'
import { regionProvinces } from '../formatted'
import { regionToModel, valueToModel } from './parse'
import {
  getCities, getAreas, getTowns,
  availableLevels, getLevels, useState
} from './helper'

export const commonProps = {
  city: { type: Boolean, default: true },
  area: { type: Boolean, default: true },
  town: { type: Boolean, default: false },
  language: { type: String, default: CN },
  modelValue: { type: Object, default: undefined }
}

export const dropdownProps = {
  language: { type: String, default: CN },
  disabled: { type: Boolean, default: false },
  /** 为触发对象添加自定义样式类 */
  customTriggerClass: { type: String, default: '' },
  /** 为下拉容器添加自定义样式类 */
  customContainerClass: { type: String, default: '' }
}

export const commonEmits = ['update:modelValue', 'change']

/**
 * 响应 `v-model` 与 `change` 事件
 *
 * 要求组件中已定义 `update:modelValue` 与 `change`
 * @param {function} emit 事件响应对象
 */
function useEvent (emit) {
  return {
    emitUpdateModelValue: data => emit('update:modelValue', regionToModel(data)),
    emitChange: data => emit('change', data)
  }
}

export function useData (props, emit) {
  const { emitUpdateModelValue, emitChange } = useEvent(emit)
  const { hasCity, hasArea, hasTown } = useState(props)

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
  const isComplete = computed(() => {
    if (!hasCity.value && data.province) return true
    if (!hasArea.value && data.city) return true
    if (!hasTown.value && data.area) return true
    return Boolean(data.town)
  })
  const regionText = computed(() => {
    return Object.values(data)
      .filter(val => val)
      .map(val => val.value)
      .join('')
  })

  watch(() => data.area, val => {
    getTowns(val).then(resp => { towns.value = resp })
  })
  watch(() => props.modelValue, () => modelToData())

  const getData = () => toRaw(data)
  const setData = val => Object.assign(data, val)
  /**
   * 清除级别数据
   * @param {string} level 级别编码，传递空内容则清除所有级别数据
   */
  function clearData (level) {
    if (level === KEY_TOWN) return

    getLevels(level).forEach(key => { data[key] = undefined })
  }
  function reset () {
    clearData()
    emitUpdateModelValue(getData())
    emitChange(getData())
  }
  function setLevel (level, val) {
    data[level] = val

    clearData(level)

    emitUpdateModelValue(getData())
    emitChange(getData())
  }
  function getLevelList (level) {
    switch (level) {
      case KEY_PROVINCE: return provinces
      case KEY_CITY: return cities
      case KEY_AREA: return areas
      case KEY_TOWN: return towns
    }
  }
  function modelToData () {
    if (!props.modelValue || !Object.keys(props.modelValue).length) {
      return
    }
    valueToModel(props.modelValue, availableLevels(props)).then(resp => {
      setData(resp)
      emitChange(getData())
    })
  }

  onBeforeMount(() => modelToData())

  return {
    data,
    provinces,
    cities,
    areas,
    towns,
    reset,
    setData,
    setLevel,
    getData,
    isComplete,
    regionText,
    getLevelList
  }
}
