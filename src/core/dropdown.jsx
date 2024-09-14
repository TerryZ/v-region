import { inject } from 'vue'

import { injectKeySelector } from '../constants'

import DropdownTrigger from '../components/DropdownTrigger'

export function createDropdownTrigger (props, slots) {
  const { dropdownVisible, regionModel } = inject(injectKeySelector)
  if (slots.default) {
    return slots.default({
      data: regionModel.value,
      visible: dropdownVisible.value
    })
  }
  return <DropdownTrigger language={props.language} />
}
