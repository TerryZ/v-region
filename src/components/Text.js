import data from '../mixins/data'
import method from '../mixins/method'

/**
 * plain text only
 */
export default {
  name: 'TextRegion',
  mixins: [data, method],
  inheritAttrs: false,
  render (h) {
    return h('span', this.selectedText)
  }
}
