import { ref, h, mergeProps, defineComponent } from 'vue'
import RegionGroupCore from './components/Group'

import { useDropdown } from './utils/selector'
import { dropdownProps } from './utils/data'

export default defineComponent({
  name: 'RegionGroup',
  inheritAttrs: false,
  props: {
    ...dropdownProps
  },
  emits: ['complete', 'visible-change'],
  setup (props, { emit, slots, expose, attrs }) {
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

    expose({ reset: clear })

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
        customTriggerClass: props.customTriggerClass,
        customContainerClass: props.customContainerClass,
        onVisibleChange (val) {
          emit('visible-change', val)
        }
      }
      return generateDropdown(dropdownOption, trigger, contents)
    }
  }
})
