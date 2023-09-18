import { BaseProps, DropdownProps, CoreModuleEmits, DropdownEmits } from './component'

declare interface RegionColumnsCore {
  new (): {
    $props: BaseProps
    $emit: CoreModuleEmits
  }
}
declare interface RegionColumns {
  new (): {
    $props: DropdownProps
    $emit: DropdownEmits
  }
}

/**
 * 多列竖排模式核心模块
 */
export const RegionColumnsCore: RegionColumnsCore
/**
 * 多列竖排模式选择器
 */
export const RegionColumns: RegionColumns
