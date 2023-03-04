# Changelog

Please refer to [CHANGELOG-CN](CHANGELOG-CN.md) for Chinese changelog

## [3.0.0-beta.2](https://github.com/TerryZ/v-page/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2023-03-04)

### Bug Fixes

- Increase the judgment of `window` object to solve the packaging failure in non-browser environment

## [3.0.0-beta.1](https://github.com/TerryZ/v-page/compare/v2.3.0...v3.0.0-beta.1) (2023-03-02)

### Features

- refactor `v-page` with vue3 **composition api**
- change module bundler library from `webpack` to `vite`
- change unit test library from `mocha` to `vitest`
- `RegionGroupCore` and `RegionColumnsCore` core modules add `complete` events in response to all available region level selection completion
- The `RegionGroup`, `RegionColumns` and `RegionCityPicker` modules add `visible-change` events in response to the open/close state of the dropdown layer
- remove the search module from the `Group` mode
