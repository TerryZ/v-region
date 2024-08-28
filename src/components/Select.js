import { inject, computed, h, defineComponent } from 'vue'

import SelectList from './SelectList'

import { useDropdown } from '../utils/selector'
import { injectKeyProps } from '../constants'

export default defineComponent({
  name: 'RegionSelect',
  props: {
    list: { type: Object, required: true },
    modelValue: { type: Object, default: undefined }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const { visible, closeDropdown, generateDropdown } = useDropdown(props)

    const {
      disabled,
      blank,
      blankText,
      customTriggerClass,
      customContainerClass
    } = inject(injectKeyProps)
    // const disabled = inject('disabled')
    // const blank = inject('blank')
    // const customTriggerClass = inject('customTriggerClass')
    // const customContainerClass = inject('customContainerClass')

    const blankContent = blank ? blankText : '&nbsp;'
    const contentText = computed(() => props.modelValue?.value || blankContent)

    const triggerClasses = computed(() => ({
      'rg-select__el': true,
      'rg-select__el--active': visible.value,
      'rg-select__el--disabled': disabled.value
    }))

    function select (val) {
      emit('update:modelValue', val)
      closeDropdown()
    }

    return () => {
      const trigger = h( // dropdown trigger object
        'div',
        { class: triggerClasses.value },
        [
          h('div', { class: 'rg-select__content', innerHTML: contentText.value }),
          h('span', { class: 'rg-select__caret' })
        ]
      )

      const content = h(SelectList, {
        list: props.list,
        blank,
        blankText,
        selected: props.modelValue,
        onSelect: select
      })

      const dropdownProps = {
        class: 'rg-select',
        disabled: disabled.value,
        customTriggerClass,
        customContainerClass
      }
      return generateDropdown(dropdownProps, trigger, content)
    }
  }
})
