import { computed } from 'vue'

import languages, { CN } from '../language'
import { LEVEL_KEYS } from '../constants'
import { modelToValue } from './parse'

export function createLevel (list = []) {
  return {
    key: undefined,
    name: undefined,
    list
  }
}
/**
 * Get language resource by language code
 * @param {string} code - language code
 * @returns {object} language resource
 */
export function getLanguage (lang = CN) {
  const key = String(lang).toLowerCase()

  if (key in languages) return languages[key]

  return languages[CN]
}
/**
 * 获得指定行政级别的下级项目
 * @param {string} level 指定行政级别，空内容则获得所有级别
 * @returns {string[]}
 */
export function getLowerLevels (level) {
  if (!level) return LEVEL_KEYS

  const index = LEVEL_KEYS.findIndex(val => val === level)
  return LEVEL_KEYS.filter((val, idx) => idx > index)
}
export function getRegionText (region, separator = '') {
  if (!region || !Object.keys(region).length) return ''
  return Object.values(region)
    .map(val => val.name)
    .filter(val => val)
    .join(separator)
}
export function getModelText (region, separator = '') {
  if (!region || !Object.keys(region).length) return ''
  return Object.values(region)
    .filter(val => val)
    .map(val => val.value)
    .join(separator)
}
export function valueEqual (values1, values2) {
  return Object.keys(values1).every(key => values1[key] === values2[key])
}
export function valueEqualToModel (values, model) {
  if (!values) return false
  return valueEqual(values, modelToValue(model))
}
export function isEmptyValues (values) {
  return Object.keys(values).every(key => !values[key])
}
/**
 * 获得组件配置的有效区域级别列表
 *
 * @param {object} props
 * @param {boolean} fullLevels
 */
export function getAvailableLevels (props, fullLevels) {
  const levels = [props.city, props.area, props.town && fullLevels]

  const unavailableLevelIndex = levels.findIndex(val => !val)
  if (unavailableLevelIndex === -1) return LEVEL_KEYS
  return LEVEL_KEYS.filter((val, idx) => idx <= unavailableLevelIndex)
}
/**
 * 级别编码有效性校验，防止在中间级别出现空值
 * @param {object} modelValue
 */
export function getAvailableValues (modelValue) {
  const { province, city, area, town } = modelValue
  const levelValues = [province, city, area, town]
  const unavailableLevelIndex = levelValues.findIndex(val => !val)
  if (unavailableLevelIndex === -1) return modelValue
  return Object.fromEntries(
    LEVEL_KEYS.map((key, index) => [key, (
      index <= unavailableLevelIndex ? modelValue[key] : undefined
    )])
  )
}
export function isPromise (p) {
  return p && Object.prototype.toString.call(p) === '[object Promise]'
}
export function useState (props) {
  return {
    hasCity: computed(() => props.city),
    hasArea: computed(() => props.city && props.area),
    hasTown: computed(() => props.city && props.area && props.town)
  }
}
export function isSelected (item, selectedItems) {
  if (!item || !selectedItems.length) return false
  return selectedItems.some(val => val.key === item.key)
}
/**
 * 检查初始化数据是否与当前选中数据相同
 *
 * @param {string[]} keys - 选中城市的键值列表
 * @param {{ key: string, value: string }[]} cities - 选中城市的模型列表
 * @returns {boolean}
 */
export function keysEqualModels (keys, models) {
  if (keys.length === models.length) {
    // 均为空数组
    if (!keys.length) return true
    return models.every(val => keys.includes(val.key))
  } else {
    return false
  }
}
export function inputFocus (input) {
  if (!input) return
  input.focus({ preventScroll: true })
}
export function scrollIntoElement (container, active) {
  if (!container) return

  const activeEl = typeof active === 'string'
    ? container.querySelector(active)
    : active
  if (
    container.scrollHeight <= container.offsetHeight || !activeEl
  ) return
  // 多区域同时滚动时，平滑滚动会导致仅最后一个容器执行滚动行为，不符合功能预期
  activeEl?.scrollIntoView({
    // behavior: 'smooth',
    block: 'nearest',
    inline: 'start'
  })
}
