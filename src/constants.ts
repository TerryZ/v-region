export const PROVINCE = 'province'
export const CITY = 'city'
export const AREA = 'area'
export const TOWN = 'town'

export const LEVELS = [
  { index: 0, level: PROVINCE, title: '省/直辖市' },
  { index: 1, level: CITY, title: '市' },
  { index: 2, level: AREA, title: '区/县' },
  { index: 3, level: TOWN, title: '乡/镇/街道' }
]

export const LEVEL_KEYS = [PROVINCE, CITY, AREA, TOWN]
// city-picker 多语言占位符
export const PLACEHOLDER_OTHER_CITIES = '#others-number#'
// 数据核心模块提供的依赖注入
export const keyCore = Symbol('core')
// 根级组件提供的依赖注入
export const keyInternal = Symbol('base')
// dropdown 相关的依赖注入
export const keyDropdown = Symbol('dropdown')
