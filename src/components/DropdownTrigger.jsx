import { inject, computed, withModifiers } from 'vue'

import { injectKeySelector } from '../constants'
import { getLanguage, getRegionText } from '../core/helper'

import IconClose from '../icons/IconClose.vue'

export default {
  name: 'DropdownTrigger',
  props: {
    /** Region complete data */
    region: { type: Object, default: undefined },
    /** User custom trigger by slot */
    customTrigger: { type: Function, default: undefined },
    removeAllSelected: { type: Function, default: undefined }
  },
  setup (props) {
    const { visible, language } = inject(injectKeySelector)
    const lang = getLanguage(language)
    const regionText = computed(() => getRegionText(props.region))
    const handleClear = () => (
      withModifiers(() => (
        props.removeAllSelected && props.removeAllSelected()
      ), ['stop'])
    )
    const ButtonText = () => regionText.value || lang.pleaseSelect
    const ButtonIcon = () => {
      if (regionText.value) {
        return (
          <span
            class='rg-clear-btn'
            title={lang.clear}
            onClick={handleClear}
          >
            <IconClose />
          </span>
        )
      }
      return <span class='rg-caret-down' />
    }
    const TriggerButton = () => {
      if (props.customTrigger) {
        return props.customTrigger({ region: props.region, visible })
      }

      return (
        <button
          type='button'
          class={['rg-default-btn', { 'rg-opened': visible.value }]}
        >
          <ButtonText />
          <ButtonIcon />
        </button>
      )
    }

    return () => <div class='rg-trigger-container'><TriggerButton /></div>
  }
}