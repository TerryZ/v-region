import RegionDropdown from '../../modules/RegionDropdown'

import { RegionGroup, RegionColumns, RegionCityPicker } from '../../'

export function RegionGroupDropdown (props) {
  return (
    <RegionDropdown>
      <RegionGroup {...props} />
    </RegionDropdown>
  )
}

export function RegionColumnsDropdown (props) {
  return (
    <RegionDropdown>
      <RegionColumns {...props} />
    </RegionDropdown>
  )
}

export function RegionCityPickerDropdown (props) {
  return (
    <RegionDropdown>
      <RegionCityPicker {...props} />
    </RegionDropdown>
  )
}
