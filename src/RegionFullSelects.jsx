import './styles/select.sass'

import { defineComponent } from 'vue'

import RegionLevelTown from './modules/select/SelectLevelTown'
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
