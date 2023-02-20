import './styles/region.sass'

// import RegionGroupCore from './components/Group'
// import RegionGroup from './RegionGroup'
import RegionSelects from './RegionSelects'
import RegionColumnsCore from './components/Columns'
import RegionColumns from './RegionColumns'
// import RegionCityPicker from './RegionCityPicker'
import RegionText from './RegionText'

export {
  regionFull,
  regionProvinces,
  regionCities,
  regionAreas
} from './formatted'

const Region = {}

Region.install = (Vue, options = {}) => {
  // Vue.component('VRegionGroup', RegionGroup)
  Vue.component('VRegionSelects', RegionSelects)
  Vue.component('VRegionColumns', RegionColumns)
  // Vue.component('VRegionCityPicker', RegionCityPicker)
  Vue.component('VRegionText', RegionText)
}

export {
  // RegionGroupCore,
  // RegionGroup,
  RegionSelects,
  RegionColumnsCore,
  RegionColumns,
  // RegionCityPicker,
  RegionText
}

export default Region
