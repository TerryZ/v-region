import './styles/region.styl'

import RegionGroupCore from './components/Group'
import RegionGroup from './RegionGroup'
import RegionSelects from './RegionSelects'
import RegionColumnsCore from './components/Columns'
import RegionColumns from './RegionColumns'
import RegionCityPicker from './RegionCityPicker'
import RegionText from './RegionText'

export {
  regionFull,
  regionProvinces,
  regionCities,
  regionAreas
} from './formatted'

const Region = {}

Region.install = (Vue, options = {}) => {
  Vue.component('v-region-group', RegionGroup)
  Vue.component('v-region-selects', RegionSelects)
  Vue.component('v-region-columns', RegionColumns)
  Vue.component('v-region-city-picker', RegionCityPicker)
  Vue.component('v-region-text', RegionText)
}

export {
  RegionGroupCore,
  RegionGroup,
  RegionSelects,
  RegionColumnsCore,
  RegionColumns,
  RegionCityPicker,
  RegionText
}

export default Region
