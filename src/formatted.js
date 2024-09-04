import data from './data/data.json'

// xx0000 为省级编码格式
function isProvince (key) {
  return !(Number(key) % 1e4)
}
// xxxx00 为市级编码格式
function isCity (key) {
  if (!(Number(key) % 100)) {
    return true
  }
  // 后四位数处理
  if (Number(key.substring(2)) > 9000) {
    return true
  }
  return false
}

/**
 * json 数据转换为模型列表
 * 模型格式：{ key: string, value: string }
 */
const list = []
// 省/直辖市模型列表
const provinces = []
// 市模型列表
const cities = []
// 区/县模型列表
const areas = []

Object.entries(data).forEach(val => {
  const [key, value] = val
  const model = { key, value }
  list.push(model)

  if (isProvince(key)) {
    provinces.push(model)
    return
  }
  if (isCity(key)) {
    cities.push(model)
    return
  }
  areas.push(model)
})

export { list as regionFull }
export { provinces as regionProvinces }
export { cities as regionCities }
export { areas as regionAreas }
