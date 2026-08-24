import { ref, defineComponent, provide } from 'vue'

import { Dropdown, DropdownTrigger, DropdownContent } from 'v-dropdown'
import type { DropdownUtilities } from 'v-dropdown'

import { keyDropdown } from '../constants'

export default defineComponent({
  name: 'RegionDropdown',
  // props 须用硬编码对象内容，使用函数构建的对象，会造成 tree-shanking 失效
  props: {},
  setup(props, { slots }) {
    const triggerText = ref('')

    const setTriggerText = (text: string) => {
      triggerText.value = text
    }

    function RegionDropdownTrigger(data: DropdownUtilities) {
      if (slots.trigger) return slots.trigger(data)
      return <DropdownTrigger>{triggerText.value}</DropdownTrigger>
    }

    provide(keyDropdown, { setTriggerText })

    const dropdownSlots = {
      trigger: RegionDropdownTrigger,
      default: (data: DropdownUtilities) => (
        <DropdownContent>{() => slots?.default?.(data)}</DropdownContent>
      )
    }
    return () => <Dropdown v-slots={dropdownSlots} />
  }
})
