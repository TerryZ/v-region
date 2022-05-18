import '../styles/icons.styl'
import '../styles/column.styl'

import RegionColumn from './Column'

import data from '../mixins/data'
import method from '../mixins/method'

/**
 * 级联数据列核心模块
 */
export default {
  name: 'Columns',
  mixins: [data, method],
  inheritAttrs: false,
  components: {
    RegionColumn
  },
  render (h) {
    const { region, buildColumn, listProvince, listCity, listArea, listTown } = this
    const columns = []
    // province
    columns.push(buildColumn({
      list: listProvince,
      haveChild: this.city,
      value: region.province,
      callback: val => { this.region.province = val }
    }))
    // city
    if (listCity.length) {
      columns.push(buildColumn({
        list: listCity,
        haveChild: this.area,
        value: region.city,
        callback: val => { this.region.city = val }
      }))
    }
    // area
    if (listArea.length) {
      columns.push(buildColumn({
        list: listArea,
        haveChild: this.town,
        value: region.area,
        callback: val => { this.region.area = val }
      }))
    }
    // town
    if (listTown.length) {
      columns.push(buildColumn({
        list: listTown,
        haveChild: false,
        value: region.town,
        callback: val => { this.region.town = val }
      }))
    }

    return h('div', { class: 'rg-column-container' }, columns)
  },
  methods: {
    buildColumn ({ list, haveChild, value, callback }) {
      return this.$createElement('region-column', {
        props: {
          list,
          haveChild,
          value
        },
        on: {
          input: val => {
            callback(val)
            this.change()
            this.$emit('adjust')
            if (this.isComplete()) {
              this.$emit('complete')
            }
          }
        }
      })
    },
    isComplete () {
      return this.availableLevels.join(',') === this.currentLevels.join(',')
    }
  }
}
