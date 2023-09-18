import { reactive, inject, computed, h, defineComponent } from 'vue'
import { useDropdown } from '../utils/selector'
import SelectList from './SelectList'

export default defineComponent({
  name: 'RegionSelect',
  props: {
    list: { type: Object, required: true },
    blankText: { type: String, default: '' },
    modelValue: { type: Object, default: undefined }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const { visible, closeDropdown, generateDropdown } = useDropdown(props)

    const disabled = inject('disabled')
    const blank = inject('blank')
    const customTriggerClass = inject('customTriggerClass')
    const customContainerClass = inject('customContainerClass')

    const blankContent = blank ? props.blankText : '&nbsp;'
    const contentText = computed(() => props.modelValue?.value || blankContent)

    const triggerClasses = reactive({
      'rg-select__el': true,
      'rg-select__el--active': visible,
      'rg-select__el--disabled': disabled
    })

    function select (val) {
      emit('update:modelValue', val)
      closeDropdown()
    }

    return () => {
      const trigger = h( // dropdown trigger object
        'div',
        { class: triggerClasses },
        [
          h('div', { class: 'rg-select__content', innerHTML: contentText.value }),
          h('span', { class: 'rg-select__caret' })
        ]
      )

      const content = h(SelectList, {
        list: props.list,
        blank,
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
