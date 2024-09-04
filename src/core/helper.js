import languages, { CN } from '../language'
import { LEVEL_KEYS, KEY_PROVINCE, KEY_CITY, KEY_AREA, KEY_TOWN } from '../constants'
import { regionProvinces, regionCities, regionAreas } from '../formatted'
import { regionToModel } from '../utils/parse'

/**
 * Get language resource by language code
 * @param {string} code - language code
 * @returns {object} language resource
 */
export function getLanguage (lang = CN) {
  const key = String(lang).toLowerCase()

  if (key in languages) return languages[key]

  return languages[CN]
}
export function getRegionText (region, separator = '') {
  if (!region || !Object.keys(region).length) return ''
  return Object.values(region)
    .filter(val => val)
    .map(val => val.value)
    .join(separator)
}
export function valueEqualToModel (values, model) {
  if (!values) return false
  const regionModel = regionToModel(model)
  return Object.keys(regionModel).every(key => values[key] === regionModel[key])
}
/**
 * 获得组件配置的有效区域级别列表
 *
 * @param {object} props
 */
// TODO: unit-test
export function availableLevels (props) {
  const levels = [props.city, props.area, props.town]

  const unavailableLevelIndex = levels.findIndex(val => !val)
  if (unavailableLevelIndex === -1) return LEVEL_KEYS
  return LEVEL_KEYS.filter((val, idx) => idx <= unavailableLevelIndex)
}
/**
 * 级别编码有效性校验，防止在中间级别出现空值
 * @param {object} modelValue
 */
// TODO: unit-test
export function availableValues (modelValue) {
  const { province, city, area, town } = modelValue
  const levelValues = [province, city, area, town]
  const unavailableLevelIndex = levelValues.findIndex(val => !val)
  if (unavailableLevelIndex === -1) return modelValue
  return Object.fromEntries(
    LEVEL_KEYS.map((key, index) => [key, (
      index <= unavailableLevelIndex ? modelValue[key] : undefined
    )])
  )
}
/**
 * 编码数据有效性校验，防止出现编码与级别不匹配
 * 仅检查省、市、区三级数据，由于数据量缘故，不检查县区数据
 *
 * @param {object} modelValue
 */
// TODO: unit-test
export function validityValues (modelValue) {
  const { province, city, area, town } = modelValue
  const value = {
    [KEY_PROVINCE]: undefined,
    [KEY_CITY]: undefined,
    [KEY_AREA]: undefined,
    [KEY_TOWN]: undefined
  }
  const levelInvalid = (level, val, levelSet) => {
    if (!val || !Object.hasOwn(levelSet, val)) return true
    console.warn('Incorrect values provided to v-region v-model')
    value[level] = val
    return false
  }

  if (levelInvalid(KEY_PROVINCE, province, regionProvinces)) return value
  if (levelInvalid(KEY_CITY, city, regionCities)) return value
  if (levelInvalid(KEY_AREA, area, regionAreas)) return value
  value[KEY_TOWN] = town
  return value
}
