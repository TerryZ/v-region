import { ref, defineComponent, provide } from 'vue'

import Dropdown from 'v-dropdown'

// import { useLanguage } from './helper'
import { injectKeySelector } from '../constants'

export default defineComponent({
  name: 'RegionDropdownContainer',
  props: {
    disabled: { type: Boolean, default: false }
  },
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

    return () => {
      return (
        <Dropdown
          border
          ref={dropdownEl}
          disabled={props.disabled}
          onVisibleChange={val => { visible.value = val }}
        >{{
          default: () => slots.default?.(),
          trigger: () => { }
        }}</Dropdown>
      )
    }
  }
})
