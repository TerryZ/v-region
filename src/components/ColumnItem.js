import { h } from 'vue'
import IconChevronRight from '../icons/IconChevronRight.vue'

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
        contents.push(h(IconChevronRight))
      }

      const option = {
        class: props.selected ? 'selected' : ''
      }
      return h('li', option, contents)
    }
  }
}
