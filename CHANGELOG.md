# Changelog

Please refer to [CHANGELOG-CN](CHANGELOG-CN.md) for Chinese changelog

## [3.3.0](https://github.com/TerryZ/v-region/compare/v3.2.1...v3.3.0) (2024-09-26)

### Features

- `RegionCityPicker` component add remove all button
- Some components add the function of scrolling and positioning selected items

## [3.2.1](https://github.com/TerryZ/v-region/compare/v3.2.0...v3.2.1) (2024-09-23)

### Features

- dts adds the description of the output data of `scoped slots` slots
- Optimize the style of group clear icon

### Bug Fixes

- There is a probability that the initialization of the selected state at the town level will fail

## [3.2.0](https://github.com/TerryZ/v-region/compare/v3.1.0...v3.2.0) (2024-09-21)

### Features

- Optimize performance and reduce unnecessary rendering and data loading
- The original components will be used as level 3 administrative level components, and the new `Full` series of level 4 administrative level components will be added to use them on demand to avoid the components being too large when level 4 administrative level is not needed
- Removed `reset` api. When you need to clear the selection, please set the value of `v-model` binding to an object with `undefined` at all levels

## [3.1.0](https://github.com/TerryZ/v-region/compare/v3.0.0...v3.1.0) (2024-07-10)

### Features

- `RegionText` adds data change response
- Update region data source

### Bug Fixes

- `RegionSelects` Empty list does not display placeholder text

## [3.0.0](https://github.com/TerryZ/v-region/compare/v3.0.0-beta.4...v3.0.0) (2023-09-24)

### Features

- Refactor the layout structure and style of `RegionCityPicker`

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
