import './styles/select.sass'

import { h, provide } from 'vue'
import RegionSelect from './components/Select'
// import data from './mixins/data'
// import method from './mixins/method'
import { useLanguage } from './utils/helper'

export default {
  name: 'RegionSelects',
  props: {
    blank: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false }
  },
  setup (props) {
    const lang = useLanguage()

    provide('disabled', props.disabled)
    provide('blank', props.blank)

    function generateLevel ({ list, model, callback }) {
      return h(RegionSelect, {
        class: 'rg-select',
        blankText: lang.pleaseSelect,
        modelValue: model,
        list,
        onUpdateModelValue: val => {
          console.log('onUpdateModelValue')
          callback(val)
          // this.change()
        }
      })
    }

    return () => {
      const selects = []
      const { province, city, area, town } = this.region

      selects.push(generateLevel({
        list: this.listProvince,
        model: province,
        callback: val => {
          this.region.province = val
        }
      }))

      if (this.city) {
        selects.push(generateLevel({
          list: this.listCity,
          model: city,
          callback: val => {
            this.region.city = val
          }
        }))
      }
      if (this.city && this.area) {
        selects.push(generateLevel({
          list: this.listArea,
          model: area,
          callback: val => {
            this.region.area = val
          }
        }))
      }
      if (this.city && this.area && this.town) {
        selects.push(generateLevel({
          list: this.listTown,
          model: town,
          callback: val => {
            this.region.town = val
          }
        }))
      }

      return h('div', selects)
    }
  }
}
