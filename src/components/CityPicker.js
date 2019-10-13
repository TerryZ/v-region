import '../styles/icons.styl'
import '../styles/city.styl'

import { srcProvince, srcCity } from '../formatted'
import selector from '../mixins/selector'
import search from '../mixins/selectorWithSearch'
import dropdown from 'v-dropdown'

export default {
  name: 'CityPicker',
  mixins: [search, selector],
  inheritAttrs: false,
  components: { dropdown },
  props: {
    i18n: {
      type: String,
      default: 'cn'
    },
    value: Array
  },
  data () {
    return {
      /**
       * data list to display
       * [{
       *   province: { key: '', value: ''},
       *   citys: [
       *     {key: '', value: ''},
       *     {key: '', value: ''},
       *     ...
       *   ]
       * }]
       */
      list: [],
      // converted data list
      listBuilt: [],
      query: '',
      picked: []
    }
  },
  computed: {
    selectedText () {
      return this.picked.map(val => val.value).join(',')
    }
  },
  watch: {
    /**
     * region search
     * search region description first, if no result, then search region key
     * @param value
     */
    query (value) {
      const keyword = value.trim()
      if (keyword) {
        const list = []
        this.listBuilt.forEach(val => {
          const citys = val.citys.filter(city => new RegExp(keyword).test(city.value))
          if (citys.length) list.push({ province: val.province, citys: citys })
        })
        this.list = list
      } else {
        this.list = this.listBuilt.slice()
      }
    },
    /**
     * initialize selected citys
     */
    value: {
      handler (val) {
        if (Array.isArray(val)) {
          if (this.equal(val)) return

          if (val.length) {
            const provincialCity = srcProvince.filter(item => val.includes(item.key))
            // marge province and city
            this.picked = [
              ...provincialCity,
              ...srcCity.filter(item => val.includes(item.key))
            ]
          } else this.picked = []

          this.emit(false)
        }
      },
      immediate: true
    }
  },
  render (h) {
    const child = []

    child.push(this.buildCaller(h))

    // search bar
    child.push(h('div', { class: 'rg-search-bar' }, [
      h('input', {
        ref: 'search',
        class: 'rg-input',
        attrs: {
          type: 'text',
          autocomplete: 'off'
        },
        domProps: {
          value: this.query.trim()
        },
        on: {
          input: e => {
            this.query = e.target.value.trim()
          }
        }
      })
    ]))

    // province grouped city list
    child.push(h('div', { class: 'rg-picker' }, this.list.map(val => {
      return h('div', {
        class: 'rg-picker__row',
        key: val.province.key
      }, [
        h('dl', [
          h('dt', val.province.value),
          h('dd', [
            h('ul', val.citys.map(city => {
              return h('li', {
                key: city.key,
                class: {
                  selected: this.inPicked(city)
                },
                on: {
                  click: () => {
                    this.pick(city)
                  }
                }
              }, city.value)
            }))
          ])
        ])
      ])
    })))

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
    prepared () {
      // beijing, tianjin, shanghai, chongqing
      const municipalitys = ['110000', '120000', '310000', '500000']
      const municipality = '000000'
      // hongkong, macao
      const specials = ['810000', '820000']
      const special = '000010'
      const listTmp = []
      const municipalityObj = {
        province: { key: municipality, value: '直辖市' },
        citys: []
      }
      const specialObj = {
        province: { key: special, value: '特别行政区' },
        citys: []
      }
      // set provinces
      srcProvince.forEach(val => {
        if (municipalitys.includes(val.key)) municipalityObj.citys.push(val)
        else if (specials.includes(val.key)) specialObj.citys.push(val)
        else listTmp.push({ province: val, citys: [] })
      })
      listTmp.forEach(val => {
        val.citys = srcCity.filter(value => {
          const num = Number.parseInt(val.province.key)
          return (value.key - num) < 1e4 && (value.key % num) < 1e4
        })
      })
      this.listBuilt = [...[municipalityObj], ...listTmp, ...[specialObj]]
    },
    // dropdown position adjust
    adjust () {
      this.$nextTick(() => {
        this.$refs.drop.adjust()
      })
    },
    emit (input = true) {
      if (input) this.$emit('input', this.picked.map(val => val.key))
      this.$emit('values', this.picked)
    },
    /**
     * v-model/value(keys) whether equal to picked keys
     *
     * @param {array} keys
     * @returns
     */
    equal (keys) {
      if (keys.length === this.picked.length) {
        if (!keys.length) return true
        this.picked.forEach(val => {
          if (!keys.includes(val.key)) return false
        })
        return true
      } else return false
    },
    clear () {
      this.picked = []
      this.close()
      this.emit()
    },
    pick (item) {
      if (this.inPicked(item)) {
        this.picked.splice(this.picked.findIndex(val => val.key === item.key), 1)
      } else {
        this.picked.push(item)
      }
      this.emit()
      this.adjust()
    },
    inPicked (city) {
      if (!city || !this.picked.length) return false
      return this.picked.some(val => val.key === city.key)
    }
  },
  created () {
    this.prepared()
    this.list = this.listBuilt.slice()
  }
}
