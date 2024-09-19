import { DropdownProps, BaseEmits, EmitVisibleChange } from './component'

interface Props extends DropdownProps {
  /** 输入区域编码列表 */
  modelValue?: string[]
  /**
   * 按钮中显示选中城市模式
   * true: 显示所有选中城市名称
   * false: 选中的城市多于两个时，仅显示前两个城市名称，其他城市会被收起
   *
   * @default false
   */
  overflow?: boolean
}

declare interface RegionCityPicker {
  new (): {
    $props: Props
    $emit: BaseEmits & EmitVisibleChange
  }
}

export const RegionCityPicker: RegionCityPicker
