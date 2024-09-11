import { computed } from 'vue'

import languages, { CN } from '../language'
import { LEVEL_KEYS, KEY_PROVINCE, KEY_CITY, KEY_AREA, KEY_TOWN } from '../constants'
import { regionProvinces, regionCities, regionAreas } from '../formatted'
import { modelToValue } from './parse'

export function createLevel (list = []) {
  return {
    key: undefined,
    name: undefined,
    parentKey: undefined,
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
export function valueEqual (values1, values2) {
  return Object.keys(values1).every(key => values1[key] === values2[key])
}
export function valueEqualToModel (values, model) {
  if (!values) return false
  return valueEqual(values, modelToValue(model))
}
/**
 * 获得组件配置的有效区域级别列表
 *
 * @param {object} props
 */
// TODO: unit-test
export function getAvailableLevels (props) {
  const levels = [props.city, props.area, props.town]

  const unavailableLevelIndex = levels.findIndex(val => !val)
  if (unavailableLevelIndex === -1) return LEVEL_KEYS
  return LEVEL_KEYS.filter((val, idx) => idx <= unavailableLevelIndex)
}
/**
 * 级别编码有效性校验，防止在中间级别出现空值
 * @param {object} modelValue
 */
// TODO: unit-test
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
/**
 * 编码数据有效性校验，防止出现编码与级别不匹配
 * 仅检查省、市、区三级数据，由于数据量缘故，不检查县区数据
 *
 * @param {object} modelValue
 */
// TODO: unit-test
export function validityValues (modelValue) {
  const { province, city, area, town } = modelValue
  const value = {
    [KEY_PROVINCE]: undefined,
    [KEY_CITY]: undefined,
    [KEY_AREA]: undefined,
    [KEY_TOWN]: undefined
  }
  const levelInvalid = (level, val, levelSet) => {
    if (!val || !Object.hasOwn(levelSet, val)) return true
    console.warn('Incorrect values provided to v-region v-model')
    value[level] = val
    return false
  }

  if (levelInvalid(KEY_PROVINCE, province, regionProvinces)) return value
  if (levelInvalid(KEY_CITY, city, regionCities)) return value
  if (levelInvalid(KEY_AREA, area, regionAreas)) return value
  value[KEY_TOWN] = town
  return value
}
export function getNextLevel (level) {
  const index = LEVEL_KEYS.findIndex(val => val === level)
  return LEVEL_KEYS.at(index + 1)
}
/**
 * 根据省读取城市列表
 *
 * @param {object} province - 省
 * @returns {object[]} - 城市列表
 */
export async function getCities (province) {
  if (!province || !Object.keys(province).length) return []

  const list = regionCities.filter(val => {
    const num = Number.parseInt(province.key)
    return (val.key - num) < 1e4 && (val.key % num) < 1e4
  })
  // Municipalities directly under the central government
  return list.length ? list : [province]
}

/**
 * 根据城市读取区/县列表
 *
 * @param {object} city - 城市
 * @returns {object[]} 区/县列表
 */
export async function getAreas (city) {
  if (!city || !Object.keys(city).length) return []

  const cityKey = Number.parseInt(city.key)
  const isNotProvince = cityKey % 1e4
  const calcNum = isNotProvince ? 100 : 1e4
  const list = regionAreas.filter(val => {
    return (val.key - cityKey) < calcNum && val.key % cityKey < calcNum
  })
  // Prefecture-level city
  return list.length ? list : [city]
}
/**
 * 根据区/县数据读取乡/镇列表
 *
 * @param {object} area - 区/县
 * @returns {object[]} 乡/镇列表
 */
export async function getTowns (area) {
  if (!area || !Object.keys(area).length) return []

  try {
    const { default: data } = await import(`../data/town/${area.key}.json`)
    // console.log(towns)
    if (!data || typeof data !== 'object') {
      return []
    }
    return Object.entries(data).map(([key, value]) => ({ key, value }))
  } catch (e) {
    console.warn(`The "${area.value}" area have no towns data.`)
    return []
  }
}
// TODO: to remove
export async function getTownModel (areaModel, townKey) {
  // 获得区/县的下级乡镇/街道列表，再从列表中获得目标节点
  const towns = await getTowns(areaModel)
  return towns.find(val => val.key === townKey)
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
