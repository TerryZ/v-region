import { computed, inject } from 'vue'

import { injectKeySelector, injectKeyProps } from '../../constants'

export default {
  setup (props, { slots }) {
    const { dropdownVisible } = inject(injectKeySelector)
    const { disabled } = inject(injectKeyProps)

    const triggerClasses = computed(() => ({
      'rg-select__el': true,
      'rg-select__el--active': dropdownVisible.value,
      'rg-select__el--disabled': disabled.value
    }))
    return () => (
      <div class={triggerClasses.value}>
        <div class='rg-select__content'>{slots.default()}</div>
        <span class='rg-select__caret' />
      </div>
    )
  }
}
