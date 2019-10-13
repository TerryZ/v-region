export default {
  render (h) {
    return h('ul', { class: 'rg-column' }, this.list.map(val => {
      const child = []
      child.push(h('span', val.value))
      if (this.haveChild) {
        child.push(h('i', { class: 'rg-iconfont rg-icon-right rg-caret-right' }))
      }
      return h('li', {
        key: val.key,
        class: {
          selected: this.value && val.key === this.value.key
        },
        on: {
          click: () => this.click(val)
        }
      }, child)
    }))
  },
  props: {
    list: {
      type: Array,
      required: true
    },
    haveChild: {
      type: Boolean,
      default: true
    },
    value: Object
  },
  methods: {
    click (row) {
      this.$emit('input', row)
    }
  }
}
