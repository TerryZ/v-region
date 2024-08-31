import { ref, defineComponent, provide } from 'vue'

import Dropdown from 'v-dropdown'
import DropdownTrigger from './DropdownTrigger'

// import { useLanguage } from './helper'
import { injectKeySelector } from '../constants'

export default defineComponent({
  name: 'RegionDropdownContainer',
  setup (props, { slots }) {
    const visible = ref(false)
    const dropdownEl = ref()
    // const lang = useLanguage(props.language)

    function closeDropdown () {
      dropdownEl.value && dropdownEl.value.close()
    }
    function adjustDropdown () {
      dropdownEl.value && dropdownEl.value.adjust()
    }

    provide(injectKeySelector, {
      dropdownVisible: visible,
      closeDropdown,
      adjustDropdown
    })

    function TriggerItem () {
      if (slots.trigger) return slots.trigger()
      return <DropdownTrigger />
    }

    // dropdown 参数直接应用透传
    return () => (
      <Dropdown
        border
        ref={dropdownEl}
        onVisibleChange={val => { visible.value = val }}
      >{{
        default: () => slots.default?.(),
        trigger: () => <TriggerItem />
      }}</Dropdown>
    )
  }
})
