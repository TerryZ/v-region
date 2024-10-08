import { inject, computed } from 'vue'

import { injectKeySelector } from '../constants'
import { getLanguage, getModelText } from '../core/helper'

export default {
  name: 'DropdownTrigger',
  props: {
    language: { type: String, default: '' }
  },
  setup (props, { slots }) {
    const { dropdownVisible, regionModel } = inject(injectKeySelector)
    const lang = getLanguage(props.language)
    const regionText = computed(() => getModelText(regionModel.value))

    const ButtonText = () => (
      slots.default ? slots.default() : (regionText.value || lang.pleaseSelect)
    )
    const ButtonIcon = () => <span class='rg-caret-down' />
    const TriggerButton = () => (
      <button
        type='button'
        class={['rg-default-btn', { 'rg-opened': dropdownVisible.value }]}
      >
        <ButtonText />
        <ButtonIcon />
      </button>
    )

    return () => (
      <div class='rg-trigger-container'>
        <TriggerButton />
      </div>
    )
  }
}
