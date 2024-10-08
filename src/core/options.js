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
export function mergeDropdownProps (props) {
  return mergeProps({
    language: { type: String, default: CN },
    disabled: { type: Boolean, default: false },
    /** 为触发对象添加自定义样式类 */
    customTriggerClass: { type: String, default: '' },
    /** 为下拉容器添加自定义样式类 */
    customContainerClass: { type: String, default: '' }
  }, props)
}
export function mergeSelectorProps (props) {
  return mergeProps(mergeBaseProps(), mergeDropdownProps(), props)
}

export function mergeEmits (emit) {
  return ['update:modelValue', 'change', ...(emit || [])]
}
