import { BaseProps, SelectorProps, CoreModuleEmits, DropdownEmits } from './component'

declare interface RegionGroupCore {
  new (): {
    $props: BaseProps
    $emit: CoreModuleEmits
  }
}
declare interface RegionGroup {
  new (): {
    $props: SelectorProps
    $emit: DropdownEmits
  }
}

/**
 * 多分组选择器组件核心模块
 */
export const RegionGroupCore: RegionGroupCore
export const RegionFullGroupCore: RegionGroupCore
/**
 * 多分组选择器组件
 */
export const RegionGroup: RegionGroup
export const RegionFullGroup: RegionGroup
