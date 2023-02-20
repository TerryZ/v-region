import { ref, h, useAttrs, mergeProps } from 'vue'
import RegionColumnsCore from './components/Columns'

import { CN } from './language'
import { useDropdown } from './utils/selector'

export default {
  name: 'RegionColumns',
  inheritAttrs: false,
  props: {
    language: { type: String, default: CN },
    disabled: { type: Boolean, default: false }
  },
  emits: ['complete', 'visible-change'],
  setup (props, { emit, slots }) {
    const {
      generateDropdown,
      generateDropdownTriggerButton,
      closeDropdown,
      adjustDropdown
    } = useDropdown(props, emit)
    const columns = ref(null)
    const attrs = useAttrs()

    function clear () {
      columns.value && columns.value.reset()
      closeDropdown()
    }

    return () => {
      const trigger = generateDropdownTriggerButton(
        slots, columns?.value?.region, columns?.value?.regionText, clear
      )

      const columnsOption = {
        ref: columns,
        onComplete: () => {
          closeDropdown()
          emit('complete')
        },
        onAdjust: adjustDropdown
      }
      const contents = h(RegionColumnsCore, mergeProps(columnsOption, attrs))

      return generateDropdown({}, trigger, contents)
    }
  }
}
