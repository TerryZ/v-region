import { BaseProps, CoreModuleEmits } from './component'

declare interface RegionColumnsCore {
  new (): {
    $props: BaseProps
    $emit: CoreModuleEmits
  }
}

/**
 * 多列竖排模式核心模块
 */
export const RegionColumnsCore: RegionColumnsCore
export const RegionFullColumnsCore: RegionColumnsCore
