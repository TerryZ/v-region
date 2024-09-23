import { VNode } from 'vue'
import {
  BaseProps,
  SelectorProps,
  CoreModuleEmits,
  DropdownEmits,
  RegionTriggerSlotData
} from './component'

declare interface RegionColumnsCore {
  new (): {
    $props: BaseProps
    $emit: CoreModuleEmits
  }
}
declare interface RegionColumns {
  new (): {
    $props: SelectorProps
    $emit: DropdownEmits
    $slots: {
      default?: (triggerSlotData: RegionTriggerSlotData) => VNode[]
    }
  }
}

/**
 * 多列竖排模式核心模块
 */
export const RegionColumnsCore: RegionColumnsCore
export const RegionFullColumnsCore: RegionColumnsCore
/**
 * 多列竖排模式选择器
 */
export const RegionColumns: RegionColumns
export const RegionFullColumns: RegionColumns
