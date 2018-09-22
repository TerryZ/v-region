<br><br>

<h3 align="center">v-region</h3>

<br>

<p align="center"><img src="https://terryz.github.io/image/v-region/v-region-ui.png" alt="v-region" ></p>

<p align="center">
  A simple region selector for <strong>Vue2</strong>, provide Chinese administrative division data
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/v-region"><img src="https://img.shields.io/npm/v/v-region.svg"></a>
  <a href="https://mit-license.org/"><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg"></a>
  <a href="https://app.fossa.io/projects/git%2Bgithub.com%2FTerryZ%2Fv-region?ref=badge_shield"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2FTerryZ%2Fv-region.svg?type=shield"></a>
  <a href="https://www.npmjs.com/package/v-region"><img src="https://img.shields.io/npm/dy/v-region.svg"></a>
</p>


<br><br><br><br><br>


## Demo、Document
Explorer on

- [English site](https://terryz.github.io/vue/#/region)
- [国内站点](https://terryz.gitee.io/vue/#/region)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FTerryZ%2Fv-region.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FTerryZ%2Fv-region?ref=badge_large)

<br><br>

## Vue plugin series

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

<br><br>

## Plugin preview

*form element mode*

![base](https://terryz.github.io/image/v-region/v-region-base.png)

*dropdown selector mode*

![ui](https://terryz.github.io/image/v-region/v-region-ui.png)

<br><br>

## Install

``` bash
npm i v-region --save
```

Include plugin in your `main.js` file.

```js
import Vue from 'vue'
import vRegion from 'v-region';
Vue.use(vRegion);
```

<a href="https://nodei.co/npm/v-region/"><img src="https://nodei.co/npm/v-region.png"></a>

<br><br>

## Deploy on your component(base mode)

template code

```html
<template>
    <v-region @values="regionChange" class="form-control"></v-region>
</template>
```

script code

```js
export default {
    methods:{
        //receive selected region entries
        regionChange(data){
            console.log(data);
        }
    }
};
```
<br><br>

## Stargazers over time

[![Stargazers over time](https://starcharts.herokuapp.com/TerryZ/v-region.svg)](https://starcharts.herokuapp.com/TerryZ/v-region)

<br><br>

## Data Source

Region data come from repo: [mumuy/data_location](https://github.com/mumuy/data_location)
