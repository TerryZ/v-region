import { ref, defineComponent, provide } from 'vue'

import { Dropdown, DropdownTrigger, DropdownContent } from 'v-dropdown'

import { injectDropdown } from '../constants'

export default defineComponent({
  name: 'RegionDropdown',
  // props 必须使用硬编码的对象内容，使用函数构建的对象，会造成 tree-shanking
  // 失效
  props: {
  },
  emits: ['complete', 'change'],
  setup (props, { slots }) {
    const triggerText = ref('')

    const setTriggerText = text => {
      triggerText.value = text
    }

    function RegionDropdownTrigger (data) {
      if (slots.trigger) return slots.trigger(data)
      return (
        <DropdownTrigger>
          {triggerText.value}
        </DropdownTrigger>
      )
    }

    provide(injectDropdown, { setTriggerText })

    return () => {
      const dropdownSlots = {
        trigger: RegionDropdownTrigger,
        default: data => (
          <DropdownContent>
            {() => slots?.default?.(data)}
          </DropdownContent>
        )
      }
      return (
        <Dropdown v-slots={dropdownSlots} />
      )
    }
  }
})
