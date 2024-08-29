import languages, { CN } from '../language'

/**
 * Get language resource by language code
 * @param {string} code - language code
 * @returns {object} language resource
 */
export function getLanguage (lang = CN) {
  const key = String(lang).toLowerCase()

  if (key in languages) return languages[key]

  return languages[CN]
}
export function getRegionText (region, separator = '') {
  if (!region || !Object.keys(region).length) return ''
  return Object.values(region)
    .filter(val => val)
    .map(val => val.value)
    .join(separator)
}
