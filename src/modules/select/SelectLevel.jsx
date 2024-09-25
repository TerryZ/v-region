import { inject, computed, defineComponent, ref, nextTick } from 'vue'

import DropdownContainer from '../../components/DropdownContainer'
import SelectLevelList from './SelectLevelList'
import SelectDropdownTrigger from './SelectDropdownTrigger'

import { injectKeyCore, injectKeyBase } from '../../constants'
import { scrollIntoElement } from '../../core/helper'

export default defineComponent({
  name: 'RegionSelect',
  props: {
    level: { type: String, default: '' }
  },
  setup (props) {
    const { data, disabled, lang } = inject(injectKeyCore)
    const {
      blank,
      customTriggerClass,
      customContainerClass
    } = inject(injectKeyBase)
    const list = ref()

    const blankContent = blank ? lang.pleaseSelect : '&nbsp;'
    const contentText = computed(() => (
      data.value[props.level]?.name || blankContent
    ))

    const handleVisibleChange = val => {
      if (!val) return

      nextTick(() => {
        scrollIntoElement(list.value.$el, '.selected')
      })
    }

    return () => (
      <DropdownContainer
        class='rg-select'
        disabled={disabled.value}
        custom-trigger-class={customTriggerClass}
        custom-container-class={customContainerClass}
        onVisibleChange={handleVisibleChange}
      >{{
        trigger: () => (
          <SelectDropdownTrigger>{contentText.value}</SelectDropdownTrigger>
        ),
        default: () => <SelectLevelList ref={list} level={props.level} />
      }}</DropdownContainer>
    )
  }
})
