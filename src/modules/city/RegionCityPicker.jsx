import '../../styles/city.sass'

import { ref, watch, defineComponent, inject } from 'vue'

import { regionProvinces, regionCities } from '../../formatted'
import { cityDirectory, modelsToValues, listToText } from '../../core/parse'
import {
  isSelected,
  inputFocus,
  keysEqualModels,
  getLanguage
} from '../../core/helper'
import { mergeEmits } from '../../core/options'
import { CN } from '../../language'
import { injectDropdown } from '../../constants'

import IconSearch from '../../icons/IconSearch.vue'
import IconTrash from '../../icons/IconTrash.vue'

export default defineComponent({
  name: 'RegionCityPicker',
  props: {
    language: { type: String, default: CN },
    modelValue: { type: Array, default: undefined }
  },
  emits: mergeEmits(),
  setup (props, { emit, expose }) {
    // 完整的城市列表（基于省份进行分组）
    const completeCityGroups = cityDirectory()
    const filteredCityGroups = ref(completeCityGroups)
    const lang = getLanguage(props.language)

    const inputRef = ref()
    const selected = ref([])
    const { setTriggerText } = inject(injectDropdown, {})

    watch(() => props.modelValue, modelValueChange, { immediate: true })

    /**
     * 城市快速搜索
     *
     * 搜索顺序
     * 1. 城市名称
     * 2. 城市编码 ？
     */
    function query (value) {
      if (!value) {
        filteredCityGroups.value = completeCityGroups
        return
      }

      const result = []
      completeCityGroups.forEach(val => {
        const cities = val.cities.filter(city => (
          new RegExp(value).test(city.value)
        ))
        cities.length && result.push({ province: val.province, cities })
      })
      filteredCityGroups.value = result
    }
    function cityChange (city) {
      if (selected.value.some(val => val.key === city.key)) {
        selected.value = selected.value.filter(val => val.key !== city.key)
      } else {
        selected.value.push(city)
      }

      emitData()
    }
    // only response for v-model value change
    function modelValueChange (data) {
      if (!Array.isArray(data) || keysEqualModels(data, selected.value)) {
        return
      }

      if (data.length) {
        // 直辖市与城市合并
        const provincialCities = regionProvinces.filter(item => data.includes(item.key))
        selected.value = [
          ...provincialCities,
          ...regionCities.filter(item => data.includes(item.key))
        ]
      } else {
        selected.value = []
      }

      emitData(false)
    }
    function removeAll () {
      selected.value = []
      emitData()
    }
    function emitData (updateModelValue = true) {
      if (updateModelValue) {
        emit('update:modelValue', selected.value.map(val => val.key))
      }
      const names = modelsToValues(selected.value, 'value')
      emit('update:names', names)
      emit('change', selected.value)
      setTriggerText?.(listToText(names, ',') || lang.pleaseSelect)
    }

    function CitySearch () {
      return (
        <div class='rg-search-bar'>
          <div class='rg-search-input'>
            <IconSearch />
            <input
              ref={inputRef}
              type='text'
              autocomplete='off'
              onInput={e => query(e.target.value.trim())}
            />
          </div>
          <div
            class={['rg-icon-btn', { disabled: !selected.value.length }]}
            onClick={removeAll}
          >
            <IconTrash />
          </div>
        </div>
      )
    }
    function CitiesWithProvince () {
      // 基于省份分组的城市列表
      const provinces = filteredCityGroups.value.map(({ province, cities }) => {
        const cityList = cities.map(city => (
          <div
            class={['rg-picker__city', { selected: isSelected(city, selected.value) }]}
            key={city.key}
            onClick={() => cityChange(city)}
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

      return <div class='rg-picker'>{provinces}</div>
    }

    expose({ setInputFocus: () => inputFocus(inputRef?.value) })

    return () => (
      <div class='rg-city-picker'>
        <CitySearch />
        <CitiesWithProvince />
      </div>
    )
  }
})
