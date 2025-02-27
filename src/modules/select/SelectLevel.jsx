import { inject, computed, defineComponent, ref } from 'vue'

import { Dropdown, DropdownContent, DropdownTrigger } from 'v-dropdown'
import SelectLevelList from './SelectLevelList'

import { injectKeyCore, injectKeyBase } from '../../constants'

export default defineComponent({
  name: 'RegionSelect',
  props: {
    level: { type: String, default: '' }
  },
  setup (props) {
    const { data, disabled, lang } = inject(injectKeyCore)
    const { blank } = inject(injectKeyBase)
    const list = ref()

    const blankContent = blank ? lang.pleaseSelect : '&nbsp;'
    const contentText = computed(() => (
      data.value[props.level]?.name || blankContent
    ))

    const handleOpened = () => list.value.scrollToSelectedItem()

    return () => {
      const slots = {
        trigger: () => (
          <DropdownTrigger>{contentText.value}</DropdownTrigger>
        ),
        default: () => (
          <DropdownContent>
            <SelectLevelList ref={list} level={props.level} />
          </DropdownContent>
        )
      }
      return (
        <Dropdown
          disabled={disabled.value}
          onOpened={handleOpened}
          v-slots={slots}
        />
      )
    }
  }
})
