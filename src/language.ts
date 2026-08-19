import { PLACEHOLDER_OTHER_CITIES } from './constants'

export const [CN, EN] = ['cn', 'en']

export default {
  [CN]: {
    pleaseSelect: '请选择',
    defaultHead: '行政区划',
    clear: '清除选择的项目',
    noMatch: '无匹配项目',
    others: `与其余${PLACEHOLDER_OTHER_CITIES}个`
  },
  [EN]: {
    pleaseSelect: 'Please select',
    defaultHead: 'Region',
    clear: 'Clear selected region',
    noMatch: 'No matched items',
    others: `and ${PLACEHOLDER_OTHER_CITIES} others`
  }
}
