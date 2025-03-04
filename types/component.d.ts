import { MethodOptions } from 'vue'
import { AllowedComponentProps, ComponentCustomProps, VNodeProps } from 'vue'

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
interface InternalLevel {
  key: string
  name: string
  list: RegionItem[]
}
export declare interface InternalModel {
  province: InternalLevel
  city: InternalLevel
  area: InternalLevel
  town: InternalLevel
}
/**
 * 用户输入模型
 */
export declare interface RegionValues {
  /** 省份编码 */
  province?: string
  /** 城市编码 */
  city?: string
  /** 区域编码 */
  area?: string
  /** 村镇编码 */
  town?: string
}
export declare interface RegionTriggerSlotData {
  /**
   * 当前选择的行政区域数据模型
   */
  data?: RegionModel
  /**
   * 当前选择器是否可见
   */
  visible?: boolean
}

export declare interface ComponentProps extends AllowedComponentProps, ComponentCustomProps, VNodeProps {}

export type RegionLanguages = 'cn' | 'en'

export declare interface BaseProps extends ComponentProps {
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
}

export declare interface DropdownProps {
  /**
   * 语言
   * @default `cn`
   */
  language?: RegionLanguages
  /**
   * 禁用组件
   * @default false
   */
  disabled?: boolean
}
export declare interface SelectorProps extends BaseProps, DropdownProps {}

/** 更新选中区域的键值 */
export declare type EmitUpdateModelValue = (event: "update:modelValue", value: RegionValues) => void
/** 更新选择中区域的名称列表 */
export declare type EmitUpdateNames = (event: "update:names", value: string[]) => void
/** 内容修改后的响应事件 */
export declare type EmitChange = (event: "change", value: RegionModel) => void
/** 选择完成 */
export declare type EmitComplete = (event: 'complete') => void
/** 下拉层显示状态 */
export declare type EmitVisibleChange = (event: 'visible-change', value: boolean) => void

export declare type BaseEmits = EmitUpdateModelValue & EmitUpdateNames & EmitChange
export declare type CoreModuleEmits = BaseEmits & EmitComplete
export declare type DropdownEmits = BaseEmits & EmitComplete & EmitVisibleChange
