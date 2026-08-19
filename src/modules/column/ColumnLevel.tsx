import { inject, ref, toRef } from 'vue'

import { keyCore, keyInternal } from '../../constants'
import { scrollIntoElement } from '../../core/helper'

import IconChevronRight from '../../icons/IconChevronRight.vue'

export default {
  name: 'RegionColumn',
  props: {
    level: { type: String, default: '' },
    hasNext: { type: Boolean, default: false }
  },
  setup (props) {
    const hasNext = toRef(props, 'hasNext')
    const { data, setLevel, isComplete } = inject(keyCore)
    const { selectionComplete, setLevelListScroll } = inject(keyInternal)
    const regionLevel = data.value[props.level]
    const root = ref()

    async function setColumnsLevel (item) {
      await setLevel(props.level, item.key)
      isComplete() && selectionComplete()
    }
    const HasChildIcon = () => hasNext.value ? <IconChevronRight /> : null
    // 提交滚动处理至父组件进行注册
    setLevelListScroll(() => scrollIntoElement(root.value, '.selected'))

    return () => {
      if (!regionLevel.list.length) return null
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
      return <ul ref={root} class='rg-column'>{items}</ul>
    }
  }
}
