export const KEY_PROVINCE = 'province'
export const KEY_CITY = 'city'
export const KEY_AREA = 'area'
export const KEY_TOWN = 'town'

export const LEVELS = [
  { index: 0, key: KEY_PROVINCE, title: '省/直辖市' },
  { index: 1, key: KEY_CITY, title: '市' },
  { index: 2, key: KEY_AREA, title: '区/县' },
  { index: 3, key: KEY_TOWN, title: '乡/镇/街道' }
]

export const LEVEL_KEYS = [KEY_PROVINCE, KEY_CITY, KEY_AREA, KEY_TOWN]
// city-picker 多语言占位符
export const PLACEHOLDER_OTHER_CITIES = '#others-number#'
// 数据核心模块提供的依赖注入
export const injectKeyCore = Symbol('core')
// 根级组件提供的依赖注入
export const injectKeyBase = Symbol('base')
// dropdown 相关的依赖注入
export const injectDropdown = Symbol('dropdown')
