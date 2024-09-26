import { ref, computed, watch, nextTick, inject, defineComponent } from 'vue'

import { regionProvinces, regionCities } from '../../formatted'
import { PLACEHOLDER_OTHER_CITIES, injectKeySelector } from '../../constants'
import {
  getLanguage, isSelected, keysEqualModels, inputFocus
} from '../../core/helper'
import { mergeDropdownProps, mergeEmits } from '../../core/options'

import CityPicker from './CityPicker'
import DropdownContainer from '../../components/DropdownContainer'
import DropdownTrigger from '../../components/DropdownTrigger'

export default defineComponent({
  name: 'RegionCityPicker',
  props: mergeDropdownProps({
    modelValue: { type: Array, default: () => [] },
    /**
     * 按钮中显示选中城市模式
     * true: 显示所有选中城市名称
     * false: 选中的城市多于两个时，仅显示前两个城市名称，其他城市会被收起
     */
    overflow: { type: Boolean, default: false }
  }),
  emits: mergeEmits(['visible-change']),
  setup (props, { emit }) {
    const lang = getLanguage(props.language)
    const picker = ref()
    const selected = ref([])

    const maxDisplayCities = 2

    /**
     * 数据列表格式
     * [{
     *   province: { key: string, value: string},
     *   cities: { key: string, value: string }[]
     * }]
     */
    const selectedText = computed(() => {
      const values = selected.value.map(val => val.value)

      if (props.overflow || selected.value.length <= maxDisplayCities) {
        return values.join(',')
      }

      const othersLength = selected.value.length - maxDisplayCities
      const others = lang.others.replace(PLACEHOLDER_OTHER_CITIES, othersLength)
      return values.slice(0, maxDisplayCities).join(',') + `,${others}`
    })

    const handleValueChange = values => {
      if (!Array.isArray(values) || keysEqualModels(values, selected.value)) return

      if (values.length) {
        const provincialCities = regionProvinces.filter(item => values.includes(item.key))
        // marge provinces and cities
        selected.value = [
          ...provincialCities,
          ...regionCities.filter(item => values.includes(item.key))
        ]
      } else {
        selected.value = []
      }

      emitData(false)
    }

    watch(() => props.modelValue, handleValueChange, { immediate: true })

    function searchFocus () {
      nextTick(() => {
        inputFocus(picker.value.search)
      })
    }
    function emitData (updateModelValue = true) {
      if (updateModelValue) {
        emit('update:modelValue', selected.value.map(val => val.key))
      }
      emit('change', selected.value)
    }

    function dropdownVisibleChange (val) {
      emit('visible-change', val)

      if (!val) return

      searchFocus()
    }
    function RegionCityPicker () {
      const { adjustDropdown } = inject(injectKeySelector)

      function selectCity (item) {
        if (isSelected(item, selected.value)) {
          selected.value.splice(
            selected.value.findIndex(val => val.key === item.key),
            1
          )
        } else {
          selected.value.push(item)
        }
        emitData()
        nextTick(() => adjustDropdown())
      }
      function removeAll () {
        selected.value = []
        emitData()
        nextTick(() => adjustDropdown())
      }

      return (
        <CityPicker
          ref={picker}
          selected={selected.value}
          onSelect={selectCity}
          onAdjust={adjustDropdown}
          onReset={removeAll}
        />
      )
    }

    return () => (
      <DropdownContainer
        {...props}
        onVisibleChange={dropdownVisibleChange}
      >{{
        trigger: () => (
          <DropdownTrigger>
            {selectedText.value || lang.pleaseSelect}
          </DropdownTrigger>
        ),
        default: () => <RegionCityPicker />
      }}</DropdownContainer>
    )
  }
})
