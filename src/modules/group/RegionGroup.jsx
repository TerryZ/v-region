import { defineComponent } from 'vue'

import RegionGroupCore from './GroupCore'
import { defineRegionSelector } from '../../core/dropdown'

export default defineComponent(
  defineRegionSelector('RegionGroup', RegionGroupCore)
)
