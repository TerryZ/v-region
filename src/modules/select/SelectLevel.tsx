import { inject, computed, defineComponent, ref, h } from 'vue'

import { Dropdown, DropdownContent, DropdownTrigger } from 'v-dropdown'
import SelectLevelList from './SelectLevelList'

import { keyCore, keyInternal } from '../../constants'

import type { PropType } from 'vue'
import type { RegionUIProvide, RegionLevel } from '../../types'

export default defineComponent({
  name: 'RegionSelect',
  props: {
    level: { type: String as PropType<RegionLevel>, default: '' }
  },
  setup(props, { slots }) {
    const { state, disabled, lang } = inject(keyCore) as RegionUIProvide
    const { blank } = inject(keyInternal) as { blank: boolean }
    const list = ref()

    const blankContent = blank ? lang.pleaseSelect : '&nbsp;'
    const contentText = computed(() => state.value[props.level]?.name || blankContent)

    const handleOpened = () => list.value?.scrollToSelectedItem()

    return () => {
      // const dropdownSlots = {
      //   trigger: () => (
      //     <DropdownTrigger>
      //       <div class="rg-flex rg-gap rg-align-center">
      //         {slots.default?.()}
      //         {contentText.value}
      //       </div>
      //     </DropdownTrigger>
      //   ),
      //   default: () => (
      //     <DropdownContent>
      //       <SelectLevelList ref={list} level={props.level} />
      //     </DropdownContent>
      //   )
      // }
      // TODO: v-dropdown 使用 ts 编写，并处理好事件的类型
      // return <Dropdown disabled={disabled.value} onOpened={handleOpened} v-slots={dropdownSlots} />
      return h(
        Dropdown,
        {
          disabled: disabled.value,
          onOpened: handleOpened
        },
        {
          default: () =>
            h(DropdownContent, null, () =>
              h(SelectLevelList, {
                ref: list,
                level: props.level
              })
            ),
          trigger: () =>
            h(DropdownTrigger, null, () =>
              h('div', { class: 'rg-flex rg-gap rg-align-center' }, [
                slots.default?.(),
                contentText.value
              ])
            )
        }
      )
    }
  }
})
