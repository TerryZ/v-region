import { defineComponent } from 'vue'
import RegionFullColumnsCore from './FullColumnsCore'

// import { defineRegionColumns } from './RegionColumnsBase'
import { defineRegionSelector } from '../../core/dropdown'

export default defineComponent(
  defineRegionSelector('RegionFullColumns', RegionFullColumnsCore)
)
