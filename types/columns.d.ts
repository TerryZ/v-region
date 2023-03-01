import { DefineComponent, ComputedOptions } from 'vue'
import { CommonProps, CommonMethods } from './component'

/**
 * 多列竖排模式核心模块
 */
interface Props extends CommonProps {
  /** 下拉栏调整位置事件 */
  onAdjust?: () => void
  /** 选择完成 */
  onComplete?: () => void
}
export const RegionColumnsCore: DefineComponent<
  Props,
  {},
  {},
  ComputedOptions,
  CommonMethods
>

interface ColumnsProps extends CommonProps {
  /** 禁用 */
  disabled?: boolean
  /** 选择完成 */
  onComplete: () => void
  /** 下拉层显示状态 */
  'onVisibleChange'?: (visible: boolean) => void
}
/**
 * 多列竖排模式选择器
 */
export const RegionColumns: DefineComponent<
  ColumnsProps,
  {},
  {},
  ComputedOptions,
  CommonMethods
>
