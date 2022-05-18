import Columns from './components/Columns'
import selector from './mixins/selector'

import { PROVINCE_LEVEL } from './constants.js'
import { CN } from './language'

export default {
  name: 'RegionColumns',
  mixins: [selector],
  components: {
    Columns
  },
  props: {
    language: { type: String, default: CN }
  },
  render (h) {
    const contents = []

    contents.push(this.buildCaller())

    const columnsOption = {
      ref: 'module',
      props: this.$attrs,
      on: {
        ...this.$listeners,
        complete: this.complete,
        adjust: this.adjust
      }
    }
    contents.push(h('columns', columnsOption))

    return this.buildDropdown(contents)
  },
  methods: {
    complete () {
      this.close()
      this.$emit('complete')
    },
    /**
     * @override
     */
    clear () {
      const { module } = this.$refs
      if (module) {
        module.clearRegion(PROVINCE_LEVEL)
        module.change()
      }
      this.close()
    },
    /**
     * @override
     */
    getSelectedText () {
      if (!this.$refs.module) return ''
      return this.$refs.module.selectedText
    }
  }
}
