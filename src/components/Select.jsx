import { inject, computed, defineComponent } from 'vue'

import DropdownContainer from '../components/DropdownContainer'
import SelectList from './SelectList'

import { injectKeyProps } from '../constants'

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
    } = inject(injectKeyProps)

    const blankContent = blank ? blankText : '&nbsp;'
    const contentText = computed(() => props.modelValue?.value || blankContent)

    const triggerClasses = computed(() => ({
      'rg-select__el': true,
      'rg-select__el--active': visible.value,
      'rg-select__el--disabled': disabled.value
    }))

    function select (val) {
      emit('update:modelValue', val)
    }

    return () => (
      <DropdownContainer
        class='rg-select'
        disabled={disabled.value}
        custom-trigger-class={customTriggerClass}
        custom-container-class={customContainerClass}
      >
        {{
          trigger: () => (
            <div class={triggerClasses.value}>
              <div class='rg-select__content'>{contentText.value}</div>
              <span class='rg-select__caret' />
            </div>
          ),
          default: () => (
            <SelectList
              list={props.list}
              selected={props.modelValue}
              onSelect={select}
            />
          )
        }}
      </DropdownContainer>
    )
  }
})
