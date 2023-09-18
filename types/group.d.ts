import { BaseProps, DropdownProps, CoreModuleEmits, DropdownEmits } from './component'

declare interface RegionGroupCore {
  new (): {
    $props: BaseProps
    $emit: CoreModuleEmits
  }
}
declare interface RegionGroup {
  new (): {
    $props: DropdownProps
    $emit: DropdownEmits
  }
}

/**
 * 多分组选择器组件核心模块
 */
export const RegionGroupCore: RegionGroupCore
/**
 * 多分组选择器组件
 */
export const RegionGroup: RegionGroup
