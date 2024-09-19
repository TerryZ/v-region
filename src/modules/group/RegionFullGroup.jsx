import { defineComponent } from 'vue'

import RegionFullGroupCore from './FullGroupCore'
import { defineRegionSelector } from '../../core/dropdown'

export default defineComponent(
  defineRegionSelector('RegionFullGroup', RegionFullGroupCore)
)
