import { h } from 'vue'

export default {
  name: 'RegionColumnItem',
  props: {
    modelValue: { type: Object, default: undefined },
    selected: { type: Boolean, default: false },
    haveChild: { type: Boolean, default: true }
  },
  setup (props) {
    return () => {
      const contents = []

      contents.push(h('span', props.modelValue.value))

      if (props.haveChild) {
        const classNames = 'rg-iconfont rg-icon-right rg-caret-right'
        contents.push(h('i', { class: classNames }))
      }

      const option = {
        class: props.selected ? 'selected' : ''
      }
      return h('li', option, contents)
    }
  }
}
