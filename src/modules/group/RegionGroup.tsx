import '../../styles/group.sass'

import { ref, defineComponent } from 'vue'
import { useDropdown } from 'v-dropdown'

import { mergeBaseProps, mergeEmits } from '../../core/options'
import { useRegionUI } from '../../core/region-ui'
import { LEVELS, LEVEL_KEYS, PROVINCE } from '../../constants'

import IconTrash from '../../icons/IconTrash.vue'

export default defineComponent({
  name: 'RegionGroup',
  props: mergeBaseProps({
    separator: { type: String, default: '' }
  }),
  emits: mergeEmits(['complete']),
  setup (props, { emit, slots }) {
    const {
      data,
      lang,
      isComplete,
      setLevel,
      regionText,
      reset
    } = useRegionUI(props, emit)
    const { close } = useDropdown()

    const level = ref(PROVINCE)

    function clear () {
      reset()
      level.value = PROVINCE
    }
    async function selectItem (item) {
      if (!level.value) return

      await setLevel(level.value, item.key)

      if (isComplete()) {
        close?.()
        return emit('complete')
      }
      level.value = LEVEL_KEYS.at(LEVEL_KEYS.indexOf(level.value) + 1)
    }
    function isSelected (item) {
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
      const tabs = LEVELS.map(value => {
        if (!data.value[value.level].enable) return null
        return (
          <li
            class={{ active: value.level === level.value }}
            key={value.level}
          >
            <a
              href='javascript:void(0)'
              onClick={() => { level.value = value.level }}
            >
              {value.title}
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
          class={['rg-item', { active: isSelected(val) }]}
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
