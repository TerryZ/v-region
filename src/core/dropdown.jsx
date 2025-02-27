import { mergeProps, ref } from 'vue'

import { CN } from '../language'
import { getLanguage, getModelText } from '../core/helper'

import { Dropdown, DropdownContent, DropdownTrigger, useDropdown } from 'v-dropdown'

export function defineRegionSelector (name, RegionCoreComponent) {
  return {
    name,
    inheritAttrs: false,
    // props 必须使用硬编码的对象内容，使用函数构建的对象，会造成 tree-shanking
    // 失效
    props: {
      language: { type: String, default: CN },
      disabled: { type: Boolean, default: false }
    },
    emits: ['complete', 'change', 'visible-change'],
    setup (props, { emit, slots, attrs }) {
      const region = ref({})

      function TriggerText () {
        const lang = getLanguage(props.language)
        return getModelText(region.value) || lang.pleaseSelect
      }
      function RegionDropdownTrigger ({ visible }) {
        if (slots.default) {
          return slots.default({
            data: region.value,
            visible: visible.value
          })
        }
        return (
          <DropdownTrigger>
            <TriggerText />
          </DropdownTrigger>
        )
      }
      function RegionCore () {
        const { close } = useDropdown()
        const coreProps = {
          language: props.language,
          onChange: data => {
            region.value = data
            emit('change', data)
          },
          onComplete: () => {
            close()
            emit('complete')
          }
        }
        return <RegionCoreComponent {...mergeProps(coreProps, attrs)} />
      }

      const dropdownSlots = {
        trigger: RegionDropdownTrigger,
        default: () => (
          <DropdownContent>
            <RegionCore />
          </DropdownContent>
        )
      }
      return () => (
        <Dropdown
          {...props}
          v-slots={dropdownSlots}
        />
      )
    }
  }
}
