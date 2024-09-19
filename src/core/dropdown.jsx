import { mergeProps, inject } from 'vue'

import { injectKeySelector } from '../constants'
import { CN } from '../language'

import DropdownContainer from '../components/DropdownContainer'
import DropdownTrigger from '../components/DropdownTrigger'

export function createDropdownTrigger (props, slots) {
  const { dropdownVisible, regionModel } = inject(injectKeySelector)
  if (slots.default) {
    return slots.default({
      data: regionModel.value,
      visible: dropdownVisible.value
    })
  }
  return <DropdownTrigger language={props.language} />
}

export function defineRegionSelector (name, RegionCoreComponent) {
  return {
    name,
    inheritAttrs: false,
    // props 必须使用硬编码的对象内容，使用函数构建的对象，会造成 tree-shanking
    // 失效
    props: {
      language: { type: String, default: CN },
      disabled: { type: Boolean, default: false },
      /** 为触发对象添加自定义样式类 */
      customTriggerClass: { type: String, default: '' },
      /** 为下拉容器添加自定义样式类 */
      customContainerClass: { type: String, default: '' }
    },
    emits: ['complete', 'visible-change'],
    setup (props, { emit, slots, attrs }) {
      function TheDropdownTrigger () {
        return createDropdownTrigger(props, slots)
      }
      function RegionCore () {
        const { closeDropdown, adjustDropdown } = inject(injectKeySelector)
        const coreProps = {
          language: props.language,
          onComplete: () => {
            closeDropdown()
            emit('complete')
          },
          onAdjust: adjustDropdown
        }
        return <RegionCoreComponent {...mergeProps(coreProps, attrs)} />
      }

      return () => (
        <DropdownContainer
          {...props}
          onVisibleChange={val => emit('visible-change', val)}
        >{{
          trigger: () => <TheDropdownTrigger />,
          default: () => <RegionCore />
        }}</DropdownContainer>
      )
    }
  }
}
