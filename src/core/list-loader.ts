import { regionCities, regionAreas } from '../formatted'

/**
 * 根据省读取城市列表
 *
 * @param {object} province - 省
 * @returns {object[]} - 城市列表
 */
export function getCities (province) {
  if (!province || !Object.keys(province).length) return []

  const code = Number.parseInt(province.key)
  const list = regionCities.filter(val => {
    const current = Number.parseInt(val.key)
    return (current - code) < 1e4 && (current % code) < 1e4
  })
  // 城市/直辖市
  return list.length ? list : [province]
}
/**
 * 根据城市读取区/县列表
 *
 * @param {string} cityKey - 城市
 * @returns {object[]} 区/县列表
 */
export function getAreas (cityKey) {
  if (!cityKey) return []

  const city = Number.parseInt(cityKey.key)
  const isNotProvince = city % 1e4
  const calcNum = isNotProvince ? 100 : 1e4
  const list = regionAreas.filter(val => (
    (val.key - city) < calcNum && val.key % city < calcNum
  ))
  // 区县/地级市
  return list.length ? list : [cityKey]
}
/**
 * 根据区/县数据读取乡/镇列表
 *
 * @param {object} area - 区/县
 * @returns {Promise<object[]>} 乡/镇列表
 */
export function getTowns (area) {
  if (!area || !Object.keys(area).length) return Promise.resolve([])

  return import(`../data/town/${area.key}.json`)
    .then(resp => {
      const data = resp.default
      const list = !data || typeof data !== 'object'
        ? []
        : Object.entries(data).map(([key, value]) => ({ key, value }))
      return list
    })
    .catch(() => {})
}
