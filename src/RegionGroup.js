import Group from './components/Group'
import { inputFocus } from './utils/helper'
import { PROVINCE_LEVEL } from './constants'

export default {
  name: 'RegionGroup',
  components: {
    Group
  },
  inheritAttrs: false,
  render (h) {
    const contents = []

    contents.push(this.buildCaller())

    const groupOption = {
      ref: 'module',
      props: this.$attrs,
      on: {
        ...this.$listeners,
        complete: this.complete,
        adjust: this.adjust
      }
    }
    contents.push(h('group', groupOption))

    return this.buildDropdown(contents)
  },
  methods: {
    /**
     * 查询输入设置焦点
     * @override
     */
    searchFocus () {
      const { search } = this.$attrs
      if (typeof search !== 'undefined' && !search) return
      if (!this.$refs.module) return
      this.$nextTick(() => {
        inputFocus(this.$refs.module.$refs.search)
      })
    },
    /**
     * 清理数据
     * @override
     */
    clear () {
      const { module } = this.$refs
      if (!module) return

      module.clearRegion(PROVINCE_LEVEL)
      module.level = PROVINCE_LEVEL
      module.change()
    },
    /**
     * @override
     */
    getSelectedText () {
      if (!this.$refs.module) return ''
      return this.$refs.module.selectedText
    },
    complete () {
      this.close()
      this.$emit('complete')
    }
  }
}
