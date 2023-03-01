import { DefineComponent, ComputedOptions } from 'vue'
import { CommonProps, CommonMethods } from './component'
/**
 * 多分组选择器核心模块
 */
interface Props extends CommonProps {
  /** 下拉栏调整位置事件 */
  onAdjust?: () => void
  /** 选择完成 */
  onComplete?: () => void
}
export const RegionGroupCore: DefineComponent<
  Props,
  {},
  {},
  ComputedOptions,
  CommonMethods
>

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
export const RegionGroup: DefineComponent<
  GroupProps,
  {},
  {},
  ComputedOptions,
  CommonMethods
>
