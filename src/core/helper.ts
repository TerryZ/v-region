import languages, { CN } from '../language'
import { modelToValue } from './parse'

/**
 * Get language resource by language code
 * @param {string} code - language code
 * @returns {object} language resource
 */
export function getLanguage (lang) {
  const key = String(lang).toLowerCase()
  return languages[key in languages ? key : CN]
}
export function valueEqual (values1, values2) {
  return Object.keys(values1).every(key => values1[key] === values2[key])
}
export function valueEqualToModel (values, model) {
  if (!values) return false
  return valueEqual(modelToValue(model, 'key'), values)
}
export function isEmptyValues (values) {
  return Object.keys(values).every(key => !values[key])
}
export function isPromise (p) {
  return p && Object.prototype.toString.call(p) === '[object Promise]'
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
  }
  return false
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
