import { mergeProps, inject } from 'vue'

import { mergeDropdownProps } from '../../core/options'
import { injectKeySelector } from '../../constants'

import DropdownContainer from '../../components/DropdownContainer'
import { createDropdownTrigger } from '../../core/dropdown'

export function defineRegionColumns (name, RegionColumnsCore) {
  return {
    name,
    inheritAttrs: false,
    props: mergeDropdownProps(),
    emits: ['complete', 'visible-change'],
    setup (props, { emit, slots, attrs }) {
      function TheDropdownTrigger () {
        return createDropdownTrigger(props, slots)
      }
      function ColumnsCore () {
        const { closeDropdown, adjustDropdown } = inject(injectKeySelector)
        const columnsProps = {
          language: props.language,
          onComplete: () => {
            closeDropdown()
            emit('complete')
          },
          onAdjust: adjustDropdown
        }
        return <RegionColumnsCore {...mergeProps(columnsProps, attrs)} />
      }

      return () => (
        <DropdownContainer
          {...props}
          onVisibleChange={val => emit('visible-change', val)}
        >{{
          trigger: () => <TheDropdownTrigger />,
          default: () => <ColumnsCore />
        }}</DropdownContainer>
      )
    }
  }
}
