import { computed, watch, provide, inject, onMounted, toRef } from 'vue'
import { useEvent, useRegionCore } from './region-core'
import { getLanguage, valueEqualToModel, isEmptyValues } from './helper'
import { getEmptyValues } from './parse'
import { PROVINCE, keyCore, keyDropdown } from '../constants'

export function useRegionUI (props, emit, options) {
  const { emitUpdateModelValue, emitUpdateNames, emitChange } = useEvent(emit)
  const { setTriggerText } = inject(keyDropdown, {})
  const lang = getLanguage(props.language)
  const {
    data,
    hasCity, hasArea, hasTown,
    setupTownListLoader,
    resetRegion,
    setRegion, setRegionLevel,
    toValues, toModel, toNames,
    isComplete
  } = useRegionCore(props)
  const regionText = computed(() => toNames().join(props.separator ?? ''))

  watch(() => props.modelValue, valuesChange)
  // 界面渲染完成，乡镇级别挂载完成，执行数据转换与匹配
  onMounted(valuesChange)
  /**
   * 将 `v-model` 输入的值转换为数据模型
   *
   * ```js
   * { // 入参数据模型格式
   *   province: string,
   *   city: string,
   *   area: string,
   *   town: string
   * }
   * { // 数据模型格式
   *   province: { key: string, value: string },
   *   city: { key: string, value: string },
   *   area: { key: string, value: string },
   *   town: { key: string, value: string }
   * }
   * ```
   */
  function valuesChange () {
    if (!props.modelValue || !Object.keys(props.modelValue).length) {
      return setTriggerText?.(lang.pleaseSelect)
    }
    // 值与模型一致，不进行转换
    if (valueEqualToModel(props.modelValue, data.value)) return
    if (isEmptyValues(props.modelValue)) return reset()
    // 提供一个函数入口，在 v-model 值变化处理完成的后续处理
    setRegion(props.modelValue).then(responseChange).then(() => options?.afterModelChange?.())
  }
  function setLevel (level, key) {
    const values = getEmptyValues({ [level]: key })
    return setRegionLevel(level, values).then(responseChange)
  }
  function responseChange () {
    if (!valueEqualToModel(props.modelValue, data.value)) {
      emitUpdateModelValue(toValues())
    }
    emitChange(toModel())
    emitUpdateNames(toNames())
    // 将数据模型传递给 dropdown 用于 trigger 的选中内容展示
    setTriggerText?.(regionText.value || lang.pleaseSelect)
  }
  function reset () {
    resetRegion(PROVINCE)
    responseChange()
  }

  provide(keyCore, {
    disabled: toRef(props, 'disabled'),
    data,
    lang,
    isComplete,
    hasCity,
    hasArea,
    hasTown,
    setLevel,
    setupTownListLoader
  })

  return {
    data,
    lang,
    isComplete,
    regionText,
    hasCity,
    hasArea,
    hasTown,
    reset,
    setLevel,
    setupTownListLoader
  }
}
