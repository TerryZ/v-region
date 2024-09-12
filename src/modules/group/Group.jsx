import '../styles/group.sass'

import { ref, nextTick, onMounted, defineComponent } from 'vue'

import { mergeBaseProps, mergeEmits } from '../../core/options'
import { useRegion } from '../../core/base'
import { LEVELS, KEY_PROVINCE } from '../../constants'

import IconTrash from '../icons/IconTrash.vue'

export default defineComponent({
  name: 'RegionGroupCore',
  props: mergeBaseProps(),
  emits: mergeEmits(['adjust', 'complete']),
  setup (props, { emit, expose }) {
    const {
      data,
      lang,
      availableLevels,
      setLevel,
      regionText,
      reset,
      getLevelList
    } = useRegion(props, emit)

    const level = ref()

    function getNextLevel () {
      if (!level.value) return
      const index = availableLevels.value.findIndex(val => val === level.value)

      return index < (availableLevels.value.length - 1)
        ? availableLevels.value[index + 1]
        : undefined
    }
    function clear () {
      reset()
      level.value = KEY_PROVINCE
      emit('adjust')
    }
    function pick (item) {
      if (!level.value) return

      setLevel(level.value, item)

      const next = getNextLevel()
      if (!next) {
        emit('complete')
        return
      }
      level.value = next
      nextTick(() => { emit('adjust') })
    }
    function match (item) {
      if (!item) return false
      if (!level.value) return false
      return data[level.value]?.key === item.key
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
      const tabs = availableLevels.value.map(val => {
        const levelItem = LEVELS.find(value => value.key === val)
        return (
          <li
            class={{ active: levelItem.key === level.value }}
            key={levelItem.key}
          >
            <a
              href='javascript:void(0)'
              onClick={() => { level.value = levelItem.key }}
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
      const items = getLevelList(level.value)

      const levelItems = items.value.map(val => (
        <li
          key={val.key}
          class={{ 'rg-item': true, active: match(val) }}
          onMouseup={() => pick(val)}
        >{val.value}</li>
      ))
      const ContentMessageBox = () => {
        if (!items.value.length) return null
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

    onMounted(() => { level.value = KEY_PROVINCE })

    expose({ region: data, reset, regionText })

    return () => (
      <div class='rg-group'>
        <GroupHeader />
        <GroupTabs />
        <GroupContent />
      </div>
    )
  }
})
