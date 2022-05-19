import Vue from 'vue'
import { RegionInputModel } from './component'

/**
 * 行政区划内容显示
 */
export declare class RegionText extends Vue {
  /** 输入区域模型 */
  value: RegionInputModel
  /**
   * 分隔符
   * @default ''
   */
  separator?: string
}
