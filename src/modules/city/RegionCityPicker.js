import { ref, computed, watch, nextTick, h, defineComponent } from 'vue'
import { regionProvinces, regionCities } from '../../formatted'
import { PLACEHOLDER_OTHER_CITIES } from '../../constants'
import { keysEqualModels, isSelected, inputFocus, useLanguage } from '../../utils/helper'
import { useDropdown } from '../../utils/selector'
import { mergeDropdownProps, mergeEmits } from '../../core/options'
import CityPicker from './CityPicker'

const maxDisplayCities = 2

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
  setup (props, { emit, expose }) {
    const {
      generateDropdown,
      generateDropdownTriggerButton,
      closeDropdown,
      adjustDropdown
    } = useDropdown(props)
    const lang = useLanguage(props.language)
    const picker = ref()
    const selected = ref([])

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

    watch(() => props.modelValue, val => {
      if (!Array.isArray(val) || keysEqualModels(val, selected.value)) return

      if (val.length) {
        const provincialCities = regionProvinces.filter(item => val.includes(item.key))
        // marge provinces and cities
        selected.value = [
          ...provincialCities,
          ...regionCities.filter(item => val.includes(item.key))
        ]
      } else {
        selected.value = []
      }

      emitData(false)
    }, { immediate: true })

    function clear () {
      selected.value = []
      closeDropdown()
      emitData()
    }
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
    function selectCity (item) {
      if (isSelected(item, selected.value)) {
        selected.value.splice(selected.value.findIndex(val => val.key === item.key), 1)
      } else {
        selected.value.push(item)
      }
      emitData()
      nextTick(() => {
        adjustDropdown()
      })
    }

    expose({ reset: clear })

    return () => {
      const trigger = generateDropdownTriggerButton(
        undefined, () => ref({ regionText: selectedText.value }), clear
      )

      const content = h(CityPicker, {
        ref: picker,
        selected: selected.value,
        onSelect: selectCity,
        onAdjustDropdown: adjustDropdown
      })

      const dropdownOption = {
        onVisibleChange (val) {
          emit('visible-change', val)

          if (!val) return

          searchFocus()
        }
      }
      return generateDropdown(dropdownOption, trigger, content)
    }
  }
})
