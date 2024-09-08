import { inject, computed, defineComponent } from 'vue'

import DropdownContainer from '../../components/DropdownContainer'
import SelectLevelList from './SelectLevelList'
import SelectDropdownTrigger from './SelectDropdownTrigger'

import { injectKeyCore, injectKeyBase } from '../../constants'

export default defineComponent({
  name: 'RegionSelect',
  props: {
    level: { type: String, default: '' }
  },
  setup (props) {
    const { data, disabled } = inject(injectKeyCore)
    const {
      blank,
      blankText,
      customTriggerClass,
      customContainerClass
    } = inject(injectKeyBase)

    const blankContent = blank ? blankText : '&nbsp;'
    const contentText = computed(() => (
      data.value[props.level]?.name || blankContent
    ))

    return () => (
      <DropdownContainer
        class='rg-select'
        disabled={disabled.value}
        custom-trigger-class={customTriggerClass}
        custom-container-class={customContainerClass}
      >{{
        trigger: () => (
          <SelectDropdownTrigger>{contentText.value}</SelectDropdownTrigger>
        ),
        default: () => <SelectLevelList level={props.level} />
      }}</DropdownContainer>
    )
  }
})
