import '../styles/icons.styl'
import '../styles/column.styl'

import dropDown from 'v-dropdown'
import data from '../mixins/data'
import method from '../mixins/method'
import selector from '../mixins/selector'
import column from './Column'

import { PROVINCE_LEVEL } from '../constants.js'

export default {
  name: 'ColumnGroup',
  mixins: [data, method, selector],
  inheritAttrs: false,
  components: {
    dropdown: dropDown,
    'v-column': column
  },
  render (h) {
    const child = []

    child.push(this.buildCaller(h))

    const column = []
    // province
    column.push(h(...this.build({
      list: this.listProvince,
      haveChild: this.city,
      value: this.region.province,
      callback: val => {
        this.region.province = val
      }
    })))
    // city
    if (this.listCity.length) {
      column.push(h(...this.build({
        list: this.listCity,
        haveChild: this.area,
        value: this.region.city,
        callback: val => {
          this.region.city = val
        }
      })))
    }
    // area
    if (this.listArea.length) {
      column.push(h(...this.build({
        list: this.listArea,
        haveChild: this.town,
        value: this.region.area,
        callback: val => {
          this.region.area = val
        }
      })))
    }
    // town
    if (this.listTown.length) {
      column.push(h(...this.build({
        list: this.listTown,
        haveChild: false,
        value: this.region.town,
        callback: val => {
          this.region.town = val
        }
      })))
    }

    child.push(h('div', { class: 'rg-column-container' }, column))

    return h('dropdown', {
      ref: 'drop',
      props: {
        border: false
      },
      on: {
        show: this.showChange
      }
    }, child)
  },
  methods: {
    build ({ list, haveChild, value, callback }) {
      return ['v-column', {
        props: {
          list: list,
          haveChild: haveChild,
          value: value
        },
        on: {
          input: val => {
            callback(val)
            this.change()
            this.adjust()
            if (this.isDone()) this.close()
          }
        }
      }]
    },
    isDone () {
      return this.availableLevels.join(',') === this.currentLevels.join(',')
    },
    clear () {
      this.clearRegion(PROVINCE_LEVEL)
      this.change()
      this.close()
    }
  }
}
