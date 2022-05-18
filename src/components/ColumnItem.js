export default {
  props: {
    value: { type: Object, default: undefined },
    selected: { type: Boolean, default: false },
    haveChild: { type: Boolean, default: true }
  },
  render (h) {
    const { value, selected, haveChild } = this
    const content = []

    content.push(h('span', value.value))

    if (haveChild) {
      const classNames = 'rg-iconfont rg-icon-right rg-caret-right'
      content.push(h('i', { class: classNames }))
    }

    const itemOption = {
      class: {
        selected
      }
    }
    return h('li', itemOption, content)
  }
}
