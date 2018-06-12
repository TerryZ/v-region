<br><br>

<h3 align="center">v-region</h3>

<br><br>

<p align="center"><img src="https://terryz.github.io/image/v-region/v-region-ui.png" alt="v-region" ></p>

<p align="center">
  A simple region selector for <strong>Vue2</strong>, provide Chinese administrative division data
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/v-region"><img src="https://img.shields.io/npm/v/v-region.svg"></a>
  <a href="https://mit-license.org/"><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg"></a>
  <a href="https://www.npmjs.com/package/v-region"><img src="https://img.shields.io/npm/dy/v-region.svg"></a>
</p>
<br><br><br><br><br>

## Demo、Document、Changelog
Explorer on

- [English site](https://terryz.github.io/vue/#/region)
- [国内站点](https://terryz.gitee.io/vue/#/region)


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

<br><br>

## Plugin preview

*form element mode*

![base](https://terryz.github.io/image/v-region/v-region-base.png)

*dropdown selector mode*

![ui](https://terryz.github.io/image/v-region/v-region-ui.png)

<br><br>

## Install

``` bash
npm install v-region --save
```

Include plugin in your `main.js` file.

```js
import Vue from 'vue'
import vRegion from 'v-region';
Vue.use(vRegion);
```

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
        //receive selected region data
        regionChange(data){
            console.log(data);
        }
    }
};
```

## Data Source

region data come from repo: [mumuy/data_location](https://github.com/mumuy/data_location)
