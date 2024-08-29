import { h } from 'vue'
import ColumnItem from './ColumnItem'

export default {
  name: 'RegionColumn',
  props: {
    list: { type: Object, required: true },
    haveChild: { type: Object, default: undefined },
    /** 当前选择的项目 */
    modelValue: { type: Object, default: undefined }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    return () => {
      const items = props.list.value.map(val => {
        const itemOption = {
          key: val.key,
          modelValue: val,
          selected: props.modelValue && val.key === props.modelValue.key,
          haveChild: props.haveChild,
          onClick: () => emit('update:modelValue', val)
        }
        return h(ColumnItem, itemOption)
      })
      return h('ul', { class: 'rg-column' }, items)
    }
  }
}
