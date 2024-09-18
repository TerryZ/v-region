import { defineComponent, mergeProps, inject } from 'vue'

// import RegionFullGroupCore from './FullGroupCore'
import RegionGroupCore from './GroupCore'
// import { defineRegionGroup } from './RegionGroupBase'

// export default defineComponent(
//   defineRegionGroup('RegionFullGroup', props => (
//     <RegionFullGroupCore {...props} />
//   ))
// )

import { mergeDropdownProps } from '../../core/options'
import { injectKeySelector, injectKeyCore } from '../../constants'
import { getTowns } from '../../core/helper'

import { Dropdown } from 'v-dropdown'
import DropdownContainer from '../../components/DropdownContainer'
import DropdownTrigger from '../../components/DropdownTrigger'
import { createDropdownTrigger } from '../../core/dropdown'

export default defineComponent({
  name: 'RegionFullGroup',
  inheritAttrs: false,
  props: mergeDropdownProps(),
  emits: ['complete', 'visible-change'],
  setup (props, { emit, slots, attrs }) {
    function TheDropdownTrigger () {
      // return createDropdownTrigger(props, slots)
      // const { dropdownVisible, regionModel } = inject(injectKeySelector)
      // if (slots.default) {
      //   return slots.default({
      //     data: regionModel.value,
      //     visible: dropdownVisible.value
      //   })
      // }
      return <DropdownTrigger language={props.language} />
    }
    function GroupCore () {
      function GroupCoreTown () {
        const { setupTownListLoader } = inject(injectKeyCore)

        setupTownListLoader(getTowns)
      }
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
        <RegionGroupCore {...mergeProps(groupProps, attrs)}>
          <GroupCoreTown />
        </RegionGroupCore>
      )
    }

    return () => (
      <Dropdown
        {...props}
        onVisibleChange={val => emit('visible-change', val)}
      >{{
        trigger: () => <TheDropdownTrigger />,
        default: () => <GroupCore />
      }}</Dropdown>
    )
  }
})
