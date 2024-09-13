import { ref, mergeProps, defineComponent, inject } from 'vue'
import RegionGroupCore from './Group'

// import { useDropdown } from '../../utils/selector'
import { mergeDropdownProps } from '../../core/options'
import { injectKeySelector } from '../../constants'

import DropdownContainer from '../../components/DropdownContainer'
import { createDropdownTrigger } from '../../core/dropdown'

export default defineComponent({
  name: 'RegionGroup',
  inheritAttrs: false,
  props: mergeDropdownProps(),
  emits: ['complete', 'visible-change'],
  setup (props, { emit, slots, attrs }) {
    const group = ref()

    function TheDropdownTrigger () {
      return createDropdownTrigger(props, slots, group)
    }
    function GroupCore () {
      const { closeDropdown, adjustDropdown } = inject(injectKeySelector)
      const groupProps = {
        language: props.language,
        onComplete: () => {
          closeDropdown()
          emit('complete')
        },
        onAdjust: adjustDropdown
      }
      return (
        <RegionGroupCore
          ref={group}
          {...mergeProps(groupProps, attrs)}
        />
      )
    }

    return () => (
      <DropdownContainer
        onVisibleChange={val => emit('visible-change', val)}
      >{{
        trigger: () => <TheDropdownTrigger />,
        default: () => <GroupCore />
      }}</DropdownContainer>
    )
  }
})
