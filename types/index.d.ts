import { App } from 'vue'
import { RegionItem, RegionInputModel, RegionModel } from './component'
import { RegionText } from './text'
import { RegionCityPicker } from './city'
import { RegionSelects, RegionFullSelects } from './selects'
import { RegionColumnsCore, RegionColumns } from './columns'
import { RegionGroupCore, RegionGroup } from './group'

declare class Region {
  /**
   * 全局安装
   *
   * - v-region-group
   * - v-region-selects
   * - v-region-columns
   * - v-region-city-picker
   * - v-region-text
   *
   * 五个功能模块
   */
  install (app: App): void
}

/** 完整三级行政区划数据模型列表 */
export const regionFull: RegionItem[]
/** 所有省、直辖市、特别行政区模型列表 */
export const regionProvinces: RegionItem[]
/** 城市模型列表 */
export const regionCities: RegionItem[]
/** 区、县模型列表 */
export const regionAreas: RegionItem[]

export {
  RegionItem,
  RegionInputModel,
  RegionModel,
  RegionText,
  RegionCityPicker,
  RegionSelects,
  RegionFullSelects,
  RegionColumnsCore,
  RegionColumns,
  RegionGroupCore,
  RegionGroup
}

export default Region
