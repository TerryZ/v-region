export const PROVINCE_KEY = 'province'
export const CITY_KEY = 'city'
export const AREA_KEY = 'area'
export const TOWN_KEY = 'town'

export const LEVELS = [
  { index: 0, key: PROVINCE_KEY, title: '省/直辖市' },
  { index: 1, key: CITY_KEY, title: '市' },
  { index: 2, key: AREA_KEY, title: '区/县' },
  { index: 3, key: TOWN_KEY, title: '乡/镇/街道' }
]

export const LEVEL_KEYS = [PROVINCE_KEY, CITY_KEY, AREA_KEY, TOWN_KEY]
// city-picker 多语言占位符
export const PLACEHOLDER_OTHER_CITIES = '#others-number#'

export const injectKeyBase = Symbol('base')
export const injectKeySelector = Symbol('selector')
