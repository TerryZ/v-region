import './styles/city.sass'

import { ref, computed, watch, nextTick, h, defineComponent } from 'vue'
import { CN } from './language'
import { regionProvinces, regionCities } from './formatted'
import { PLACEHOLDER_OTHER_CITIES } from './constants'
import { keysEqualModels, isSelected, inputFocus, useLanguage } from './utils/helper'
import { cityDirectory } from './utils/parse'
import { useDropdown } from './utils/selector'

const maxDisplayCities = 2
// 完整的城市列表（基于省份进行分组）
const fullCityDirectory = cityDirectory()

export default defineComponent({
  name: 'RegionCityPicker',
  props: {
    disabled: { type: Boolean, default: false },
    modelValue: { type: Array, default: () => [] },
    /**
     * 按钮中显示选中城市模式
     * true: 显示所有选中城市名称
     * false: 选中的城市多于两个时，仅显示前两个城市名称，其他城市会被收起
     */
    overflow: { type: Boolean, default: false },
    language: { type: String, default: CN }
  },
  emits: ['update:modelValue', 'change', 'visible-change'],
  setup (props, { emit, expose }) {
    const {
      generateDropdown,
      generateDropdownTriggerButton,
      closeDropdown,
      adjustDropdown
    } = useDropdown(props)
    const lang = useLanguage(props.language)
    const search = ref(null)

    /**
     * 数据列表格式
     * [{
     *   province: { key: string, value: string},
     *   cities: { key: string, value: string }[]
     * }]
     */
    const list = ref(fullCityDirectory)
    const picked = ref([])

    const selectedText = computed(() => {
      const values = picked.value.map(val => val.value)

      if (props.overflow || picked.value.length <= maxDisplayCities) {
        return values.join(',')
      }

      const othersLength = picked.value.length - maxDisplayCities
      const others = lang.others.replace(PLACEHOLDER_OTHER_CITIES, othersLength)
      return values.slice(0, maxDisplayCities).join(',') + `,${others}`
    })

    watch(() => props.modelValue, val => {
      if (!Array.isArray(val) || keysEqualModels(val, picked.value)) return

      if (val.length) {
        const provincialCities = regionProvinces.filter(item => val.includes(item.key))
        // marge provinces and cities
        picked.value = [
          ...provincialCities,
          ...regionCities.filter(item => val.includes(item.key))
        ]
      } else {
        picked.value = []
      }

      emitData(false)
    }, { immediate: true })

    function clear () {
      picked.value = []
      closeDropdown()
      emitData()
    }
    function searchFocus () {
      nextTick(() => {
        inputFocus(search)
      })
    }
    function emitData (updateModelValue = true) {
      if (updateModelValue) {
        emit('update:modelValue', picked.value.map(val => val.key))
      }
      emit('change', picked.value)
    }
    function pick (item) {
      if (isSelected(item, picked.value)) {
        picked.value.splice(picked.value.findIndex(val => val.key === item.key), 1)
      } else {
        picked.value.push(item)
      }
      emitData()
      nextTick(() => {
        adjustDropdown()
      })
    }
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
        adjustDropdown()
      })
    }

    expose({ reset: clear })

    return () => {
      const trigger = generateDropdownTriggerButton(
        undefined, () => {
          return ref({
            regionText: selectedText.value
          })
        }, clear
      )

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
        const items = cities.map(city => {
          const liOption = {
            key: city.key,
            class: {
              selected: isSelected(city, picked.value)
            },
            onClick: () => pick(city)
          }
          return h('li', liOption, city.value)
        })
        const ul = h('ul', items)

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

      const dropdownOption = {
        onVisibleChange (val) {
          emit('visible-change', val)

          if (!val) return

          searchFocus()
        }
      }
      return generateDropdown(
        dropdownOption,
        trigger,
        h('div', { class: 'rg-city-picker' }, contents)
      )
    }
  }
})
