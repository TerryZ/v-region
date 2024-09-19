import { defineComponent } from 'vue'
import RegionColumnsCore from './ColumnsCore'

// import { defineRegionColumns } from './RegionColumnsBase'
import { defineRegionSelector } from '../../core/dropdown'

export default defineComponent(
  defineRegionSelector('RegionColumns', RegionColumnsCore)
)
