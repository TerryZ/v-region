// import './styles/icons.sass'
import './styles/city.sass'

import selector from './mixins/selector'

import language, { CN } from './language'
import { regionProvinces, regionCities } from './formatted'
import { PLACEHOLDER_OTHER_CITIES } from './constants'
import { keysEqualModels, isSelected, inputFocus } from './utils/helper'
import { cityDirectory } from './utils/parse'

const maxDisplayCitys = 2
// 完整的城市列表（基于省份进行分组）
const fullCityDirectory = cityDirectory()

export default {
  name: 'CityPicker',
  mixins: [selector],
  props: {
    value: Array,
    /**
     * 按钮中显示选中城市模式
     * true: 显示所有选中城市名称
     * false: 选中的城市多于两个时，仅显示前两个城市名称，其他城市会被收起
     */
    overflow: { type: Boolean, default: false },
    language: { type: String, default: CN }
  },
  data () {
    return {
      /**
       * 数据列表格式
       * [{
       *   province: { key: string, value: string},
       *   citys: { key: string, value: string }[]
       * }]
       */
      list: fullCityDirectory,
      picked: []
    }
  },
  computed: {
    selectedText () {
      const { picked, overflow } = this
      const values = picked.map(val => val.value)

      if (overflow || picked.length <= maxDisplayCitys) {
        return values.join(',')
      }

      const lang = language[this.language.toLowerCase()]
      const othersLength = picked.length - maxDisplayCitys
      const others = lang.others.replace(PLACEHOLDER_OTHER_CITIES, othersLength)
      return values.slice(0, maxDisplayCitys).join(',') + `,${others}`
    }
  },
  watch: {
    // 初始化数据
    value: {
      handler (val) {
        if (!Array.isArray(val) || keysEqualModels(val, this.picked)) return

        if (val.length) {
          const provincialCity = regionProvinces.filter(item => val.includes(item.key))
          // marge province and city
          this.picked = [
            ...provincialCity,
            ...regionCities.filter(item => val.includes(item.key))
          ]
        } else {
          this.picked = []
        }

        this.emit(false)
      },
      immediate: true
    }
  },
  render (h) {
    const contents = []

    contents.push(this.buildCaller())

    // 搜索栏
    const search = h('input', {
      ref: 'search',
      class: 'rg-input',
      attrs: {
        type: 'text',
        autocomplete: 'off'
      },
      on: {
        input: e => this.query(e.target.value.trim())
      }
    })
    contents.push(h('div', { class: 'rg-search-bar' }, [search]))

    // 基于省份分组的城市列表
    const provinces = this.list.map(val => {
      const { province, citys } = val
      const listItems = citys.map(city => {
        const liOption = {
          key: city.key,
          class: {
            selected: isSelected(city, this.picked)
          },
          on: {
            click: () => {
              this.pick(city)
            }
          }
        }
        return h('li', liOption, city.value)
      })
      const ul = h('ul', listItems)

      return h('div', {
        key: province.key,
        class: 'rg-picker__row'
      }, [
        h('dl', [
          h('dt', province.value),
          h('dd', [ul])
        ])
      ])
    })
    contents.push(h('div', { class: 'rg-picker' }, provinces))

    return this.buildDropdown(contents)
  },
  methods: {
    /**
     * @override
     */
    clear () {
      this.picked = []
      this.close()
      this.emit()
    },
    /**
     * @override
     */
    searchFocus () {
      this.$nextTick(() => {
        inputFocus(this.$refs.search)
      })
    },
    /**
     * @override
     * @returns {string}
     */
    getSelectedText () {
      return this.selectedText
    },
    emit (input = true) {
      if (input) this.$emit('input', this.picked.map(val => val.key))
      this.$emit('change', this.picked)
    },
    pick (item) {
      if (isSelected(item, this.picked)) {
        this.picked.splice(this.picked.findIndex(val => val.key === item.key), 1)
      } else {
        this.picked.push(item)
      }
      this.emit()
      this.adjust()
    },
    /**
     * 城市快速搜索
     *
     * 搜索顺序
     * 1. 城市名称
     * 2. 城市编码
     */
    query (value) {
      if (value) {
        const list = []
        fullCityDirectory.forEach(val => {
          const citys = val.citys.filter(city => new RegExp(value).test(city.value))
          if (citys.length) list.push({ province: val.province, citys })
        })
        this.list = list
      } else {
        this.list = fullCityDirectory
      }
      this.adjust()
    }
  }
}
