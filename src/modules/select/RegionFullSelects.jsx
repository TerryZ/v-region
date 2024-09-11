// import '../../styles/region.sass'

import { defineComponent } from 'vue'

import RegionLevelTown from './SelectLevelTown'
import RegionSelects from './RegionSelects'

export default defineComponent({
  name: 'RegionFullSelects',
  setup () {
    return () => (
      <RegionSelects>
        <RegionLevelTown />
      </RegionSelects>
    )
  }
})
