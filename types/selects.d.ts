import { AllowedComponentProps, ComponentCustomProps, VNodeProps } from 'vue'
import { CommonProps, CommonEmits } from './component'

/**
 * 级联下拉列表模式
 */
interface Props extends CommonProps {
  /**
   * 未选择时显示 `请选择` 的提示文本
   * @default true
   */
  blank?: boolean
  /**
   * 禁用组件
   * @default false
   */
  disabled?: boolean
}

declare interface RegionSelects {
  new (): {
    $props: AllowedComponentProps & ComponentCustomProps & VNodeProps & Props,
    $emit: CommonEmits
  }
}

export const RegionSelects: RegionSelects
