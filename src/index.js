import './styles/region.sass'

import RegionGroupCore from './modules/group/GroupCore'
import RegionFullGroupCore from './modules/group/FullGroupCore'

import RegionSelects from './modules/select/RegionSelects'
import RegionFullSelects from './modules/select/RegionFullSelects'

import RegionColumnsCore from './modules/column/ColumnsCore'
import RegionFullColumnsCore from './modules/column/FullColumnsCore'

import RegionCityPicker from './modules/city/CityPicker'

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
  app.component('VRegionGroup', RegionGroupCore)
  app.component('VRegionSelects', RegionSelects)
  app.component('VRegionColumns', RegionColumnsCore)
  app.component('VRegionCityPicker', RegionCityPicker)
  app.component('VRegionText', RegionText)
}

export {
  RegionSelects,
  RegionFullSelects,
  RegionGroupCore,
  RegionFullGroupCore,
  RegionColumnsCore,
  RegionFullColumnsCore,
  RegionCityPicker,
  RegionText,
  RegionFullText,

  RegionDropdown
}

export default Region
