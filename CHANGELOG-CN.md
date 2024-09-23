# Changelog

英文 changelog 内容请访问 [CHANGELOG](CHANGELOG.md)

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
