# Changelog

英文 changelog 内容请访问 [CHANGELOG](CHANGELOG.md)

## [3.6.1](https://github.com/TerryZ/v-region/compare/v3.6.0...v3.6.1) (2026-08-30)

### 问题修复

- 补充导出类型

## [3.6.0](https://github.com/TerryZ/v-region/compare/v3.5.2...v3.6.0) (2026-08-30)

### 新特性

- 行政区划数据更新至 `2026年08月30日` 版本
- 使用 typescript 重构
- 核心数据调度优化效率
- 乡镇级别数据加载增加 loading 状态显示
- `RegionColumns` 增加 `header` prop，用于设置标题栏显示
- `RegionSelects` 与 `RegionColumns` 滚动定位应用上下边距显示

### 问题修复

- 已选中的项目再次选择时，不触发内部数据处理

## [3.5.2](https://github.com/TerryZ/v-region/compare/v3.5.1...v3.5.2) (2026-04-02)

### 新特性

- 行政区划数据更新两江新区乡镇数据

## [3.5.1](https://github.com/TerryZ/v-region/compare/v3.5.0...v3.5.1) (2026-03-27)

### 新特性

- 行政区划数据更新至 `2026年03月25日` 版本

## [3.5.0](https://github.com/TerryZ/v-region/compare/v3.4.1...v3.5.0) (2025-10-11)

### 新特性

- `v-dropdown` 升级至 `v3.5.1` 版本
- 行政区划数据更新至 `2025年10月09日` 版本
- 新增 `autoSelectFirst` prop，用于选择级别时，所有下级行政级别均自动选择第一个项目，应用于 `Selects`、`Group`、`Columns` 系列组件
- 直辖市、直筒子市与省辖县等特殊情况只有单一下级数据时，自动选择该项目
- 添加 `separator` prop，设置级别文本间的分隔符

### 重构

- 核心数据应用队列处理

## [3.4.1](https://github.com/TerryZ/v-region/compare/v3.4.0...v3.4.1) (2025-03-09)

### 新特性

- `v-dropdown` 升级至 `v3.3.0` 版本

## [3.4.0](https://github.com/TerryZ/v-region/compare/v3.3.0...v3.4.0) (2025-03-04)

### 新特性

- `v-dropdown` 升级至 `v3.2.0` 版本
- 行政区划数据更新至 `2025年02月26日`
- 新增 `RegionDropdown` 组件，用于为 `Group`、`Columns` 与 `CityPicker` 的核心模块组件提供下拉列表能力
- 组件移除
  - `RegionGroupCore`
  - `RegionFullGroupCore`
  - `RegionColumnsCore`
  - `RegionFullColumnsCore`
- `RegionSelects`、`RegionGroup`、`RegionColumns` 与 `RegionCityPicker` 组件新增 `names` 的 `v-model` 属性，用于返回选择的行政区划名称
- 各核心模块组件移除 `adjust` 事件

## [3.3.0](https://github.com/TerryZ/v-region/compare/v3.2.1...v3.3.0) (2024-09-26)

### 新特性

- `RegionCityPicker` 新增清除选择项目图标按钮
- 部分组件添加选中项目滚动定位功能

## [3.2.1](https://github.com/TerryZ/v-region/compare/v3.2.0...v3.2.1) (2024-09-23)

### 新特性

- dts 文档补充对 `scoped slots` 插槽输出数据的描述
- group 清空图标的样式优化

### 问题修复

- 乡镇级别初始化选中状态有概率失败

## [3.2.0](https://github.com/TerryZ/v-region/compare/v3.1.0...v3.2.0) (2024-09-21)

### 新特性

- 优化性能，减少不必要的渲染与数据加载
- 原有组件将作为 3 级行政级别组件使用，新增 `Full` 系列 4 级行政级别组件，以按需使用，避免不需要使用 4 级行政级别时，组件体积过大
- 移除 `reset` api, 需要清空选择内容时，请将 `v-model` 绑定的值设置为各级别均为 `undefined` 的对象

## [3.1.0](https://github.com/TerryZ/v-region/compare/v3.0.0...v3.1.0) (2024-07-10)

### 新特性

- `RegionText` 添加数据变更响应
- 更新数据源

### 问题修复

- `RegionSelects` 空列表未显示占位文字

## [3.0.0](https://github.com/TerryZ/v-region/compare/v3.0.0-beta.4...v3.0.0) (2023-09-24)

### 新特性

- 重构 `RegionCityPicker` 排版结构与样式

## [3.0.0-beta.4](https://github.com/TerryZ/v-region/compare/v3.0.0-beta.3...v3.0.0-beta.4) (2023-09-19)

### 新特性

- 更新 `v-dropdown` 至 `v3.0.0`
- 重构 `RegionCityPicker` 与 `RegionSelects` 结构，使其更多功能可测试化

### 问题修复

- 更新 `.d.ts` 文档

## [3.0.0-beta.3](https://github.com/TerryZ/v-region/compare/v3.0.0-beta.2...v3.0.0-beta.3) (2023-03-04)

### 问题修复

- 修复 `Group` 模式的 `乡/镇/街道` 级别列表数据加载有概率错误

## [3.0.0-beta.2](https://github.com/TerryZ/v-region/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2023-03-04)

### 问题修复

- 增加对 `window` 对象的判断，解决在非浏览器环境中打包失败

## [3.0.0-beta.1](https://github.com/TerryZ/v-region/compare/v2.3.0...v3.0.0-beta.1) (2023-03-02)

### 新特性

- 使用 vue3 **composition api** 重构 `v-region`
- 工具链从 `webpack` 更换为 `vite`
- 单元测试库从 `mocha` 更换为 `vitest`
- `RegionGroupCore` 与 `RegionColumnsCore` 核心模块增加 `complete` 事件，响应所有有效级别选择完成操作
- 下拉列表形态模块 `RegionGroup`、`RegionColumns` 与 `RegionCityPicker` 均增加 `visible-change` 事件，响应下拉层打开/关闭状态
- 移除 `Group` 模式搜索功能
