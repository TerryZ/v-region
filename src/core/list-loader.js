import { regionCities, regionAreas } from '../formatted'

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
