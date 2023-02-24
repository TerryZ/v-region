import { ref, h, mergeProps } from 'vue'
import Dropdown from 'v-dropdown'
import IconX from '../icons/IconX.vue'

import { useLanguage } from './helper'

export function useDropdown (props) {
  const visible = ref(false)
  const dropdown = ref(null)

  function closeDropdown () {
    dropdown.value && dropdown.value.close()
  }

  function adjustDropdown () {
    dropdown.value && dropdown.value.adjust()
  }

  function generateDropdown (customProps, trigger, contents) {
    const dropdownOption = {
      ref: dropdown,
      border: true,
      disabled: props.disabled,
      onVisibleChange (val) { visible.value = val }
    }
    return h(Dropdown, mergeProps(dropdownOption, customProps), {
      trigger: () => trigger,
      default: () => contents
    })
  }

  function generateDropdownTriggerButton (slots, useContent, clear) {
    const lang = useLanguage(props.language)
    const content = useContent()
    const elements = []

    if (slots && 'default' in slots) { // scoped slot
      elements.push(slots.default({ region: content?.value?.region, visible }))
    } else {
      const buttonElements = [
        h('span', content?.value?.regionText || lang.pleaseSelect)
      ]

      if (content?.value?.regionText) { // 清除图标
        const clearOption = {
          class: 'rg-clear-btn',
          title: lang.clear,
          onClick: e => {
            e.stopPropagation()
            clear && clear()
          }
        }
        buttonElements.push(h('span', clearOption, h(IconX)))
      } else { // 下拉图标
        buttonElements.push(h('span', { class: 'rg-caret-down' }))
      }

      const btnOption = {
        class: {
          'rg-default-btn': true,
          'rg-opened': visible.value
        },
        type: 'button'
      }
      elements.push(h('button', btnOption, buttonElements))
    }

    return h('div', { class: 'rg-trigger-container' }, elements)
  }

  return {
    visible,
    dropdown,
    generateDropdown,
    generateDropdownTriggerButton,
    closeDropdown,
    adjustDropdown
  }
}
