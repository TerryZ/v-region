import {
  LEVEL_KEYS,
  PROVINCE_KEY, CITY_KEY, AREA_KEY, TOWN_KEY
} from '../constants'
import { getDetail, getTowns } from './helper'
import { regionProvinces, regionCities } from '../formatted'

/**
 * 入参数据模型转换为完整数据
 *
 * 入参数据模型格式:
 * {
 *   province: 'province-key',
 *   city: 'city-key',
 *   area: 'area-key',
 *   town: 'town-key'
 * }
 *
 * 原始数据模型格式:
 * {
 *   province: { key: string, value: string },
 *   city: { key: string, value: string },
 *   area: { key: string, value: string },
 *   town: { key: string, value: string }
 * }
 *
 * @param {object} model - 入参数据模型
 * @param {string[]} levels - 有效区域级别列表
 *
 * @returns {object} 区域原始数据模型
 */
export async function modelToRegion (model, levels = LEVEL_KEYS) {
  const { province, city, area, town } = model
  const region = {
    [PROVINCE_KEY]: undefined,
    [CITY_KEY]: undefined,
    [AREA_KEY]: undefined,
    [TOWN_KEY]: undefined
  }
  const inLevel = key => levels.includes(key)

  if (!province) return region
  region[PROVINCE_KEY] = getDetail(province)

  if (!city || !inLevel(CITY_KEY) || !region[PROVINCE_KEY]) return region
  region[CITY_KEY] = getDetail(city)

  if (!area || !inLevel(AREA_KEY) || !region[CITY_KEY]) return region
  region[AREA_KEY] = getDetail(area)

  if (!town || !inLevel(TOWN_KEY) || !region[AREA_KEY]) return region
  region[TOWN_KEY] = await getTownModel(region[AREA_KEY], town)

  return region
}

async function getTownModel (areaModel, townKey) {
  // 获得区/县的下级乡镇/街道列表
  const towns = await getTowns(areaModel)
  // console.log(towns)
  if (!towns.length) return

  return towns.find(val => val.key === townKey)
}

/**
 * 区域完整数据模型转换为入参数据模型
 * @param {object} region - 原始数据模型
 * @returns {object} 入参数据模型
 */
export function regionToModel (region) {
  if (!region) return {}
  return Object.fromEntries(
    Object
      .entries(region)
      .map(([key, value]) => [key, value && value.key])
  )
}

/**
 * 入参数据模型转换为完整数据
 *
 * 原始数据模型格式:
 * {
 *   province: { key: string, value: string },
 *   city: { key: string, value: string },
 *   area: { key: string, value: string },
 *   town: { key: string, value: string }
 * }
 *
 * @param {object} region - 入参数据模型
 * @param {string[]} levels - 有效区域级别列表（排列顺序需按照行政级别）
 *
 * @returns {object} 区域原始数据模型
 */
export function regionToText (region, levels = LEVEL_KEYS) {
  return levels
    .map(val => region[val] && region[val].value)
    .filter(val => val)
}

/**
 * 组织城市选择器的城市目录清单，使用省份进行分组
 */
export function cityDirectory () {
  // 北京, 天津, 上海, 重庆
  const municipalities = ['110000', '120000', '310000', '500000']
  const municipality = '000000'
  // 香港, 澳门
  const specials = ['810000', '820000']
  const special = '000010'
  const listTmp = []
  const municipalityObj = {
    province: { key: municipality, value: '直辖市' },
    cities: []
  }
  const specialObj = {
    province: { key: special, value: '特别行政区' },
    cities: []
  }
  // set provinces
  regionProvinces.forEach(val => {
    if (municipalities.includes(val.key)) municipalityObj.cities.push(val)
    else if (specials.includes(val.key)) specialObj.cities.push(val)
    else listTmp.push({ province: val, cities: [] })
  })
  listTmp.forEach(val => {
    val.cities = regionCities.filter(value => {
      const num = Number.parseInt(val.province.key)
      return (value.key - num) < 1e4 && (value.key % num) < 1e4
    })
  })
  return [
    ...[municipalityObj],
    ...listTmp,
    ...[specialObj]
  ]
}
