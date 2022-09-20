import { h, ref } from 'vue'
import languages, { CN } from '../language'

const show = ref(false)

function generateTrigger () {
  const caller = []
  const { show, language } = this
  const { module } = this.$refs
  const lang = languages[(language || CN).toLowerCase()]

  if ('default' in this.$scopedSlots) {
    // scoped slot
    const region = module && module.region
    caller.push(this.$scopedSlots.default({ region, show }))
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
        on: {
          click: e => {
            e.stopPropagation()
            this.clear()
          }
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
      attrs: {
        type: 'button'
      }
    }
    caller.push(h('button', btnOption, elements))
  }

  return () => h('template', { slot: 'caller' }, [
    h('div', { class: 'rg-caller-container' }, caller)
  ])
}

function generateDropdown (props, elements) {
  const showChange = val => {
    show.value = val
    if (!val) return

    console.log(val)

    // 打开下拉层时激活查询输入框的焦点
    // const { searchFocus } = this
    // searchFocus && searchFocus()
  }

  const dropdownOption = {
    ref: 'drop',
    props: {
      border: true,
      ...props
    },
    onShow: showChange
  }
  return () => h('dropdown', dropdownOption, elements)
}

export function useDropdown (props, elements) {
  return {
    show,
    trigger: generateTrigger(props),
    dropdown: generateDropdown(props, elements)
  }
}
