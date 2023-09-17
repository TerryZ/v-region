import { AllowedComponentProps, ComponentCustomProps, VNodeProps } from 'vue'
import { CommonProps, CommonEmits, CoreModuleEmits } from './component'

declare interface RegionGroupCore {
  new (): {
    $props: AllowedComponentProps & ComponentCustomProps & VNodeProps & CommonProps
    $emit: CommonEmits & CoreModuleEmits
  }
}
declare interface RegionGroup {
  new (): {
    $props: AllowedComponentProps & ComponentCustomProps & VNodeProps & CommonProps
    $emit: CommonEmits & CoreModuleEmits
  }
}

/**
 * 多分组选择器组件核心模块
 */
export const RegionGroupCore: RegionGroupCore

interface GroupProps extends CommonProps {
  /** 禁用 */
  disabled?: boolean
  /** 选择完成 */
  onComplete: () => void
  /** 下拉层显示状态 */
  'onVisibleChange'?: (visible: boolean) => void
}
/**
 * 多分组选择器组件
 */
export const RegionGroup: RegionGroup
