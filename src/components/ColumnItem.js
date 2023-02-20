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
      const contents = [h('span', props.modelValue.value)]

      if (props.haveChild) {
        contents.push(
          h('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '16',
            height: '16',
            fill: 'currentColor',
            viewBox: '0 0 16 16'
          },
          h('path', {
            'fill-rule': 'evenodd',
            d: 'M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'
          })
          )
        )
      }

      const option = {
        class: props.selected ? 'selected' : ''
      }
      return h('li', option, contents)
    }
  }
}
