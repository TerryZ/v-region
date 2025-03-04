import './styles/region.sass'

import RegionGroup from './modules/group/RegionGroup'
import RegionFullGroup from './modules/group/RegionFullGroup'

import RegionSelects from './modules/select/RegionSelects'
import RegionFullSelects from './modules/select/RegionFullSelects'

import RegionColumns from './modules/column/RegionColumns'
import RegionFullColumns from './modules/column/RegionFullColumns'

import RegionCityPicker from './modules/city/RegionCityPicker'

import RegionText from './modules/text/RegionText'
import RegionFullText from './modules/text/RegionFullText'

import RegionDropdown from './modules/RegionDropdown'

export {
  regionFull,
  regionProvinces,
  regionCities,
  regionAreas
} from './formatted'

const Region = {}

Region.install = (app, options = {}) => {
  app.component('VRegionGroup', RegionGroup)
  app.component('VRegionSelects', RegionSelects)
  app.component('VRegionColumns', RegionColumns)
  app.component('VRegionCityPicker', RegionCityPicker)
  app.component('VRegionText', RegionText)
}

export {
  RegionSelects,
  RegionFullSelects,
  RegionGroup,
  RegionFullGroup,
  RegionColumns,
  RegionFullColumns,
  RegionCityPicker,
  RegionText,
  RegionFullText,

  RegionDropdown
}

export default Region
