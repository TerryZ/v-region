import { ref, defineComponent, provide } from 'vue'

import Dropdown from 'v-dropdown'

import { injectKeySelector } from '../constants'

export default defineComponent({
  name: 'RegionDropdownContainer',
  setup (props, { slots }) {
    const visible = ref(false)
    const dropdownEl = ref()

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

    // dropdown 参数直接应用透传
    return () => (
      <Dropdown
        border
        ref={dropdownEl}
        onVisibleChange={val => { visible.value = val }}
      >{{
        default: () => slots.default?.(),
        trigger: () => slots.trigger?.()
      }}</Dropdown>
    )
  }
})
