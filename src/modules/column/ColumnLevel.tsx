import { inject, ref, toRef, defineComponent } from 'vue'

import { keyCore, keyInternal, LEVELS } from '../../constants'
import { scrollIntoElement } from '../../composables/helper'

import IconChevronRight from '../../icons/IconChevronRight.vue'

import type { PropType, Ref } from 'vue'
import type { RegionLevel, RegionItem, RegionUIProvide } from '../../types'

export default defineComponent({
  name: 'RegionColumn',
  props: {
    level: { type: String as PropType<RegionLevel>, default: '' },
    hasNext: { type: Boolean, default: false }
  },
  setup(props, { slots }) {
    const hasNext = toRef(props, 'hasNext')
    const { state, setLevel, isComplete } = inject(keyCore) as RegionUIProvide
    const { selectionComplete, setLevelListScroll, header } = inject(keyInternal) as {
      header: Ref<boolean>
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

    function ColumnHeader() {
      const levelModel = LEVELS.find((val) => val.level === props.level)
      return (
        <div class="rg-column__header rg-flex rg-align-center rg-justify-between rg-gap">
          {levelModel?.title}
          {slots.default?.()}
        </div>
      )
    }

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
        <div>
          {header.value && <ColumnHeader />}
          <ul ref={root} class="rg-column">
            {items}
          </ul>
        </div>
      )
    }
  }
})
