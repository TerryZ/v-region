import { inject, computed } from 'vue'

import { injectKeySelector } from '../constants'
import { getLanguage, getModelText } from '../core/helper'

export default {
  name: 'DropdownTrigger',
  props: {
    /** Region data model */
    region: { type: Object, default: undefined },
    language: { type: String, default: '' }
  },
  setup (props) {
    const { dropdownVisible } = inject(injectKeySelector)
    const lang = getLanguage(props.language)
    const regionText = computed(() => getModelText(props.region))

    const ButtonText = () => regionText.value || lang.pleaseSelect
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
