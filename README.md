<!--
<br><br>

<p align="center"><img src="https://terryz.github.io/image/v-region/v-region-ui.png" alt="v-region" ></p>

<h3 align="center">v-region</h3>

<br>

<p align="center">
    简洁强大的中国行政区划选择器，可选择 “省/直辖市”、“市”、“区/县”、“乡/镇/街道” 4 级行政区域<br>
    A simple region cascade selector for <strong>Vue2</strong>, provide 4 levels Chinese administrative division data
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/v-region"><img src="https://img.shields.io/npm/v/v-region.svg"></a>
  <a href="https://mit-license.org/"><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg"></a>
  <a href="https://app.fossa.io/projects/git%2Bgithub.com%2FTerryZ%2Fv-region?ref=badge_shield"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2FTerryZ%2Fv-region.svg?type=shield"></a>
  <a href="https://www.npmjs.com/package/v-region"><img src="https://img.shields.io/npm/dy/v-region.svg"></a>
</p>


<br><br><br><br><br>

-->

# [v-region](https://terryz.github.io/vue/#/region)

[![circle ci](https://circleci.com/gh/TerryZ/v-region.svg?style=svg)](https://circleci.com/gh/TerryZ/v-region)
[![code coverage](https://codecov.io/gh/TerryZ/v-region/branch/master/graph/badge.svg)](https://codecov.io/gh/TerryZ/v-region)
[![npm version](https://img.shields.io/npm/v/v-region.svg)](https://www.npmjs.com/package/v-region)
[![npm download](https://img.shields.io/npm/dy/v-region.svg)](https://www.npmjs.com/package/v-region)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

简洁强大的中国行政区划选择器，可选择 “省/直辖市”、“市”、“区/县”、“乡/镇/街道” 4 级行政区域

A simple region cascade selector for **Vue2**, provide 4 levels Chinese administrative division data

## 实例和文档（Examples and Documentation）

请浏览（Explorer on）

- [English site](https://terryz.github.io/vue/#/region)
- [国内站点](https://terryz.gitee.io/vue/#/region)

## 功能特性（Featues）

- 支持 “省/直辖市”、“市”、“区/县”、“乡/镇/街道” 4级行政区域选择
- 传统表单多下拉列表（Select）多级联动模式
- 下拉选择器模式
- 多列竖排模式选择器模式
- 下拉选择器模式自带默认呼出按钮，并允许自定义呼出对象（Slot）
- 纯文本显示模式（指定初始值后）
- 除省级以外，其它行政区域级别允许通过参数进行“打开/关闭”
- 完整解决 “直辖市”、“特别行政区” 、 “地级市（直筒子市）” 和 “省辖县/省辖县级市” 的数据和内容的处理

## 插件预览（Plugin preview）

- *纯文本显示模式 (plain text view mode)*

![text](https://terryz.github.io/image/v-region/v-region-text.png)

- *表单元素模式（form element mode）*

![base](https://terryz.github.io/image/v-region/v-region-base.png)

- *下拉选择器模式（dropdown selector mode）*

![ui](https://terryz.github.io/image/v-region/v-region-ui.png)

- *多列竖排选择器模式 (selector with column group)*

![column](https://terryz.github.io/image/v-region/v-region-column.png)

- *城市选择器模式 (city picker selector mode)*

![city-picker](https://terryz.github.io/image/v-region/v-region-city-picker.png)


## 安装插件（Installation）

<a href="https://nodei.co/npm/v-region/"><img src="https://nodei.co/npm/v-region.png"></a>

```
npm i -S v-region
```

Include plugin in your `main.js` file.

```js
import Vue from 'vue'
import vRegion from 'v-region';
Vue.use(vRegion, { global config options });
```

## 在页面中使用（Usage）

```vue
<template>
  <v-region @values="regionChange"></v-region>
</template>

<script>
export default {
    methods:{
        //receive selected region entries
        regionChange(data){
            console.log(data);
        }
    }
};
</script>
```

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FTerryZ%2Fv-region.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FTerryZ%2Fv-region?ref=badge_large)

## Star数趋势（Stargazers over time）

[![Stargazers over time](https://starcharts.herokuapp.com/TerryZ/v-region.svg)](https://starcharts.herokuapp.com/TerryZ/v-region)

## 数据源（Data Source）

Region data come from repo: [mumuy/data_location](https://github.com/mumuy/data_location)

> **数据说明**  
> 省、市、区数据来自于民政局、国务院公告、国家统计局，确保及时更新和权威；  
> 街道(镇、乡)数据由于数据庞大，各地各级之前公函较多，无法保证及时有效（最新数据2016年7月31日）；  
> 数据是以行政区为单位的行政区划数据。行政管理区与行政区存在重合，不予收录;    
> (行政管理区通常包含:***经济特区/经济开发区/高新区/新区/工业区；亦有部分行政管理区升为行政区，需加以区分)

## 依赖（Dependencies）

- [v-dropdown](https://github.com/TerryZ/v-dropdown) - the dropdown layer container

## Vue 插件作品集（Vue plugin series）

| Plugin | Status | Description |
| :---------------- | :-- | :-- |
| [v-page](https://github.com/TerryZ/v-page) | [![npm version](https://img.shields.io/npm/v/v-page.svg)](https://www.npmjs.com/package/v-page) | A simple pagination bar, including length Menu, i18n support |
| [v-dialogs](https://github.com/TerryZ/v-dialogs) | [![npm version](https://img.shields.io/npm/v/v-dialogs.svg)](https://www.npmjs.com/package/v-dialogs) | A simple and powerful dialog, including Modal, Alert, Mask and Toast modes |
| [v-tablegrid](https://github.com/TerryZ/v-tablegrid) | [![npm version](https://img.shields.io/npm/v/v-tablegrid.svg)](https://www.npmjs.com/package/v-tablegrid) | A simpler to use and practical datatable |
| [v-uploader](https://github.com/TerryZ/v-uploader) | [![npm version](https://img.shields.io/npm/v/v-uploader.svg)](https://www.npmjs.com/package/v-uploader) | A Vue2 plugin to make files upload simple and easier, <br>you can drag files or select file in dialog to upload |
| [v-ztree](https://github.com/TerryZ/v-ztree) | [![npm version](https://img.shields.io/npm/v/v-ztree.svg)](https://www.npmjs.com/package/v-ztree) | A simple tree for Vue2, support single or multiple(check) select tree, <br>and support server side data |
| [v-gallery](https://github.com/TerryZ/v-gallery) | [![npm version](https://img.shields.io/npm/v/v-gallery.svg)](https://www.npmjs.com/package/v-gallery) | A Vue2 plugin make browsing images in gallery |
| [v-region](https://github.com/TerryZ/v-region) | [![npm version](https://img.shields.io/npm/v/v-region.svg)](https://www.npmjs.com/package/v-region) | A simple region selector, provide Chinese administrative division data |
| [v-selectpage](https://github.com/TerryZ/v-selectpage) | [![npm version](https://img.shields.io/npm/v/v-selectpage.svg)](https://www.npmjs.com/package/v-selectpage) | A powerful selector for Vue2, list or table view of pagination, <br>use tags for multiple selection, i18n and server side resources supports |
| [v-suggest](https://github.com/TerryZ/v-suggest) | [![npm version](https://img.shields.io/npm/v/v-suggest.svg)](https://www.npmjs.com/package/v-suggest) | A Vue2 plugin for input suggestions by autocomplete |
| [v-playback](https://github.com/TerryZ/v-playback) | [![npm version](https://img.shields.io/npm/v/v-playback.svg)](https://www.npmjs.com/package/v-playback) | A Vue2 plugin to make video play easier |
| [v-selectmenu](https://github.com/TerryZ/v-selectmenu) | [![npm version](https://img.shields.io/npm/v/v-selectmenu.svg)](https://www.npmjs.com/package/v-selectmenu) | A simple, easier and highly customized menu solution |
