import './styles/region.styl'
import { SELECT, TEXT, GROUP, COLUMN, CITY } from './constants'

import SelectGroup from './components/SelectGroup'
import TextRegion from './components/Text'
import GroupRegion from './components/Group'
import ColumnGroup from './components/ColumnGroup'
import CityPicker from './components/CityPicker'

export default {
  name: 'v-region',
  components: {
    'r-select': SelectGroup,
    'r-text': TextRegion,
    'r-group': GroupRegion,
    'r-column': ColumnGroup,
    'r-city': CityPicker
  },
  props: {
    type: {
      type: String,
      default: SELECT
    }
  },
  render (h) {
    if (this.type) {
      switch (this.type.toLowerCase()) {
        case TEXT: return this.build(h, 'r-text')
        case SELECT: return this.build(h, 'r-select')
        case COLUMN: return this.build(h, 'r-column')
        case CITY: return this.build(h, 'r-city')
        case GROUP: return this.build(h, 'r-group')
      }
    } else {
      console.error('Please provide selector type.("type" prop of v-region)')
    }
  },
  methods: {
    build (h, name) {
      const slot = []
      const options = {
        class: 'v-region',
        props: this.$attrs,
        on: this.$listeners
      }
      if ('default' in this.$scopedSlots) {
        switch (this.type.toLowerCase()) {
          case COLUMN:
          case GROUP:
            options.scopedSlots = {
              default: props => {
                return this.$scopedSlots.default({
                  region: props.region,
                  show: props.show
                })
              }
            }
            break
          case CITY:
            slot.push(this.$scopedSlots.default())
            break
        }
      }

      return h(name, options, slot)
    }
  }
}
