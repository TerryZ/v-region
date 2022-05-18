import selector from '../mixins/selector'

export default {
  name: 'SelectElement',
  mixins: [selector],
  props: {
    list: {
      type: Array,
      required: true
    },
    blankText: String,
    value: Object
  },
  inject: ['disabled', 'blank'],
  computed: {
    content () {
      const { value } = this
      return (value && value.value)
        ? value.value
        : this.blank ? this.blankText : '&nbsp;'
    },
    triggerClasses () {
      return {
        'rg-select__el': true,
        'rg-select__el--active': this.show,
        'rg-select_el--disabled': this.disabled
      }
    }
  },
  render (h) {
    const { value } = this
    const contents = []

    // trigger
    contents.push(h('template', { slot: 'caller' }, [
      h('div', { class: this.triggerClasses }, [
        h('div', { class: 'rg-select__content' }, this.content),
        h('span', { class: 'rg-select__caret' })
      ])
    ]))

    const listItems = this.list.map(val => {
      return h('li', {
        key: val.key,
        class: {
          selected: value && value.key === val.key
        },
        on: {
          click: () => {
            this.pick(val)
          }
        }
      }, val.value)
    })
    // "Please select" option
    if (this.blank) {
      const option = {
        on: {
          click: () => this.pick()
        }
      }
      listItems.unshift(h('li', option, this.blankText))
    }

    contents.push(h('ul', { class: 'rg-select__list' }, listItems))

    return this.buildDropdown(contents, { disabled: this.disabled })
  },
  methods: {
    pick (val) {
      this.$emit('input', val)
      this.close()
    }
  }
}
