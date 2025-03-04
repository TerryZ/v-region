import { BaseProps, CoreModuleEmits } from './component'

declare interface RegionGroup {
  new (): {
    $props: BaseProps
    $emit: CoreModuleEmits
  }
}

/**
 * 多分组选择器组件核心模块
 */
export const RegionGroup: RegionGroup
export const RegionFullGroup: RegionGroup
