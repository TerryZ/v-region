import Vue from 'vue'
import { RegionItem } from './component'

export declare class RegionCityPicker extends Vue {
  /** 输入区域编码列表 */
  value: string[]
  /**
   * 按钮中显示选中城市模式
   * true: 显示所有选中城市名称
   * false: 选中的城市多于两个时，仅显示前两个城市名称，其他城市会被收起
   * @default false
   */
  overflow: boolean
  /**
   * 语言
   * @default 'CN'
   */
  language: string
  /** v-model 内容修改响应事件 */
  $emit(eventName:'input', event: string[]): this
  /** 内容修改后的响应事件 */
  $emit(eventName:'change', event: RegionItem[]): this
}
