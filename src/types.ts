import type { ComputedRef, Ref } from 'vue'

export type RegionLanguages = 'cn' | 'en'
export type RegionLevel = 'province' | 'city' | 'area' | 'town'
export type ModelProperty = 'key' | 'value'
export type LevelListLoader = (model?: RegionItem) => Promise<RegionItem[]> | RegionItem[]
export type AsyncLevelListLoader = (model?: RegionItem) => Promise<RegionItem[]>
/**
 * 区域元素基本模型
 */
export declare interface RegionItem {
  key?: string
  value?: string
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
  modelValue: RegionValues
  /**
   * 启用城市级别
   * @default true
   */
  city: boolean
  /**
   * 启用区、县级别
   * @default true
   */
  area: boolean
  /**
   * 启用村、镇级别
   * @default false
   */
  town: boolean
  /**
   * 语言
   * @default `cn`
   */
  language: RegionLanguages
  /**
   * 自动选择低级别列表中的第一个项目
   * @default false
   */
  autoSelectFirst: boolean
  /**
   * 禁用组件
   * @default false
   */
  disabled?: boolean
  /**
   * 分隔符
   * @default ''
   */
  separator?: string
  /**
   * 未选择时显示 `请选择` 的提示文本
   * @default true
   */
  blank?: boolean
  /**
   * 标题栏
   * selects: 级别名称
   * column: 顶部标题栏
   */
  header?: boolean
}
export interface LevelModel {
  index: number
  level: RegionLevel
  title: string
}
export interface RegionLevelData {
  key: string | undefined
  name: string | undefined
  list: RegionItem[]
  enable: Ref<boolean> | ComputedRef<boolean>
  getModel: () => RegionItem | undefined
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
export interface DropdownProvide {
  setTriggerText?: (text: string) => void
}
export interface RegionUIOptions {
  afterModelChange?: () => void
}
export interface RegionUIProvide {
  disabled: Ref<boolean>
  state: Ref<Record<RegionLevel, RegionLevelData>>
  loading: Ref<boolean>
  lang: RegionLanguage
  isComplete: () => boolean
  hasCity: ComputedRef<boolean>
  hasArea: ComputedRef<boolean>
  hasTown: ComputedRef<boolean>
  setLevel: (level: RegionLevel, key?: string) => Promise<void>
  setupTownListLoader: (fn: AsyncLevelListLoader) => void
}
/** 更新选中区域的键值 */
export declare type EmitUpdateModelValue = (event: 'update:modelValue', data: RegionValues) => void
/** 更新选择中区域的名称列表 */
export declare type EmitUpdateNames = (event: 'update:names', data: string[]) => void
/** 内容修改后的响应事件 */
export declare type EmitChange = (event: 'change', data: RegionModel) => void
/** 选择完成 */
export declare type EmitComplete = (event: 'complete') => void

export type RegionEmits = EmitUpdateModelValue & EmitUpdateNames & EmitChange

type EmitValidator = (...args: unknown[]) => boolean
export type EmptyEmits = Record<never, never>
export type EmitsOptions = Record<string, EmitValidator>
