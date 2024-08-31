import { defineComponent, inject } from 'vue'

import { injectKeyProps, injectKeySelector } from '../../constants'

export default defineComponent({
  name: 'RegionSelectList',
  props: {
    list: { type: Object, default: undefined },
    selected: { type: Object, default: undefined }
  },
  emits: ['select'],
  setup (props, { emit }) {
    const { blank, blankText } = inject(injectKeyProps)
    const { closeDropdown } = inject(injectKeySelector)

    const select = val => {
      emit('select', val)
      closeDropdown()
    }
    const BlankItem = () => {
      if (!blank) return null
      return <li onClick={select}>{blankText}</li>
    }

    return () => (
      <ul class='rg-select__list'>
        <BlankItem />
        {props.list.value.map(val => (
          <li
            key={val.key}
            class={{ selected: props.selected?.key === val.key }}
            onClick={() => select(val) }
          >
            {val.value}
          </li>
        ))}
      </ul>
    )
  }
})
