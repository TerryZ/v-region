import { SelectorProps, BaseEmits } from './component'

/**
 * 级联下拉列表模式
 */
interface Props extends SelectorProps {
  /**
   * 未选择时显示 `请选择` 的提示文本
   * @default true
   */
  blank?: boolean
}

declare interface RegionSelects {
  new (): {
    $props: Props,
    $emit: BaseEmits
  }
}

export const RegionSelects: RegionSelects
export const RegionFullSelects: RegionSelects
