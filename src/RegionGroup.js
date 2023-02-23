import { ref, h, useAttrs, mergeProps } from 'vue'

import RegionGroupCore from './components/Group'

import { CN } from './language'
import { useDropdown } from './utils/selector'

export default {
  name: 'RegionGroup',
  inheritAttrs: false,
  props: {
    language: { type: String, default: CN },
    disabled: { type: Boolean, default: false }
  },
  emits: ['complete', 'visible-change'],
  setup (props, { emit, slots }) {
    const attrs = useAttrs()
    const {
      generateDropdown,
      generateDropdownTriggerButton,
      closeDropdown,
      adjustDropdown
    } = useDropdown(props)

    const group = ref(null)

    function clear () {
      group.value && group.value.reset()
      closeDropdown()
    }

    return () => {
      const trigger = generateDropdownTriggerButton(
        slots, () => group, clear
      )

      const groupOption = {
        ref: group,
        language: props.language,
        onComplete: () => {
          closeDropdown()
          emit('complete')
        },
        onAdjust: adjustDropdown
      }
      const contents = h(RegionGroupCore, mergeProps(groupOption, attrs))

      const dropdownOption = {
        onVisibleChange (val) {
          emit('visible-change', val)
        }
      }
      return generateDropdown(dropdownOption, trigger, contents)
    }
  }
}
