import { inject } from 'vue'

import { injectKeySelector } from '../constants'

import DropdownTrigger from '../components/DropdownTrigger'

export function createDropdownTrigger (props, slots, coreRef) {
  const { dropdownVisible } = inject(injectKeySelector)
  if (slots.default) {
    return slots.default({
      data: coreRef?.value?.data,
      visible: dropdownVisible
    })
  }
  return (
    <DropdownTrigger
      language={props.language}
      region={coreRef?.value?.data}
    />
  )
}
