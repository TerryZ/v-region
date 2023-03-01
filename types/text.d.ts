import { DefineComponent } from 'vue'
import { RegionInputModel } from './component'

interface Props {
  /** 输入区域模型 */
  modelValue: RegionInputModel
  /**
   * 分隔符
   * @default ''
   */
  separator?: string
}

/**
 * 行政区划内容显示
 */
export const RegionText: DefineComponent<Props>
