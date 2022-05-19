import { RegionComponent } from './component'

/**
 * 级联下拉列表模式
 */
export declare class RegionSelects extends RegionComponent {
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
