import { ref, defineComponent, inject } from 'vue'
import { useDropdown } from 'v-dropdown'

import { injectKeyCore, injectKeyBase } from '../../constants'
import { scrollIntoElement } from '../../core/helper'

export default defineComponent({
  name: 'RegionSelectList',
  props: {
    level: { type: String, default: '' }
  },
  setup (props, { expose }) {
    const { data, lang, setLevel } = inject(injectKeyCore)
    const { blank } = inject(injectKeyBase)
    const { close } = useDropdown()
    const list = ref()

    const selectItem = item => {
      setLevel(props.level, item)
      close()
    }
    const scrollToSelectedItem = () => scrollIntoElement(list.value, '.selected')
    const BlankItem = () => {
      if (!blank) return null
      return <li onClick={selectItem}>{lang.pleaseSelect}</li>
    }
    const levelItems = () => {
      const { list, key } = data.value[props.level]
      return list.map(item => (
        <li
          key={item.key}
          class={{ selected: key === item.key }}
          onClick={() => selectItem(item) }
        >
          {item.value}
        </li>
      ))
    }

    expose({ scrollToSelectedItem })

    return () => (
      <ul class='rg-select__list' ref={list}>
        <BlankItem />
        {levelItems()}
      </ul>
    )
  }
})
