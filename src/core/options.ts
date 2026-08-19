import { mergeProps } from 'vue'

import { CN } from '../language'
/**
 * 基础 props
 *
 * 作用于：Select、Group、Column、Text
 *
 * @param {object} props
 * @returns
 */
export function mergeBaseProps (props) {
  return mergeProps({
    city: { type: Boolean, default: true },
    area: { type: Boolean, default: true },
    town: { type: Boolean, default: true },
    language: { type: String, default: CN },
    autoSelectFirst: { type: Boolean, default: false },
    modelValue: { type: Object, default: undefined }
  }, props)
}
export function mergeEmits (emit) {
  return ['update:modelValue', 'update:names', 'change', ...(emit || [])]
}
