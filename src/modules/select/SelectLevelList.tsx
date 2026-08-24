import { ref, defineComponent, inject } from 'vue'
import { useDropdown } from 'v-dropdown'

import { keyCore, keyInternal } from '../../constants'
import { scrollIntoElement } from '../../core/helper'

import type { RegionUIProvide, RegionItem, RegionLevel } from '../../types'

export default defineComponent({
  name: 'RegionSelectList',
  props: {
    level: { type: String, default: '' }
  },
  setup(props, { expose }) {
    const { state, lang, setLevel } = inject(keyCore) as RegionUIProvide
    const { blank } = inject(keyInternal) as { blank: boolean }
    const { close } = useDropdown()
    const list = ref()

    const selectItem = async (item?: RegionItem) => {
      await setLevel(props.level as RegionLevel, item?.key)
      close()
    }
    const scrollToSelectedItem = () => scrollIntoElement(list.value, '.selected')
    const BlankItem = () => {
      if (!blank) return null
      return <li onClick={() => selectItem()}>{lang.pleaseSelect}</li>
    }
    const levelItems = () => {
      const { list, key } = state.value[props.level as RegionLevel]
      return list.map((item) => (
        <li key={item.key} class={{ selected: key === item.key }} onClick={() => selectItem(item)}>
          {item.value}
        </li>
      ))
    }

    expose({ scrollToSelectedItem })

    return () => (
      <ul class="rg-select__list" ref={list}>
        <BlankItem />
        {levelItems()}
      </ul>
    )
  }
})
