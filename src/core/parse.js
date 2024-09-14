import {
  KEY_PROVINCE, KEY_CITY, KEY_AREA, KEY_TOWN
} from '../constants'
import { regionProvinces, regionCities, regionAreas } from '../formatted'
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
 * @param {object} values - 各级别编码集合（已经过空值校验）
 * @param {string[]} levels - 有效区域级别列表
 *
 * @returns {object} 区域原始数据模型
 */
// TODO: to remove
export function valueToModel (values, levels) {
  const { province, city, area } = values
  const region = {
    [KEY_PROVINCE]: undefined,
    [KEY_CITY]: undefined,
    [KEY_AREA]: undefined,
    [KEY_TOWN]: undefined
  }

  const setLevelModel = (level, key, levelSet) => {
    if (!levels.includes(level)) return
    region[level] = levelSet.find(val => val.key === key)
  }

  setLevelModel(KEY_PROVINCE, province, regionProvinces)
  setLevelModel(KEY_CITY, city, regionCities)
  setLevelModel(KEY_AREA, area, regionAreas)

  return region
}
/**
 * 区域完整数据模型转换为入参数据模型
 * @param {object} model - 原始数据模型
 * @returns {object} 入参数据模型
 */
export function modelToValue (model) {
  if (!model) return {}
  return Object.fromEntries(
    Object.entries(model).map(([key, value]) => [key, value && value.key])
  )
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
