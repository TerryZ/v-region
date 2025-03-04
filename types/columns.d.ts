import { BaseProps, CoreModuleEmits } from './component'

declare interface RegionColumns {
  new (): {
    $props: BaseProps
    $emit: CoreModuleEmits
  }
}

/**
 * 多列竖排模式核心模块
 */
export const RegionColumns: RegionColumns
export const RegionFullColumns: RegionColumns
