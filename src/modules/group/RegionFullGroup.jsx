import { defineComponent } from 'vue'

import RegionFullGroupCore from './FullGroupCore'
import { defineRegionGroup } from './RegionGroupBase'

export default defineComponent(
  defineRegionGroup('RegionFullGroup', RegionFullGroupCore)
)
