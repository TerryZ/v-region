import { ref, h, mergeProps } from 'vue'
import Dropdown from 'v-dropdown'
import languages, { CN } from '../language'

export function useDropdown () {
  const visible = ref(false)
  const dropdown = ref(null)

  function closeDropdown () {
    dropdown.value && dropdown.value.close()
  }

  function adjustDropdown () {
    dropdown.value && dropdown.value.adjust()
  }

  function generateDropdown (contents, props) {
    const dropdownOption = {
      ref: 'dropdown',
      border: true,
      onVisibleChange (val) {
        visible.value = val
        // if (!val) return

        // 打开下拉层时激活查询输入框的焦点
        // const { searchFocus } = this
        // searchFocus && searchFocus()
      }
    }
    return h(Dropdown, mergeProps(dropdownOption, props), contents)
  }

  function generateDropdownTrigger (contents) {
    return h('template', { slot: 'trigger' }, contents)
  }

  function generateDropdownTriggerButton (slots) {
    const trigger = []
    const { show, language } = this
    const { module } = this.$refs
    const lang = languages[(language || CN).toLowerCase()]

    if ('default' in slots) {
      // scoped slot
      const region = module && module.region
      trigger.push(slots.default({ region, show }))
    } else {
      const elements = []
      const selectedText = this.getSelectedText()
      elements.push(h('span', selectedText || lang.pleaseSelect))

      if (selectedText) {
        // 清除图标
        const clearOption = {
          class: 'rg-iconfont rg-icon-clear rg-clear-btn',
          attrs: {
            title: lang.clear
          },
          onClick: e => {
            e.stopPropagation()
            this.clear()
          }
        }
        elements.push(h('span', clearOption))
      } else {
        // 下拉图标
        elements.push(h('span', { class: 'rg-caret-down' }))
      }

      const btnOption = {
        class: {
          'rg-default-btn': true,
          'rg-opened': show
        },
        type: 'button'
      }
      trigger.push(h('button', btnOption, elements))
    }

    return h('template', { slot: 'trigger' }, [
      h('div', { class: 'rg-trigger-container' }, trigger)
    ])
  }

  return {
    visible,
    dropdown,
    generateDropdown,
    generateDropdownTrigger,
    generateDropdownTriggerButton,
    closeDropdown,
    adjustDropdown
  }
}
