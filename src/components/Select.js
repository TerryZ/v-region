import { inject, computed, h } from 'vue'
import { useDropdown } from '../utils/selector'

export default {
  name: 'RegionSelect',
  props: {
    list: { type: Array, required: true },
    blankText: String,
    modelValue: Object
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const {
      visible,
      closeDropdown,
      generateDropdown,
      generateDropdownTrigger
    } = useDropdown()

    const disabled = inject('disabled')
    const blank = inject('blank')

    const content = computed(() => {
      return (props.value && props.value.value)
        ? props.value.value
        : blank ? props.blankText : '&nbsp;'
    })
    const triggerClasses = computed(() => {
      return {
        'rg-select__el': true,
        'rg-select__el--active': visible.value,
        'rg-select_el--disabled': disabled
      }
    })

    function select (val) {
      emit('update:modelValue', val)
      closeDropdown()
    }

    return () => {
      const contents = []

      // dropdown trigger object
      contents.push(
        generateDropdownTrigger([
          h('div', { class: triggerClasses.value }, [
            h('div', { class: 'rg-select__content' }, content.value),
            h('span', { class: 'rg-select__caret' })
          ])
        ])
      )

      const listItems = props.list.map(val => {
        const liOption = {
          key: val.key,
          class: {
            selected: props.modelValue && props.modelValue.key === val.key
          },
          onClick: () => { select(val) }
        }
        return h('li', liOption, val.value)
      })
      // "Please select" option
      if (blank) {
        listItems.unshift(h('li', { onClick: select }, props.blankText))
      }

      contents.push(h('ul', { class: 'rg-select__list' }, listItems))

      return generateDropdown(contents, { disabled })
    }
  }
}
