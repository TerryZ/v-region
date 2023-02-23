import { regionFull, regionCities, regionAreas } from '../formatted'
import {
  LEVEL_KEYS,
  PROVINCE_KEY,
  CITY_LEVEL, AREA_LEVEL, TOWN_LEVEL
} from '../constants'
import languages, { CN } from '../language'

// xx0000 为省级编码格式
export function isProvince (key) {
  return !(window.Number(key) % 1e4)
}
// xxxx00 为市级编码格式
export function isCity (key) {
  if (!(window.Number(key) % 100)) {
    return true
  }
  // 后四位数处理
  if (window.Number(key.substring(2)) > 9000) {
    return true
  }
  return false
}

/**
 * 根据省读取城市列表
 *
 * @param {object} province - 省
 * @returns {object[]} - 城市列表
 */
export function getCities (province) {
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
export function getAreas (city) {
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

// function townDataPath (areaKey) {
//   return `../town/${areaKey}.json`
// }

/**
 * 根据区/县数据读取乡/镇列表
 *
 * @param {object} area - 区/县
 * @returns {object[]} 乡/镇列表
 */
export async function getTowns (area) {
  if (!area || !Object.keys(area).length) return []

  try {
    // const { default: data } = await import(townDataPath(area.key))
    const { default: data } = await import(`../town/${area.key}.json`)
    // console.log(towns)
    if (!data || typeof data !== 'object') {
      return []
    }

    return Object
      .entries(data)
      .map(([key, value]) => ({ key, value }))
  } catch (e) {
    console.warn(`The "${area.value}" area have no towns data.`)
    return []
  }
}

/**
 * Get level list loader
 *
 * @export
 * @param {number} level
 * @returns
 */
export function getLoader (level) {
  switch (level) {
    case CITY_LEVEL: return getCities
    case AREA_LEVEL: return getAreas
    case TOWN_LEVEL: return getTowns
  }
}

/**
 * 获得指定行政级别的下级项目
 * @param {string} level 指定行政级别，空内容则获得所有级别
 * @returns {string[]}
 */
export function getLevels (level) {
  if (!level) return LEVEL_KEYS

  const index = LEVEL_KEYS.findIndex(val => val === level)
  return LEVEL_KEYS.filter((val, idx) => idx > index)
}

/**
 * Get available region levels
 *
 * @param {object} props
 */
export function availableLevels (props) {
  const result = [PROVINCE_KEY]
  const levels = [props.city, props.area, props.town]

  for (let i = 0; i < levels.length; i++) {
    if (levels[i]) {
      result.push(LEVEL_KEYS[i + 1])
    } else {
      return result
    }
  }
  return result
}

/**
 * 校验输入数据模型格式有效性
 *
 * @param {object} model - 数据模型
 * @returns {boolean} 检查结果
 */
export function validModel (model) {
  if (
    model &&
    Object.keys(model).length &&
    LEVEL_KEYS.every(val => val in model)
  ) {
    return true
  } else {
    console.error('Incorrect data format for "value/v-model" of v-region')
    return false
  }
}

/**
 * 根据 key 获得模型数据
 *
 * @param {string} key
 * @returns {object} 模型数据
 */
export const getDetail = key => {
  return regionFull.find(val => val.key === key)
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

export function isSelected (item, selectedItems) {
  if (!item || !selectedItems.length) return false
  return selectedItems.some(val => val.key === item.key)
}

export function isChrome () {
  return navigator.vendor !== undefined && navigator.vendor.indexOf('Google') !== -1
}

export function isEdge () {
  return navigator.userAgent.indexOf('Edge') >= 0
}

export function inputFocus (input) {
  if (!input) return
  /**
   * fixed the page will scroll to top when open drop down list and set input focus
   * that.$refs.search.focus({preventScroll:true})
   * only work on Chrome and EDGE
   */
  if (isChrome() || isEdge()) {
    input.value.focus({ preventScroll: true })
  } else {
    const x = window.pageXOffset
    const y = window.pageYOffset
    input.value.focus()
    if (window.pageYOffset !== y) {
      setTimeout(() => { window.scrollTo(x, y) }, 0)
    }
  }
}

export function useLanguage (lang) {
  if (!lang) return languages[CN]

  const key = String(lang).toLowerCase()

  if (key in languages) return languages[key]

  return languages[CN]
}

export function useState (props) {
  return {
    haveCity: props.city,
    haveArea: props.city && props.area,
    haveTown: props.city && props.area && props.town
  }
}
