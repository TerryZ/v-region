import { inject, ref, toRef, defineComponent } from 'vue'

import { keyCore, keyInternal } from '../../constants'
import { scrollIntoElement } from '../../composables/helper'

import IconChevronRight from '../../icons/IconChevronRight.vue'

import type { PropType } from 'vue'
import type { RegionLevel, RegionItem, RegionUIProvide } from '../../types'

export default defineComponent({
  name: 'RegionColumn',
  props: {
    level: { type: String as PropType<RegionLevel>, default: '' },
    hasNext: { type: Boolean, default: false }
  },
  setup(props) {
    const hasNext = toRef(props, 'hasNext')
    const { state, setLevel, isComplete } = inject(keyCore) as RegionUIProvide
    const { selectionComplete, setLevelListScroll } = inject(keyInternal) as {
      selectionComplete: () => void
      setLevelListScroll: (fn: () => void) => void
    }
    const regionLevel = state.value[props.level]
    const root = ref()

    async function setColumnsLevel(item: RegionItem) {
      await setLevel(props.level, item.key)
      if (isComplete()) selectionComplete()
    }
    const HasChildIcon = () => (hasNext.value ? <IconChevronRight /> : null)
    // 提交滚动处理至父组件进行注册
    setLevelListScroll(() => scrollIntoElement(root.value, '.selected'))

    return () => {
      if (!regionLevel.list.length) return null
      const items = regionLevel.list.map((item) => (
        <li
          key={item.key}
          class={regionLevel.key === item.key ? 'selected' : ''}
          onClick={() => setColumnsLevel(item)}
        >
          <span>{item.value}</span>
          <HasChildIcon />
        </li>
      ))
      return (
        <ul ref={root} class="rg-column">
          {items}
        </ul>
      )
    }
  }
})
