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

/**
 * 用户输入模型
 */
export declare interface RegionInputModel {
  /** 省份编码 */
  province?: string
  /** 城市编码 */
  city?: string
  /** 区域编码 */
  area?: string
  /** 村镇编码 */
  town?: string
}

export declare interface ComponentProps extends AllowedComponentProps, ComponentCustomProps, VNodeProps {}

export declare interface BaseProps extends ComponentProps {
  /** 输入区域模型 */
  modelValue?: RegionInputModel
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
   * @default `CN`
   */
  language?: string
}

export declare interface DropdownProps extends BaseProps {
  /**
   * 禁用组件
   * @default false
   */
  disabled?: boolean
}

/** 更新选中区域的键值 */
export declare type EmitUpdateModelValue = (event: "update:modelValue", value: RegionInputModel) => void
/** 内容修改后的响应事件 */
export declare type EmitChange = (event: "change", value: RegionModel) => void
/** 下拉栏调整位置事件 */
export declare type EmitAdjust = (event: 'adjust') => void
/** 选择完成 */
export declare type EmitComplete = (event: 'complete') => void
/** 下拉层显示状态 */
export declare type EmitVisibleChange = (event: 'visible-change', value: boolean) => void

export declare type BaseEmits = EmitUpdateModelValue & EmitChange
export declare type CoreModuleEmits = BaseEmits & EmitAdjust & EmitComplete
export declare type DropdownEmits = BaseEmits & EmitComplete & EmitVisibleChange

export declare interface CommonMethods extends MethodOptions {
  /** 重置数据 */
  reset: () => void
}
