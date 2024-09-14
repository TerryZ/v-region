import { inject } from 'vue'

import { injectKeyCore, injectKeyBase } from '../../constants'

import IconChevronRight from '../../icons/IconChevronRight.vue'

export default {
  name: 'RegionColumn',
  props: {
    level: { type: String, default: '' }
  },
  setup (props) {
    const { level } = props
    const { data, setLevel, getNextLevel, isComplete } = inject(injectKeyCore)
    const { dropdownAdjust, selectionComplete } = inject(injectKeyBase)
    const regionLevel = data.value[level]

    function setColumnsLevel (item) {
      setLevel(level, item)
      dropdownAdjust()
      if (isComplete.value) selectionComplete()
    }

    return () => {
      const nextLevel = getNextLevel(level)
      function HasChildIcon () {
        if (!nextLevel) return null
        return <IconChevronRight />
      }
      const items = regionLevel.list.map(item => (
        <li
          key={item.key}
          class={regionLevel.key === item.key ? 'selected' : ''}
          onClick={() => setColumnsLevel(item)}
        >
          <span>{item.value}</span>
          <HasChildIcon />
        </li>
      ))
      if (!items.length) return null
      return <ul class='rg-column'>{items}</ul>
    }
  }
}
