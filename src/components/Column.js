import ColumnItem from './ColumnItem'

export default {
  components: {
    ColumnItem
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
    /** 当前选择的项目 */
    value: Object
  },
  render (h) {
    const { value, list, haveChild } = this
    const listItems = list.map(val => {
      const itemOption = {
        key: val.key,
        props: {
          value: val,
          selected: value && val.key === value.key,
          haveChild
        },
        nativeOn: {
          click: () => this.$emit('input', val)
        }
      }
      return h('column-item', itemOption)
    })
    return h('ul', { class: 'rg-column' }, listItems)
  }
}
