import { mergeProps } from 'vue'

import { CN } from '../language'

export function mergeBaseProps (props) {
  return mergeProps({
    city: { type: Boolean, default: true },
    area: { type: Boolean, default: true },
    town: { type: Boolean, default: true },
    language: { type: String, default: CN },
    modelValue: { type: Object, default: undefined }
  }, props)
}
export function mergeEmits (emit) {
  return ['update:modelValue', 'update:names', 'change', ...(emit || [])]
}
