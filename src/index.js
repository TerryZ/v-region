import './styles/region.sass'

import RegionGroupCore from './modules/group/GroupCore'
import RegionFullGroupCore from './modules/group/FullGroupCore'
import RegionGroup from './modules/group/RegionGroup'
import RegionFullGroup from './modules/group/RegionFullGroup'
import RegionSelects from './modules/select/RegionSelects'
import RegionFullSelects from './modules/select/RegionFullSelects'
import RegionColumnsCore from './components/Columns'
import RegionColumns from './RegionColumns'
import RegionCityPicker from './modules/city/RegionCityPicker'
import RegionText from './modules/text/RegionText'
import RegionFullText from './modules/text/RegionFullText'

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
  RegionGroupCore,
  RegionFullGroupCore,
  RegionGroup,
  RegionFullGroup,
  RegionSelects,
  RegionFullSelects,
  RegionColumnsCore,
  RegionColumns,
  RegionCityPicker,
  RegionText,
  RegionFullText
}

export default Region
