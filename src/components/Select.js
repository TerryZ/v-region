import { reactive, inject, computed, h, defineComponent } from 'vue'
import { useDropdown } from '../utils/selector'

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

    const blankContent = blank ? props.blankText : '&nbsp;'
    const content = computed(() => props.modelValue?.value || blankContent)

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
          h('div', { class: 'rg-select__content', innerHTML: content.value }),
          h('span', { class: 'rg-select__caret' })
        ]
      )

      const contents = []

      const items = props.list.value.map(val => {
        const selected = props.modelValue && props.modelValue.key === val.key
        const liOption = {
          key: val.key,
          class: { selected },
          onClick: () => { select(val) }
        }
        return h('li', liOption, val.value)
      })

      if (blank) { // "Please select" option
        items.unshift(h('li', { onClick: select }, props.blankText))
      }

      contents.push(h('ul', { class: 'rg-select__list' }, items))

      const dropdownProps = {
        class: 'rg-select',
        disabled: disabled.value
      }
      return generateDropdown(dropdownProps, trigger, contents)
    }
  }
})
