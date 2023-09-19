# Changelog

Please refer to [CHANGELOG-CN](CHANGELOG-CN.md) for Chinese changelog

## [3.0.0-beta.4](https://github.com/TerryZ/v-region/compare/v3.0.0-beta.3...v3.0.0-beta.4) (2023-09-19)

### Features

- Upgrade `v-dropdown` to `v3.0.0`
- Refactor the `RegionCityPicker` and `RegionSelects` structures to make more functions testable

### Bug Fixes

- Update `.d.ts` document

## [3.0.0-beta.3](https://github.com/TerryZ/v-region/compare/v3.0.0-beta.2...v3.0.0-beta.3) (2023-03-04)

### Bug Fixes

- Fix data loading of town level list in `Group` mode has a probability error

## [3.0.0-beta.2](https://github.com/TerryZ/v-region/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2023-03-04)

### Bug Fixes

- Increase the judgment of `window` object to solve the packaging failure in non-browser environment

## [3.0.0-beta.1](https://github.com/TerryZ/v-region/compare/v2.3.0...v3.0.0-beta.1) (2023-03-02)

### Features

- Refactor `v-region` with vue3 **composition api**
- Change module bundler library from `webpack` to `vite`
- Change unit test library from `mocha` to `vitest`
- `RegionGroupCore` and `RegionColumnsCore` core modules add `complete` events in response to all available region level selection completion
- The `RegionGroup`, `RegionColumns` and `RegionCityPicker` modules add `visible-change` events in response to the open/close state of the dropdown layer
- Remove the search module from the `Group` mode
