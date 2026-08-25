import languages, { CN } from '../language'
import { modelToValue } from './parse'
import { LEVEL_KEYS } from '../constants'

import type {
  RegionLanguages,
  RegionLanguage,
  RegionItem,
  RegionValues,
  RegionLevel
} from '../types'

export const getLevelIndex = (level: RegionLevel) => LEVEL_KEYS.indexOf(level)
// export function getLevels(startLevel: RegionLevel) {
//   const startIndex = getLevelIndex(startLevel)
//   return LEVEL_KEYS.slice(startIndex)
// }
export function getParentLevel(level: RegionLevel) {
  const startIndex = getLevelIndex(level)
  const parentIndex = startIndex === 0 ? 0 : startIndex - 1
  return LEVEL_KEYS.at(parentIndex)
}
/**
 * Get language resource by language code
 * @param code - language code
 * @returns {object} language resource
 */
export function getLanguage(lang?: RegionLanguages): RegionLanguage {
  const key = String(lang).toLowerCase() || CN
  return languages[key in languages ? key : CN]!
}
export function valueEqual(values1: RegionValues, values2: RegionValues) {
  const keys = Object.keys(values1) as Array<keyof RegionValues>
  return keys.every((key) => values1[key] === values2[key])
}
export function valueEqualToModel(values: RegionValues, model: Record<string, unknown>) {
  if (!values) return false
  return valueEqual(modelToValue(model, 'key'), values)
}
export function isEmptyValues(values: RegionValues) {
  return Object.keys(values).every((key) => !values[key as RegionLevel])
}
// export function isPromise(p) {
//   return p && Object.prototype.toString.call(p) === '[object Promise]'
// }
export function isSelected(item: RegionItem, selectedItems: RegionItem[]) {
  if (!item || !selectedItems.length) return false
  return selectedItems.some((val) => val.key === item.key)
}
/**
 * 检查初始化数据是否与当前选中数据相同(city-picker)
 *
 * @param keys - 选中城市的键值列表
 * @param cities - 选中城市的模型列表
 * @returns
 */
export function keysEqualModels(keys: string[], models: RegionItem[]): boolean {
  if (keys.length === models.length) {
    // 均为空数组
    if (!keys.length) return true
    return models.every((val) => keys.includes(val.key!))
  }
  return false
}
export function inputFocus(input: HTMLInputElement) {
  if (!input) return
  input.focus({ preventScroll: true })
}
export function scrollIntoElement(container: HTMLDivElement, active: string) {
  if (!container) return

  const activeEl = typeof active === 'string' ? container.querySelector(active) : active
  if (container.scrollHeight <= container.offsetHeight || !activeEl) return
  // 多区域同时滚动时，平滑滚动会导致仅最后一个容器执行滚动行为，不符合功能预期
  activeEl?.scrollIntoView({
    // behavior: 'smooth',
    block: 'nearest',
    inline: 'start'
  })
}
