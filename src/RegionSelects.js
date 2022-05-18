import './styles/select.styl'

import RegionSelect from './components/Select'
import data from './mixins/data'
import method from './mixins/method'

export default {
  name: 'Selects',
  mixins: [data, method],
  components: {
    RegionSelect
  },
  props: {
    blank: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  provide () {
    return {
      disabled: this.disabled,
      blank: this.blank
    }
  },
  render (h) {
    const selects = []
    const { province, city, area, town } = this.region

    selects.push(this.build({
      list: this.listProvince,
      model: province,
      callback: val => {
        this.region.province = val
      }
    }))

    if (this.city) {
      selects.push(this.build({
        list: this.listCity,
        model: city,
        callback: val => {
          this.region.city = val
        }
      }))
    }
    if (this.city && this.area) {
      selects.push(this.build({
        list: this.listArea,
        model: area,
        callback: val => {
          this.region.area = val
        }
      }))
    }
    if (this.city && this.area && this.town) {
      selects.push(this.build({
        list: this.listTown,
        model: town,
        callback: val => {
          this.region.town = val
        }
      }))
    }

    return h('div', selects)
  },
  methods: {
    build ({ list, model, callback }) {
      return this.$createElement('region-select', {
        class: 'rg-select',
        props: {
          'blank-text': this.lang.pleaseSelect,
          list
        },
        attrs: {
          value: model
        },
        on: {
          input: val => {
            callback(val)
            this.change()
          }
        }
      })
    }
  }
}
