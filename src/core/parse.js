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
