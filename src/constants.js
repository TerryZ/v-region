/**
 * Plugin types
 */
export const TYPE_LIST = ['text', 'select', 'group', 'column', 'city']
export const [
  TEXT,
  SELECT,
  GROUP,
  COLUMN,
  CITY
] = TYPE_LIST

export const PROVINCE_LEVEL = 0
export const CITY_LEVEL = 1
export const AREA_LEVEL = 2
export const TOWN_LEVEL = 3

export const LEVELS = [
  { index: PROVINCE_LEVEL, title: '省/直辖市' },
  { index: CITY_LEVEL, title: '市' },
  { index: AREA_LEVEL, title: '区/县' },
  { index: TOWN_LEVEL, title: '乡/镇/街道' }
]

export const PROVINCE_KEY = 'province'
export const CITY_KEY = 'city'
export const AREA_KEY = 'area'
export const TOWN_KEY = 'town'

export const LEVEL_LIST = [PROVINCE_KEY, CITY_KEY, AREA_KEY, TOWN_KEY]
// 多语言占位符
export const PLACEHOLDER_OTHER_CITIES = '#others-number#'
