import { inject, defineComponent } from 'vue'

import { injectKeyCore, KEY_TOWN } from '../../constants'
import { getTowns } from '../../core/helper'

import ColumnsCore from './ColumnsCore'
import ColumnLevel from './ColumnLevel'

export default defineComponent({
  name: 'RegionFullColumnsCore',
  setup () {
    function ColumnsCoreTown () {
      const { hasTown, setupTownListLoader } = inject(injectKeyCore)
      setupTownListLoader(getTowns)

      if (!hasTown.value) return null
      return <ColumnLevel level={KEY_TOWN} />
    }

    return () => (
      <ColumnsCore>
        <ColumnsCoreTown />
      </ColumnsCore>
    )
  }
})
