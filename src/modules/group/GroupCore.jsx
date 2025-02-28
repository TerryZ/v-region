import '../../styles/group.sass'

import { ref, defineComponent } from 'vue'

import { mergeBaseProps, mergeEmits } from '../../core/options'
import { useRegion } from '../../core/base'
import { LEVELS, KEY_PROVINCE } from '../../constants'

import IconTrash from '../../icons/IconTrash.vue'

export default defineComponent({
  name: 'RegionGroupCore',
  props: mergeBaseProps(),
  emits: mergeEmits(['complete']),
  setup (props, { emit, slots }) {
    const {
      data,
      lang,
      availableLevels,
      getNextLevel,
      setLevel,
      regionText,
      reset
    } = useRegion(props, emit)

    const level = ref(KEY_PROVINCE)

    function clear () {
      reset()
      level.value = KEY_PROVINCE
    }
    async function selectItem (item) {
      if (!level.value) return

      await setLevel(level.value, item)

      const next = getNextLevel(level.value)

      if (!next) return emit('complete')

      level.value = next
    }
    function isMatch (item) {
      if (!item) return false
      if (!level.value) return false
      return data.value[level.value]?.key === item.key
    }

    function GroupHeader () {
      const title = regionText.value || lang.defaultHead

      return (
        <div class='rg-header'>
          <div class='rg-header-text' title={title}>{title}</div>
          <div class='rg-header-control'>
            <button type='button' title={lang.clear} onClick={clear}>
              <IconTrash />
            </button>
          </div>
        </div>
      )
    }
    function GroupTabs () {
      const switchLevel = (item) => { level.value = item.key }
      const tabs = availableLevels.value.map(val => {
        const levelItem = LEVELS.find(value => value.key === val)
        return (
          <li
            class={{ active: levelItem.key === level.value }}
            key={levelItem.key}
          >
            <a
              href='javascript:void(0)'
              onClick={() => switchLevel(levelItem)}
            >
              {levelItem.title}
            </a>
          </li>
        )
      })
      return (
        <div class='rg-level-tabs'>
          <ul>{tabs}</ul>
        </div>
      )
    }
    function GroupContent () {
      const list = data.value[level.value]?.list

      const levelItems = list.map(val => (
        <li
          key={val.key}
          class={['rg-item', { active: isMatch(val) }]}
          onMouseup={() => selectItem(val)}
        >{val.value}</li>
      ))
      const ContentMessageBox = () => {
        if (list.length) return null
        return <li class='rg-message-box'>{lang.noMatch}</li>
      }

      return (
        <div class='rg-results-container'>
          <ul class='rg-results'>
            {levelItems}
            <ContentMessageBox />
          </ul>
        </div>
      )
    }

    return () => (
      <div class='rg-group'>
        <GroupHeader />
        <GroupTabs />
        <GroupContent />
        {slots.default?.()}
      </div>
    )
  }
})
