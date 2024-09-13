import { defineComponent } from 'vue'

import RegionGroupCore from './GroupCore'
import { defineRegionGroup } from './RegionGroupBase'

export default defineComponent(
  defineRegionGroup('RegionGroup', RegionGroupCore)
)
