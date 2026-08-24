import { defu } from 'defu'

import { regionProvinces, regionCities } from '../formatted'

import type {
  RegionItem,
  RegionValues,
  RegionModel,
  RegionProvinceGroup,
  ModelProperty
} from '../types'

export function listToText(list: string[], separator = '') {
  return Array.isArray(list) ? list.join(separator) : ''
}
export function getEmptyValues(values: RegionValues) {
  const emptyValues = {
    province: undefined,
    city: undefined,
    area: undefined,
    town: undefined
  }
  return defu(values, emptyValues)
}
/**
 * 区域完整数据模型转换为入参数据模型
 * @param model - 内部数据模型
 * @param property - 名称字段名
 * @returns 入参数据模型
 */
export function modelToValue(model: RegionModel, property: ModelProperty): RegionValues {
  if (!model) return {}
  return Object.fromEntries(Object.entries(model).map(([key, value]) => [key, value?.[property]]))
}
/**
 * 将模型列表转换为名称文本，使用分隔符连接(city-picker)
 * @param models 模型列表
 * @param property 名称字段名
 * @returns
 */
export function modelsToValues(models: RegionItem[], property: ModelProperty): string[] {
  return Array.isArray(models) ? models.map((val) => val[property]!) : []
}
/**
 * 内部数据模型或输出数据模型转换为属性内容列表
 * @param model 数据模型
 * @returns
 */
export function modelToValues(model: RegionModel, property: ModelProperty | 'name'): string[] {
  if (!model || !Object.keys(model).length) return []
  return Object.values(model)
    .map((val) => val?.[property])
    .filter((val) => val)
}
/**
 * 内部数据模型或输出数据模型转换为名称文本，使用分隔符连接
 * @param {RegionModel | InternalModel} model 数据模型
 * @returns
 */
export function modelToText(model: RegionModel, property: ModelProperty, separator = ''): string {
  return listToText(modelToValues(model, property), separator)
}
/**
 * 组织城市选择器的城市目录清单，使用省份进行分组
 */
export function cityDirectory(): RegionProvinceGroup[] {
  // 北京, 天津, 上海, 重庆
  const municipalities = ['110000', '120000', '310000', '500000']
  // 虚拟分组-直辖市
  const municipality = '000000'
  // 香港, 澳门
  const specials = ['810000', '820000']
  // 虚拟分组-特别行政区
  const special = '000010'
  // 普通省份
  const regularProvinces: RegionProvinceGroup[] = []
  const municipalityProvince: RegionProvinceGroup = {
    province: { key: municipality, value: '直辖市' },
    cities: []
  }
  const specialProvince: RegionProvinceGroup = {
    province: { key: special, value: '特别行政区' },
    cities: []
  }
  const regularProvinceMap = new Map<string, RegionProvinceGroup>()
  // 省份
  regionProvinces.forEach((val) => {
    if (municipalities.includes(val.key!)) municipalityProvince.cities.push(val)
    else if (specials.includes(val.key!)) specialProvince.cities.push(val)
    else {
      // 常规省份
      const group = { province: val, cities: [] }
      regularProvinces.push(group)
      // 以前两位省份编码为键值
      regularProvinceMap.set(val.key!.substring(0, 2), group)
    }
  })
  //
  // regularProvinces.forEach((val) => {
  //   val.cities = regionCities.filter((value) => {
  //     const provinceCode = Number(val.province.key)
  //     const cityCode = Number(value.key)
  //     return cityCode - provinceCode < 1e4 && cityCode % provinceCode < 1e4
  //   })
  // })

  for (let index = 0; index < regionCities.length; index++) {
    const city = regionCities[index]
    const provinceCode = city?.key?.substring(0, 2)
    regularProvinceMap.get(provinceCode!)?.cities.push(city!)
  }

  return [municipalityProvince, ...regularProvinces, specialProvince]
}
