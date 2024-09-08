import { defineComponent, inject } from 'vue'

import { injectKeyCore, injectKeyBase, injectKeySelector } from '../../constants'

export default defineComponent({
  name: 'RegionSelectList',
  props: {
    level: { type: String, default: '' }
  },
  setup (props) {
    const { data, setLevelByModel } = inject(injectKeyCore)
    const { blank, blankText } = inject(injectKeyBase)
    const { closeDropdown } = inject(injectKeySelector)
    const { level } = props

    const selectItem = val => {
      setLevelByModel(level, val)
      closeDropdown()
    }
    const BlankItem = () => {
      if (!blank) return null
      return <li onClick={selectItem}>{blankText}</li>
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
