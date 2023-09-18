import { AllowedComponentProps, ComponentCustomProps, VNodeProps } from 'vue'
import { RegionInputModel, ComponentProps } from './component'

interface Props extends ComponentProps{
  /** 输入区域模型 */
  modelValue?: RegionInputModel
  /**
   * 分隔符
   * @default ''
   */
  separator?: string
}

declare interface RegionText {
  new (): {
    $props: Props
  }
}

/**
 * 行政区划内容显示
 */
export const RegionText: RegionText
