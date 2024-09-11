import { defineComponent, inject } from 'vue'

import { injectKeyCore, injectKeyBase, injectKeySelector } from '../../constants'

export default defineComponent({
  name: 'RegionSelectList',
  props: {
    level: { type: String, default: '' }
  },
  setup (props) {
    const { data, lang, setLevel } = inject(injectKeyCore)
    const { blank } = inject(injectKeyBase)
    const { closeDropdown } = inject(injectKeySelector)
    const { level } = props

    const selectItem = item => {
      setLevel(level, item)
      closeDropdown()
    }
    const BlankItem = () => {
      if (!blank) return null
      return <li onClick={selectItem}>{lang.pleaseSelect}</li>
    }
    const levelItems = () => {
      const regionLevel = data.value[level]
      if (!regionLevel.list.length) return null
      return regionLevel.list.map(item => (
        <li
          key={item.key}
          class={{ selected: regionLevel.key === item.key }}
          onClick={() => selectItem(item) }
        >
          {item.value}
        </li>
      ))
    }

    return () => (
      <ul class='rg-select__list'>
        <BlankItem />
        {levelItems()}
      </ul>
    )
  }
})
