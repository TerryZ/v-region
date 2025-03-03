import { inject, ref } from 'vue'

import { injectKeyCore, injectKeyBase } from '../../constants'
import { scrollIntoElement } from '../../core/helper'

import IconChevronRight from '../../icons/IconChevronRight.vue'

export default {
  name: 'RegionColumn',
  props: {
    level: { type: String, default: '' }
  },
  setup (props) {
    const { level } = props
    const { data, setLevel, getNextLevel, isComplete } = inject(injectKeyCore)
    const {
      selectionComplete, setLevelListScroll
    } = inject(injectKeyBase)
    const regionLevel = data.value[level]
    const root = ref()

    function setColumnsLevel (item) {
      setLevel(level, item)
      if (isComplete.value) selectionComplete()
    }

    // 提交滚动处理至父组件进行注册
    setLevelListScroll(() => scrollIntoElement(root.value, '.selected'))

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
      return <ul ref={root} class='rg-column'>{items}</ul>
    }
  }
}
