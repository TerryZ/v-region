import './styles/region.sass'

import RegionGroupCore from './modules/group/GroupCore'
import RegionFullGroupCore from './modules/group/FullGroupCore'
import RegionGroup from './modules/group/RegionGroup'
import RegionFullGroup from './modules/group/RegionFullGroup'

import RegionSelects from './modules/select/RegionSelects'
import RegionFullSelects from './modules/select/RegionFullSelects'

// import RegionColumnsCore from './modules/column/ColumnsCore'
// import RegionFullColumnsCore from './modules/column/FullColumnsCore'
// import RegionColumns from './modules/column/RegionColumns'
// import RegionFullColumns from './modules/column/RegionFullColumns'

// import RegionCityPicker from './modules/city/RegionCityPicker'

// import RegionText from './modules/text/RegionText'
// import RegionFullText from './modules/text/RegionFullText'

export {
  regionFull,
  regionProvinces,
  regionCities,
  regionAreas
} from './formatted'

const Region = {}

Region.install = (app, options = {}) => {
  // app.component('VRegionGroup', RegionGroup)
  // app.component('VRegionSelects', RegionSelects)
  // app.component('VRegionColumns', RegionColumns)
  // app.component('VRegionCityPicker', RegionCityPicker)
  // app.component('VRegionText', RegionText)
}

export { RegionFullGroup }

export {
  RegionGroupCore,
  RegionFullGroupCore,
  RegionGroup,
  // RegionFullGroup,
  RegionSelects,
  RegionFullSelects
  // RegionColumnsCore,
  // RegionFullColumnsCore,
  // RegionColumns,
  // RegionFullColumns,
  // RegionCityPicker
  // RegionText,
  // RegionFullText
}

export default Region
