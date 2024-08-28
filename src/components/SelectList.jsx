import { defineComponent, inject } from 'vue'

import { injectKeyProps } from '../constants'

export default defineComponent({
  name: 'RegionSelectList',
  props: {
    list: { type: Object, default: undefined },
    selected: { type: Object, default: undefined }
  },
  emits: ['select'],
  setup (props, { emit }) {
    const { blank, blankText } = inject(injectKeyProps)

    const select = val => emit('select', val)

    return () => (
      <ul class='rg-select__list'>
        {blank && <li onClick={select}>{blankText}</li>}
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
