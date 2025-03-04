import { BaseProps, CoreModuleEmits } from './component'

declare interface RegionGroupCore {
  new (): {
    $props: BaseProps
    $emit: CoreModuleEmits
  }
}

/**
 * 多分组选择器组件核心模块
 */
export const RegionGroupCore: RegionGroupCore
export const RegionFullGroupCore: RegionGroupCore
