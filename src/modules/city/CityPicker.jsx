import '../../styles/city.sass'

import { ref, nextTick, defineComponent } from 'vue'

import { cityDirectory } from '../../core/parse'
import { isSelected } from '../../core/helper'

import IconSearch from '../../icons/IconSearch.vue'
import IconTrash from '../../icons/IconTrash.vue'

export default defineComponent({
  name: 'CityPicker',
  props: {
    selected: { type: Array, default: undefined }
  },
  emits: ['adjust', 'select', 'reset'],
  setup (props, { emit, expose }) {
    // 完整的城市列表（基于省份进行分组）
    const fullCityDirectory = cityDirectory()

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
          const cities = val.cities.filter(city => (
            new RegExp(value).test(city.value)
          ))
          cities.length && result.push({ province: val.province, cities })
        })
        list.value = result
      } else {
        list.value = fullCityDirectory
      }
      nextTick(() => emit('adjust'))
    }
    function removeAllCities () {
      if (!props.selected.length) return
      emit('reset')
    }

    expose({ search })

    return () => {
      // 基于省份分组的城市列表
      const provinces = list.value.map(val => {
        const { province, cities } = val
        const cityList = cities.map(city => (
          <div
            class={['rg-picker__city', { selected: isSelected(city, props.selected) }]}
            key={city.key}
            onClick={() => emit('select', city)}
          >
            {city.value}
          </div>
        ))

        return (
          <div class='rg-picker__province' key={province.key}>
            <div class='rg-picker__title'>{province.value}</div>
            <div class='rg-picker__body'>{cityList}</div>
          </div>
        )
      })

      return (
        <div class='rg-city-picker'>
          <div class='rg-search-bar'>
            <div class='rg-search-input'>
              <IconSearch />
              <input
                ref={search}
                type='text'
                autocomplete='off'
                onInput={e => query(e.target.value.trim())}
              />
            </div>
            <div
              class={['rg-icon-btn', { disabled: !props.selected.length }]}
              onClick={removeAllCities}
            >
              <IconTrash />
            </div>
          </div>
          <div class='rg-picker'>
            {provinces}
          </div>
        </div>
      )
    }
  }
})
