import { regionCities, regionAreas } from '../formatted'

import type { RegionItem } from '../types'

/**
 * 根据省读取城市列表
 *
 * @param province - 省
 * @returns 城市列表
 */
export function getCities(province: RegionItem): RegionItem[] {
  if (!province || !Object.keys(province).length) return []

  const code = Number.parseInt(province.key)
  const list = regionCities.filter((val) => {
    const current = Number.parseInt(val.key)
    return current - code < 1e4 && current % code < 1e4
  })
  // 城市/直辖市
  return list.length ? list : [province]
}
/**
 * 根据城市读取区/县列表
 *
 * @param cityKey - 城市
 * @returns 区/县列表
 */
export function getAreas(cityKey: RegionItem): RegionItem[] {
  if (!cityKey) return []

  const city = Number.parseInt(cityKey.key)
  const isNotProvince = city % 1e4
  const calcNum = isNotProvince ? 100 : 1e4
  const list = regionAreas.filter((val) => {
    const areaCode = Number(val.key)
    return areaCode - city < calcNum && areaCode % city < calcNum
  })
  // 区县/地级市
  return list.length ? list : [cityKey]
}
/**
 * 根据区/县数据读取乡/镇列表
 *
 * @param area - 区/县
 * @returns 乡/镇列表
 */
export async function getTowns(area: RegionItem): Promise<RegionItem[]> {
  if (!area || !Object.keys(area).length) return Promise.resolve([])

  try {
    const resp = await import(`../data/town/${area.key}.json`)
    const data = resp.default

    if (!data || typeof data !== 'object') {
      return []
    }

    return Object.entries(data).map(([key, value]) => ({
      key,
      value
    })) as RegionItem[]
  } catch {
    return []
  }
}
