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

  const code = Number(province.key)
  const list = regionCities.filter((val) => {
    const current = Number(val.key)
    return current - code < 1e4 && current % code < 1e4
  })
  // 城市/直辖市
  return list.length ? list : [province]
}
/**
 * 根据城市读取区/县列表
 *
 * @param cityItem - 城市
 * @returns 区/县列表
 */
export function getAreas(cityItem?: RegionItem): RegionItem[] {
  if (!cityItem) return []

  const city = Number(cityItem.key)
  // 城市是否为直辖市/特别行政区
  const isNotProvince = city % 1e4
  const calcNum = isNotProvince ? 100 : 1e4
  const list = regionAreas.filter((val) => {
    const areaCode = Number(val.key)
    return areaCode - city < calcNum && areaCode % city < calcNum
  })
  // 区县/地级市
  return list.length ? list : [cityItem]
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
