import { inject, computed, defineComponent } from 'vue'

import DropdownContainer from '../../components/DropdownContainer'
import SelectLevelList from './SelectLevelList'
import SelectDropdownTrigger from './SelectDropdownTrigger'

import { injectKeyBase } from '../../constants'

export default defineComponent({
  name: 'RegionSelect',
  props: {
    list: { type: Object, required: true },
    modelValue: { type: Object, default: undefined }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const {
      disabled,
      blank,
      blankText,
      customTriggerClass,
      customContainerClass
    } = inject(injectKeyBase)

    const blankContent = blank ? blankText : '&nbsp;'
    const contentText = computed(() => props.modelValue?.value || blankContent)

    const updateModelValue = val => emit('update:modelValue', val)

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
        default: () => (
          <SelectLevelList
            list={props.list}
            selected={props.modelValue}
            onSelect={updateModelValue}
          />
        )
      }}</DropdownContainer>
    )
  }
})
