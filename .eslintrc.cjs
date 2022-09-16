/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

const path = require('node:path')
const createAliasSetting = require('@vue/eslint-config-standard/createAliasSetting')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-strongly-recommended',
    '@vue/eslint-config-standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  settings: {
    ...createAliasSetting({
      '@': `${path.resolve(__dirname, './src')}`
    })
  }
}
