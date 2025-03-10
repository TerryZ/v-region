import { regionProvinces, regionCities } from '../formatted'

/**
 * @import {
 *   InternalModel,
 *   RegionValues,
 *   RegionModel,
 *   RegionItem
 * } from '../../types/component'
 */

export function listToText (list, separator = '') {
  return Array.isArray(list) ? list.join(separator) : ''
}
/**
 * 区域完整数据模型转换为入参数据模型
 * @param {InternalModel} model - 内部数据模型
 * @param {string} property - 名称字段名
 * @returns {RegionValues} 入参数据模型
 */
export function modelToValue (model, property) {
  if (!model) return {}
  return Object.fromEntries(
    Object.entries(model).map(([key, value]) => [key, value && value[property]])
  )
}
/**
 * 将模型列表转换为名称文本，使用分隔符连接
 * @param {RegionItem[]} models 模型列表
 * @param {string} property 名称字段名
 * @returns {string[]}
 */
export function modelsToValues (models, property) {
  return Array.isArray(models) ? models.map(val => val[property]) : []
}
/**
 * 内部数据模型或输出数据模型转换为属性内容列表
 * @param {RegionModel | InternalModel} model 数据模型
 * @returns {string[]}
 */
export function modelToValues (model, property) {
  if (!model || !Object.keys(model).length) return []
  return Object.values(model).map(val => val[property]).filter(val => val)
}
/**
 * 内部数据模型或输出数据模型转换为名称文本，使用分隔符连接
 * @param {RegionModel | InternalModel} model 数据模型
 * @returns {string}
 */
export function modelToText (model, separator = '') {
  return listToText(modelToValues(model, 'value'), separator)
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
