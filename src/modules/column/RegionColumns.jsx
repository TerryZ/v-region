import { defineComponent } from 'vue'
import RegionColumnsCore from './ColumnsCore'

import { defineRegionColumns } from './RegionColumnsBase'

export default defineComponent(
  defineRegionColumns('RegionColumns', RegionColumnsCore)
)
