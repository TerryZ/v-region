import { ref, h, mergeProps } from 'vue'
import Dropdown from 'v-dropdown'
import { useLanguage } from './helper'

export function useDropdown (props, emit) {
  const visible = ref(false)
  const dropdown = ref(null)

  function closeDropdown () {
    dropdown.value && dropdown.value.close()
  }

  function adjustDropdown () {
    dropdown.value && dropdown.value.adjust()
  }

  function generateDropdown (customProps, trigger, contents) {
    const dropdownOption = {
      ref: dropdown,
      border: true,
      disabled: props.disabled,
      onVisibleChange (val) {
        visible.value = val

        // 要求调用的组件需要定义 `visible-change` 事件
        emit('visible-change', val)
        // if (!val) return

        // 打开下拉层时激活查询输入框的焦点
        // const { searchFocus } = this
        // searchFocus && searchFocus()
      }
    }
    return h(Dropdown, mergeProps(dropdownOption, customProps), {
      trigger: () => trigger,
      default: () => contents
    })
  }

  function generateDropdownTriggerButton (slots, data, regionText, clear) {
    const lang = useLanguage(props.language)
    const elements = []

    if ('default' in slots) {
      // scoped slot
      elements.push(slots.default({ region: data, visible }))
    } else {
      const buttonElements = [h('span', regionText?.value || lang.pleaseSelect)]

      if (regionText?.value) { // 清除图标
        const svg = h(
          'svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '16',
            height: '16',
            fill: 'currentColor',
            viewBox: '0 0 16 16'
          },
          h('path', {
            'fill-rule': 'evenodd',
            d: 'M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z'
          })
        )
        const clearOption = {
          class: 'rg-clear-btn',
          title: lang.clear,
          onClick: e => {
            e.stopPropagation()
            clear()
          }
        }
        buttonElements.push(
          h('span', clearOption, svg)
        )
      } else { // 下拉图标
        buttonElements.push(h('span', { class: 'rg-caret-down' }))
      }

      const btnOption = {
        class: {
          'rg-default-btn': true,
          'rg-opened': visible.value
        },
        type: 'button'
      }
      elements.push(h('button', btnOption, buttonElements))
    }

    return h('div', { class: 'rg-trigger-container' }, elements)
  }

  return {
    visible,
    dropdown,
    generateDropdown,
    generateDropdownTriggerButton,
    closeDropdown,
    adjustDropdown
  }
}
