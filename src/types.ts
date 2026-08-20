export type RegionLanguages = 'cn' | 'en'
export type RegionLevel = 'province' | 'city' | 'area' | 'town'
export type ModelProperty = 'key' | 'value'
/**
 * 区域元素基本模型
 */
export declare interface RegionItem {
  key: string
  value: string
}
export declare interface RegionModel {
  /** 省份模型 */
  province?: RegionItem
  /** 城市模型 */
  city?: RegionItem
  /** 区域模型 */
  area?: RegionItem
  /** 村镇模型 */
  town?: RegionItem
}
/**
 * 用户输入模型
 */
export declare interface RegionValues {
  /** 省份编码 */
  province?: string | null | undefined
  /** 城市编码 */
  city?: string | null | undefined
  /** 区域编码 */
  area?: string | null | undefined
  /** 村镇编码 */
  town?: string | null | undefined
}
export interface RegionProps {
  /** 输入区域模型 */
  modelValue?: RegionValues
  /**
   * 启用城市级别
   * @default true
   */
  city?: boolean
  /**
   * 启用区、县级别
   * @default true
   */
  area?: boolean
  /**
   * 启用村、镇级别
   * @default false
   */
  town?: boolean
  /**
   * 语言
   * @default `cn`
   */
  language?: RegionLanguages
  /**
   * 自动选择低级别列表中的第一个项目
   * @default false
   */
  autoSelectFirst?: boolean
}
export interface RegionProvinceGroup {
  province: RegionItem
  cities: RegionItem[]
}
export interface RegionLanguage {
  pleaseSelect: string
  defaultHead: string
  clear: string
  noMatch: string
  others: string
}
