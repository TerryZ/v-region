import { defineComponent } from 'vue'
import RegionFullColumnsCore from './FullColumnsCore'

import { defineRegionColumns } from './RegionColumnsBase'

export default defineComponent(
  defineRegionColumns('RegionFullColumns', RegionFullColumnsCore)
)
