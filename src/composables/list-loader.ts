import { regionCities, regionAreas } from '../formatted'
import { townsCache } from './region-core'

import type { RegionItem } from '../types'
// TODO：考虑使用 startWith 来处理匹配
/**
 * 根据省读取城市列表
 *
 * @param province - 省
 * @returns 城市列表
 */
export function getCities(province?: RegionItem): RegionItem[] {
  if (!province || !Object.keys(province).length) return []

  // const code = Number(province.key)
  // const list = regionCities.filter((val) => {
  //   const current = Number(val.key)
  //   return current - code < 1e4 && current % code < 1e4
  // })
  const prefix = province.key!.substring(0, 2)
  const list = regionCities.filter((city) => city.key?.startsWith(prefix))
  // 城市/直辖市
  return list.length ? list : [province]
}
/**
 * 根据城市读取区/县列表
 *
 * @param city - 城市
 * @returns 区/县列表
 */
export function getAreas(city?: RegionItem): RegionItem[] {
  if (!city || !Object.keys(city).length) return []

  // const cityCode = Number(city.key)
  // 城市是否为直辖市/特别行政区
  // const isNotRegular = cityCode % 1e4
  const isNotRegular = city.key?.endsWith('0000')
  // const calcNum = isNotRegular ? 100 : 1e4
  const prefixLength = isNotRegular ? 2 : 4
  const prefix = city.key?.substring(0, prefixLength)
  // const list = regionAreas.filter((val) => {
  //   const areaCode = Number(val.key)
  //   return areaCode - cityCode < calcNum && areaCode % cityCode < calcNum
  // })
  const list = regionAreas.filter((area) => area.key?.startsWith(prefix!))
  // 区县/地级市
  return list.length ? list : [city]
}
/**
 * 根据区/县数据读取乡/镇列表
 *
 * @param area - 区/县
 * @returns 乡/镇列表
 */
export async function getTowns(area?: RegionItem): Promise<RegionItem[]> {
  if (!area || !Object.keys(area).length) return Promise.resolve([])

  if (townsCache.has(area.key!)) {
    return Promise.resolve(townsCache.get(area.key!)!)
  }

  try {
    const resp = await import(`../data/town/${area.key}.json`)
    const data = resp.default

    if (!data || typeof data !== 'object') return []

    const towns = Object.entries(data).map(([key, value]) => ({
      key,
      value
    })) as RegionItem[]
    townsCache.set(area.key!, towns)
    return towns
  } catch {
    return []
  }
}
