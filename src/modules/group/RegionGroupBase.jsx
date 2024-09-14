import { mergeProps, inject } from 'vue'

import { mergeDropdownProps } from '../../core/options'
import { injectKeySelector } from '../../constants'

import DropdownContainer from '../../components/DropdownContainer'
import { createDropdownTrigger } from '../../core/dropdown'

export function defineRegionGroup (name, RegionGroupCore) {
  return {
    name,
    inheritAttrs: false,
    props: mergeDropdownProps(),
    emits: ['complete', 'visible-change'],
    setup (props, { emit, slots, attrs }) {
      function TheDropdownTrigger () {
        return createDropdownTrigger(props, slots)
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
        return <RegionGroupCore {...mergeProps(groupProps, attrs)} />
      }

      return () => (
        <DropdownContainer
          {...props}
          onVisibleChange={val => emit('visible-change', val)}
        >{{
          trigger: () => <TheDropdownTrigger />,
          default: () => <GroupCore />
        }}</DropdownContainer>
      )
    }
  }
}
