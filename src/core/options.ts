// import { mergeProps } from 'vue'
import type { PropType } from 'vue'

import { CN } from '../language'
import type { RegionValues } from '../types'

const baseProps = {
  city: { type: Boolean, default: true },
  area: { type: Boolean, default: true },
  town: { type: Boolean, default: true },
  language: { type: String, default: CN },
  autoSelectFirst: { type: Boolean, default: false },
  modelValue: { type: Object as PropType<RegionValues>, default: undefined }
} as const

/**
 * 基础 props
 *
 * 作用于：Select、Group、Column、Text
 *
 * @param props
 * @returns
 */
export function mergeBaseProps<T extends Record<string, unknown>>(props?: T) {
  return {
    ...baseProps,
    ...props
  } as typeof baseProps & T
}
export function mergeEmits(emit: string[] = []): string[] {
  const baseEvents = ['update:modelValue', 'update:names', 'change']

  return [...baseEvents, ...emit]
}
