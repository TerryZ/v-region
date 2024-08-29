import { ref, h, nextTick } from 'vue'

import { cityDirectory } from '../utils/parse'
import { isSelected } from '../utils/helper'

import '../styles/city.sass'

// 完整的城市列表（基于省份进行分组）
const fullCityDirectory = cityDirectory()

export default {
  name: 'CityPicker',
  props: {
    selected: { type: Array, default: undefined }
  },
  emits: ['adjust-dropdown', 'select'],
  setup (props, { emit, expose }) {
    const search = ref()
    const list = ref(fullCityDirectory)

    /**
     * 城市快速搜索
     *
     * 搜索顺序
     * 1. 城市名称
     * 2. 城市编码
     */
    function query (value) {
      if (value) {
        const result = []
        fullCityDirectory.forEach(val => {
          const cities = val.cities.filter(city => new RegExp(value).test(city.value))
          if (cities.length) {
            result.push({ province: val.province, cities })
          }
        })
        list.value = result
      } else {
        list.value = fullCityDirectory
      }
      nextTick(() => {
        emit('adjust-dropdown')
      })
    }

    expose({ search })

    return () => {
      // 搜索栏
      const searchInput = h('input', {
        ref: search,
        class: 'rg-input',
        type: 'text',
        autocomplete: 'off',
        onInput: e => query(e.target.value.trim())
      })
      const contents = [h('div', { class: 'rg-search-bar' }, searchInput)]

      // 基于省份分组的城市列表
      const provinces = list.value.map(val => {
        const { province, cities } = val
        const cityList = cities.map(city => {
          const liOption = {
            key: city.key,
            class: {
              'rg-picker__city': true,
              selected: isSelected(city, props.selected)
            },
            onClick: () => emit('select', city)
          }
          return h('div', liOption, city.value)
        })

        return h('div', {
          key: province.key,
          class: 'rg-picker__province'
        }, [
          h('div', { class: 'rg-picker__title' }, province.value),
          h('div', { class: 'rg-picker__body' }, cityList)
        ])
      })
      contents.push(h('div', { class: 'rg-picker' }, provinces))

      return h('div', { class: 'rg-city-picker' }, contents)
    }
  }
}
