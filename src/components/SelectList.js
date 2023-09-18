import { h, defineComponent } from 'vue'

export default defineComponent({
  props: {
    list: { type: Object, default: undefined },
    blank: { type: Boolean, default: true },
    selected: { type: Object, default: undefined }
  },
  emits: ['select'],
  setup (props, { emit }) {
    function select (value) {
      emit('select', value)
    }

    return () => {
      const items = props.list.value.map(val => {
        const option = {
          key: val.key,
          class: { selected: props.selected?.key === val.key },
          onClick: () => { select(val) }
        }
        return h('li', option, val.value)
      })

      if (props.blank) { // "Please select" option
        items.unshift(h('li', { onClick: select }, props.blankText))
      }
      return h('ul', { class: 'rg-select__list' }, items)
    }
  }
})
