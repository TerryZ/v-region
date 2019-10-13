import dropdown from 'v-dropdown'
import selector from '../mixins/selector'

export default {
  name: 'SelectElement',
  components: { dropdown },
  mixins: [selector],
  props: {
    list: {
      type: Array,
      required: true
    },
    blankText: String,
    value: Object
  },
  data () {
    return {
      selected: this.value
    }
  },
  inject: ['disabled', 'blank'],
  watch: {
    value: {
      handler (val) {
        this.selected = val
      },
      deep: true
    }
  },
  computed: {
    content () {
      return (this.selected && this.selected.value)
        ? this.selected.value
        : this.blank ? this.blankText : '&nbsp;'
    }
  },
  render (h) {
    const child = []

    // trigger
    child.push(h('template', { slot: 'caller' }, [
      h('div', {
        class: {
          'rg-select__el': true,
          'rg-select__el--active': this.show,
          'rg-select_el--disabled': this.disabled
        }
      }, [
        h('div', { class: 'rg-select__content' }, this.content),
        h('span', { class: 'rg-select__caret' })
      ])
    ]))

    const items = []
    // "Please select" option
    if (this.blank) {
      items.push(h('li', {
        on: {
          click: () => {
            this.pick(null)
          }
        }
      }, this.blankText))
    }
    // list item
    items.push(...this.list.map(val => {
      return h('li', {
        key: val.key,
        class: {
          selected: this.selected && this.selected.key === val.key
        },
        on: {
          click: () => {
            this.pick(val)
          }
        }
      }, val.value)
    }))

    child.push(h('ul', { class: 'rg-select__list' }, items))

    return h('dropdown', {
      ref: 'drop',
      class: 'rg-select',
      props: {
        border: false,
        disabled: this.disabled
      },
      on: {
        show: this.showChange
      }
    }, child)
  },
  methods: {
    pick (val) {
      this.selected = val
      this.$emit('input', val)
      this.close()
    }
  }
}
