<template>
    <div>
        <!-- plain text only -->
        <span v-if="!ui && text" v-text="selectedText"></span>

        <!-- select list mode -->
        <select :class="className" v-model="nowProvince" v-if="!text && !ui && province">
            <option value="" v-if="blank">{{lang.pleaseSelect}}</option>
            <option :value="p.key" v-for="p in listProvince">{{p.value}}</option>
        </select>
        <select :class="className" v-model="nowCity" v-if="!text && !ui && city && haveCity">
            <option value="" v-if="blank">{{lang.pleaseSelect}}</option>
            <option :value="c.key" v-for="c in listCity">{{c.value}}</option>
        </select>
        <select :class="className" v-model="nowArea" v-if="!text && !ui && area && city">
            <option value="" v-if="blank">{{lang.pleaseSelect}}</option>
            <option :value="a.key" v-for="a in listArea">{{a.value}}</option>
        </select>
        <select :class="className" v-model="nowTown" v-if="!text && !ui && town && area && city">
            <option value="" v-if="blank">{{lang.pleaseSelect}}</option>
            <option :value="t.key" v-for="t in listTown">{{t.value}}</option>
        </select>

        <!-- selector mode -->
        <div class="rg-caller-container" @click.stop.prevent="open" v-if="ui" ref="caller">
            <slot>
                <!-- default region selector caller button -->
                <button type="button" :class="['rg-default-btn', {'rg-opened': show}]">
                    {{selectedText?selectedText:lang.pleaseSelect}}
                    <span class="rg-caret-down"></span>
                </button>
            </slot>
        </div>
        <v-drop-down v-if="ui" ref="drop" @show-change="showChange">
            <!-- header bar -->
            <div class="rg-header">
                <h3>
                    <span v-show="!selectedText" v-text="lang.defaultHead"></span>
                    <div v-show="selectedText" class="rg-header-selected" v-text="selectedText"></div>
                </h3>

                <button type="button" :title="lang.clear" @click="clear" class="rg-removeall-button" >
                    <i class="rg-iconfont icon-removeall"></i>
                </button>
                <button type="button" :title="lang.done" @click="close" class="rg-done-button" >
                    <i class="rg-iconfont icon-selected"></i>
                </button>
            </div>
            <!-- search bar -->
            <div class="rg-search" v-if="search">
                <input type="text" autocomplete="off" ref="input" v-model.trim="query" class="rg-input">
            </div>
            <!-- region level tabs -->
            <div class="rg-level-tabs" >
                <ul>
                    <li v-for="tab,index in levels" v-if="checkAvailable(index)">
                        <a href="javascript:void(0);"
                           :tab_id="'selectmenu_tab_' + (index+1)"
                           :data_index="index"
                           @click="level = index"
                           :class="{active:index === level}">{{tab.title}}</a>
                    </li>
                </ul>
            </div>
            <!-- selector mode -->
            <div class="rg-results-container">
                <ul class="rg-results">
                    <li :class="{'rg-item':true,active:matchItem(item)}"
                        @click="itemSelect(item)"
                        v-for="item,index in list">{{item.value}}</li>
                    <li class="rg-message-box" v-if="list.length === 0">{{lang.noMatch}}</li>
                </ul>
            </div>
        </v-drop-down>
    </div>
</template>

<script>
    import dropDown from 'v-dropdown';
    import {srcProvince, srcCity, srcArea} from "./region.js";
    import language from './language';

    export default {
        name: "v-region",
        components: {
            'v-drop-down': dropDown
        },
        props: {
            blank: {
                type: Boolean,
                default: true
            },
            province: {
                type: Boolean,
                default: true
            },
            city: {
                type: Boolean,
                default: true
            },
            area: {
                type: Boolean,
                default: true
            },
            town: {
                type: Boolean,
                default: false
            },
            i18n: {
                type: String,
                default: 'cn'
            },
            selected: Object,
            ui: {
                type: Boolean,
                default: false
            },
            search: {
                type: Boolean,
                default: true
            },
            text: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                listProvince: [],
                listCity: [],
                listArea: [],
                listTown: [],
                nowProvince: '',
                nowCity: '',
                nowArea: '',
                nowTown: '',

                haveCity: true,// is municipality
                className: '',
                lang: {},
                init: this.selected,
                pauseWatch: false,

                //ui mode data
                query: '',
                show: false,
                levels: [
                    {index:0,title:'省/直辖市'},
                    {index:1,title:'市'},
                    {index:2,title:'区/县'},
                    {index:3,title:'乡/镇/街道'}
                ],
                level: -1,
                list: [],

                //return data
                itemProvince: null,
                itemCity: null,
                itemArea: null,
                itemTown: null
            };
        },
        watch:{
            /**
             * region search(ui mode)
             * search region description first, if no result, then search region key
             * @param value
             */
            query(value){
                let list = this.getList(this.level),tmp = [];
                tmp = list.filter(val=>val.value.toLowerCase().includes(value.toLowerCase()));
                if(tmp.length === 0) tmp = list.filter(val=>val.key.includes(value));
                this.list = tmp;
            },
            nowProvince(value){
                if(this.pauseWatch) return;
                if(this.city){
                    if(this.listArea.length) this.listArea.splice(0, this.listArea.length);
                    this.listCity = value ? srcCity.filter(val=>{
                        let num = Number.parseInt(value);
                        return (val.key - num) < 1e4 && (val.key%num) < 1e4;
                    }) : [];

                    this.nowCity = '';
                    if(!this.haveCity) this.nowArea = '';
                    this.itemProvince = this.listProvince.find(val=>val.key === value);
                    this.haveCity = !this.listCity.length && value ? false : true;

                    this.$nextTick(()=>{
                        if(!this.haveCity && this.area) this.changeCity();
                        else this.initSelected(2);

                        if(this.ui){
                            if(this.city && this.haveCity) this.level = 1;
                            if(this.area && !this.haveCity) this.level = 2;
                        }
                    });
                }

                this.changeValues();
            },
            nowCity(value){
                if(this.pauseWatch) return;
                this.changeCity();

                this.itemCity = this.listCity.find(val=>val.key === value);
                if(this.ui && this.area) this.level = 2;

                this.changeValues();
            },
            nowArea(value){
                if(this.pauseWatch) return;
                if(value && this.town){
                    let towns = null, tmpArr = [];
                    try{
                        towns = require(`./town/${value}.json`);
                    }catch (e) {}
                    if(towns && Object.keys(towns).length)
                        tmpArr = Object.entries(towns).map(val=>({ key: val[0], value: val[1] }));

                    this.listTown = tmpArr;
                }else this.listTown = [];

                if(this.town) this.nowTown = '';

                this.itemArea = this.listArea.find(val=>val.key === value);
                this.initSelected(4);

                if(this.ui && this.town) this.level = 3;

                this.changeValues();
            },
            nowTown(value){
                if(this.pauseWatch) return;
                this.itemTown = this.listTown.find(val=>val.key === value);

                this.changeValues();
            },
            /**
             * initialize region selected
             */
            selected: {
                handler(val){
                    if(val && Object.keys(val).length){
                        this.init = val;
                        //if(val.province) this.nowProvince = val.province;
                        this.initSelected(1);
                    }
                },
                deep: true
            },
            /**
             * watch current region group
             */
            level(val){
                this.list = this.getList(val);
            }
        },
        methods:{
            open(){
                this.$refs.drop.$emit('show', true, this.$refs.caller);
                this.inputFocus();
            },
            close(){
                this.$nextTick(()=>{
                    this.$refs.drop.$emit('show', false);
                });
            },
            inputFocus(){
                if(!this.search || !this.ui) return;
                this.$nextTick(()=>{
                    //fix open drop down list and set input focus, the page will scroll to top
                    //that.$refs.search.focus({preventScroll:true}); only work on Chrome and EDGE
                    if(this.isChrome() || this.isEdge()) this.$refs.input.focus({preventScroll:true});
                    else{
                        let x = window.pageXOffset, y = window.pageYOffset;
                        this.$refs.input.focus();
                        if(window.pageYOffset !== y) setTimeout(function() { window.scrollTo(x, y); }, 0);
                    }
                });
            },
            showChange(val){
                this.show = val;
            },
            changeCity(){
                if(this.area || (!this.haveCity && this.province)){
                    if((this.haveCity && !this.nowCity) || (!this.haveCity && !this.nowProvince)){
                        this.listArea = [];
                    }else{
                        let thisCity = Number.parseInt(this.haveCity?this.nowCity:this.nowProvince);
                        let range = this.haveCity ? 100 : 1000;
                        this.listArea = srcArea.filter(val=>(val.key - thisCity) < range && val.key%thisCity < range);
                    }
                    this.nowArea = '';
                }
                this.initSelected(3);
            },
            changeValues(){
                this.$nextTick(()=>{
                    this.$emit('values', {
                        province: this.itemProvince,
                        city: this.itemCity,
                        area: this.itemArea,
                        town: this.itemTown
                    });
                });
            },
            initSelected(level){
                let that = this, ini = this.init, count = 0;
                if(ini && Object.keys(ini).length){
                    switch(level){
                        case 1://province
                            if(that.province && ini.province) that.nowProvince = ini.province;
                            break;
                        case 2://city
                            if(that.city && ini.city) that.nowCity = ini.city;
                            break;
                        case 3://area
                            if(that.area && ini.area) that.nowArea = ini.area;
                            break;
                        case 4://town
                            if(that.town && ini.town) that.nowTown = ini.town;
                            break;
                    }
                    if(that.province && ini.province) count++;
                    if(that.city && (ini.city || (!ini.city && !that.haveCity && that.area && init.area))) count++;
                    if(that.area && ini.area) count++;
                    if(that.town && ini.town) count++;
                    if(level === count) this.init = null;
                }
            },
            getList(val){
                let list = [];
                switch(val){
                    case 0:
                        list = this.listProvince;
                        break;
                    case 1:
                        list = this.listCity;
                        break;
                    case 2:
                        list = this.listArea;
                        break;
                    case 3:
                        list = this.listTown;
                        break;
                }
                return list;
            },
            //check level available
            checkAvailable(index){
                let val = false;
                switch(index){
                    case 0://province
                        if(this.province) val = true;
                        break;
                    case 1://city
                        if(this.city && this.haveCity) val = true;
                        break;
                    case 2://area
                        if(this.city && this.area) val = true;
                        break;
                    case 3://town
                        if(this.city && this.area && this.town) val = true;
                        break;
                }
                return val;
            },
            matchItem(item){
                return item.key === this.nowProvince ||
                        item.key === this.nowCity ||
                        item.key === this.nowArea ||
                        item.key === this.nowTown;
            },
            itemSelect(item){
                let done = false;
                switch(this.level){
                    case 0:
                        this.nowProvince = item.key;
                        this.itemProvince = item;
                        this.$nextTick(()=>{
                            if(!this.city || (this.city && !this.haveCity)) done = true;
                        });
                        break;
                    case 1:
                        this.nowCity = item.key;
                        this.itemCity = item;
                        if(!this.area) done = true;
                        break;
                    case 2:
                        this.nowArea = item.key;
                        this.itemArea = item;
                        if(!this.town) done = true;
                        break;
                    case 3:
                        this.nowTown = item.key;
                        this.itemTown = item;
                        done = true;
                        break;
                }
                this.$nextTick(()=>{
                    if(done) this.close();
                });
            },
            clear(){
                let that = this;
                this.pauseWatch = true;
                this.nowProvince = '';
                this.nowCity = '';
                this.nowArea = '';
                this.nowTown = '';
                this.itemProvince = null;
                this.itemCity = null;
                this.itemArea = null;
                this.itemTown = null;
                this.listCity = [];
                this.listArea = [];
                this.listTown = [];
                this.level = 0;
                this.$nextTick(()=>{
                    that.pauseWatch = false;
                    that.changeValues();
                });
            },
            isChrome(){
                return navigator.vendor !== undefined && navigator.vendor.indexOf("Google") !== -1;
            },
            isEdge(){
                return navigator.userAgent.indexOf("Edge") >= 0;
            }
        },
        computed: {
            selectedText(){
                let l1 = this.itemProvince?this.itemProvince.value:'',
                    l2 = this.itemCity?this.itemCity.value:'',
                    l3 = this.itemArea?this.itemArea.value:'',
                    l4 = this.itemTown?this.itemTown.value:'';
                return l1 + l2 + l3 + l4;
            }
        },
        beforeMount(){
            this.lang = language[this.i18n];
            //sort by length and code
            this.listProvince = this.ui?srcProvince.concat().sort((a,b)=>{
                let gap = a.value.length - b.value.length;
                return gap === 0?Number(a.key)-Number(b.key):gap;
            }):srcProvince.concat();

            if(this.ui) this.level = 0;
        },
        mounted(){
            this.className = this.$el.className;
            this.$el.className = 'v-region';

            if(this.selected && this.selected.province) this.nowProvince = this.selected.province;
        }
    }
</script>

<style lang="scss">
    $darkBg: #F5F5F5;
    div.v-region {
        display: inline-block;
        select {
            width: auto;
            display: inline-block;
            overflow: hidden;
            box-sizing: content-box;
            padding: 0 12px;
            margin-right: 5px;
        }
    }
    div.rg-caller-container{ display: inline-block; }

    .rg-default-btn {
        display: inline-block;
        position: relative;
        padding: 6px 12px;
        background-color: white;
        border: 1px solid #cccccc;
        border-radius: 4px;
        font-size: 14px;
        line-height: 1.42857143;
        outline: 0 !important;
        color: #666666;
        transition: color .15s ease-in-out,
        background-color .15s ease-in-out,
        border-color .15s ease-in-out,
        box-shadow .15s ease-in-out;
        span.rg-caret-down { transition:transform .2s ease; }
        &.rg-opened {
            box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
            border: 1px solid #aaa;
            color: black;
            background-color: #e0e0e0;
            span.rg-caret-down { transform: rotate(180deg); }
            &:hover { background-color: #e0e0e0;border: 1px solid #aaa; }
        }
        &:hover{
            border: 1px solid #aaaaaa;
            background-color: #e0e0e0;
            color: black;
        }
    }

    .rg-caret-down {
        display: inline-block;
        width: 0;
        height: 0;
        margin-left: 5px;
        border-top: 4px solid;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        /*float: right;*/
        /*margin-top: 3px;*/
        vertical-align: middle;
        content: "";
        /*        position: absolute;
                top: 7px;
                right: 10px;*/
    }

    div.rg-header {
        width: 400px;
        background-color: $darkBg;
        & > h3 {
            padding: 6px 80px 10px 10px;
            margin: 0;
            text-align: left;
            color: #24292e;
            font-size: 16px;
            white-space: nowrap;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            .rg-header-selected{
                white-space: nowrap;
                text-overflow: ellipsis;
                -o-text-overflow: ellipsis;
                overflow: hidden;
                font-size: 14px;
                max-width: 310px;
            }
        }
        button{
            position: absolute;
            -webkit-appearance: none;
            padding: 0;
            cursor: pointer;
            background: 0 0;
            border: 0;
            outline: none;
            line-height: 100%;
            color: #999999;
            top: 3px;
            font-size: 20px;
            &.rg-close-button { right: 10px;font-size: 26px;top:0;font-weight: 300; }
            &.rg-removeall-button { right: 32px; }
            &.rg-done-button { /*right: 54px;*/right: 8px;top: 4px;i{font-size: 18px;} }
            &:hover { color: black; }
        }
    }
    div.rg-search {
        padding: 2px 10px 10px;
        background-color: $darkBg;
        .rg-input {
            display: block;
            background-color: white;
            margin: 0 !important;
            width: 100%;

            font-size: 14px;
            line-height: 20px;
            min-height: 20px;
            padding: 4px 6px;
            vertical-align: middle;
            box-sizing: border-box;

            outline: none !important;
            height: 30px;

            border-radius: 2px;
            border: 1px solid #dddddd;
            -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
            -moz-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075);

            transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
            &:focus { border: 1px solid #bbbbbb;box-shadow: 0 0 0 3px rgba(150,150,150, 0.2); }
        }
    }
    /* group type */
    div.rg-level-tabs {
        padding: 0 10px;border-bottom: 1px solid #E6E7E7;
        background-color: $darkBg;
        ul {
            position: relative;
            bottom: -1px;
            padding: 0;
            margin: 0;
            text-align: left;
            li {
                display: inline-block;
                a {
                    display: inline-block;
                    padding: 7px 10px 3px;
                    font-size: 14px;
                    color: #6a737d;
                    text-decoration: none;
                    cursor: pointer;
                    line-height: 100%;
                    background: transparent;
                    border: 1px solid transparent;
                    border-radius: 3px 3px 0 0;
                    font-family: "Helvetica Neue Light", "HelveticaNeue-Light", "Helvetica Neue", Calibri, Helvetica, Arial;
                    &.active {
                        color: #24292e;
                        background-color: #fff;
                        border-color: #dfe2e5;
                        border-bottom-color: #fff;
                        /*font-weight: bold;*/
                    }
                }
            }
        }
    }

    div.rg-results-container{
        background-color: white;
        list-style: none;
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        clear: both;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
        ul.rg-results {
            background-color: white;
            list-style: none;
            margin: 0;
            padding: 5px;
            /*height: 300px;*/
            width: 400px;
            li.rg-item {
                display: inline-block;
                border: 1px solid white;
                border-radius: 2px;
                margin-right: 5px;
                color: #666666;
                &:hover{
                    border: 1px solid #DDDDDD;
                    box-shadow: 0 1px 8px rgba(0,0,0,0.2);
                    -moz-box-shadow: 0 1px 8px rgba(0,0,0,0.2);
                    -webkit-box-shadow: 0 1px 8px rgba(0,0,0,0.2);
                    color: black;
                    background-color: #F6F6F6;
                }
                &.active { border: 1px solid #666666;background-color: #DDDDDD; }
            }
            & > li {
                /*height: auto;
                line-height: 1;*/
                margin: 0;
                overflow: hidden;
                padding: 3px 10px;
                position: relative;
                text-align: left;
                white-space: nowrap;
                font-size: 14px;
                color: black;
                cursor : pointer;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                &.rg-message-box {
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    box-sizing: content-box;
                    font-size: 14px;
                    cursor: default;
                    i { font-size: 18px; }
                }
            }
        }
    }
    div.rg-selected-container {
        /*padding: 5px 16px 7px;*/
        border-top: 1px solid #E6E7E7;
        background-color: white;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
        display: inline-block;
        width: 400px;
        position: relative;
        div.rg-selected-content{
            /*margin-right: 30px;*/
            display: inline-block;
            width: 350px;
        }
        div.rg-done {
            height: 100%;
            width: 50px;
            display: inline-block;
            text-align: center;
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            i{
                line-height: 1;
                font-size: 20px;
                top: 50%;
                position: absolute;
                margin-top: -10px;
            }
        }
    }


    /* icons */
    @font-face {font-family: "rg-iconfont";
        src: url('data:image/eot;base64,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'); /* IE9*/
        src: url('data:image/eot;base64,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') format('embedded-opentype'), /* IE6-IE8 */
        url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
        url('data:image/ttf;base64,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') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
        url('data:image/svg;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiID4KPCEtLQoyMDEzLTktMzA6IENyZWF0ZWQuCi0tPgo8c3ZnPgo8bWV0YWRhdGE+CkNyZWF0ZWQgYnkgaWNvbmZvbnQKPC9tZXRhZGF0YT4KPGRlZnM+Cgo8Zm9udCBpZD0iaWNvbmZvbnQiIGhvcml6LWFkdi14PSIxMDI0IiA+CiAgPGZvbnQtZmFjZQogICAgZm9udC1mYW1pbHk9Imljb25mb250IgogICAgZm9udC13ZWlnaHQ9IjUwMCIKICAgIGZvbnQtc3RyZXRjaD0ibm9ybWFsIgogICAgdW5pdHMtcGVyLWVtPSIxMDI0IgogICAgYXNjZW50PSI4OTYiCiAgICBkZXNjZW50PSItMTI4IgogIC8+CiAgICA8bWlzc2luZy1nbHlwaCAvPgogICAgCiAgICA8Z2x5cGggZ2x5cGgtbmFtZT0ieCIgdW5pY29kZT0ieCIgaG9yaXotYWR2LXg9IjEwMDEiCmQ9Ik0yODEgNTQzcS0yNyAtMSAtNTMgLTFoLTgzcS0xOCAwIC0zNi41IC02dC0zMi41IC0xOC41dC0yMyAtMzJ0LTkgLTQ1LjV2LTc2aDkxMnY0MXEwIDE2IC0wLjUgMzB0LTAuNSAxOHEwIDEzIC01IDI5dC0xNyAyOS41dC0zMS41IDIyLjV0LTQ5LjUgOWgtMTMzdi05N2gtNDM4djk3ek05NTUgMzEwdi01MnEwIC0yMyAwLjUgLTUydDAuNSAtNTh0LTEwLjUgLTQ3LjV0LTI2IC0zMHQtMzMgLTE2dC0zMS41IC00LjVxLTE0IC0xIC0yOS41IC0wLjUKdC0yOS41IDAuNWgtMzJsLTQ1IDEyOGgtNDM5bC00NCAtMTI4aC0yOWgtMzRxLTIwIDAgLTQ1IDFxLTI1IDAgLTQxIDkuNXQtMjUuNSAyM3QtMTMuNSAyOS41dC00IDMwdjE2N2g5MTF6TTE2MyAyNDdxLTEyIDAgLTIxIC04LjV0LTkgLTIxLjV0OSAtMjEuNXQyMSAtOC41cTEzIDAgMjIgOC41dDkgMjEuNXQtOSAyMS41dC0yMiA4LjV6TTMxNiAxMjNxLTggLTI2IC0xNCAtNDhxLTUgLTE5IC0xMC41IC0zN3QtNy41IC0yNXQtMyAtMTV0MSAtMTQuNQp0OS41IC0xMC41dDIxLjUgLTRoMzdoNjdoODFoODBoNjRoMzZxMjMgMCAzNCAxMnQyIDM4cS01IDEzIC05LjUgMzAuNXQtOS41IDM0LjVxLTUgMTkgLTExIDM5aC0zNjh6TTMzNiA0OTh2MjI4cTAgMTEgMi41IDIzdDEwIDIxLjV0MjAuNSAxNS41dDM0IDZoMTg4cTMxIDAgNTEuNSAtMTQuNXQyMC41IC01Mi41di0yMjdoLTMyN3oiIC8+CiAgICAKCiAgICAKICAgIDxnbHlwaCBnbHlwaC1uYW1lPSJ3YXJuIiB1bmljb2RlPSImIzU4OTc5OyIgZD0iTTg0OS4xMi0zMi43MDQgMTc0Ljg4LTMyLjcwNGMtNDUuMjE2IDAtODEuNTM2IDE3LjcyOC05OS42OCA0OC42NC0xOC4xNDQgMzAuOTEyLTE1LjkzNiA3MS4yOTYgNi4wOCAxMTAuNzUyTDQyMS40NzIgNzM2LjM1MmMyMi4xNDQgMzkuNzQ0IDU1LjA3MiA2Mi41MjggOTAuMzA0IDYyLjUyOHM2OC4xMjgtMjIuNzUyIDkwLjMzNi02Mi40NjRsMzQwLjU0NC02MDkuNzkyYzIyLjAxNi0zOS40NTYgMjQuMjg4LTc5LjgwOCA2LjExMi0xMTAuNzJDOTMwLjY1Ni0xNS4wMDggODk0LjMwNC0zMi43MDQgODQ5LjEyLTMyLjcwNHpNNTExLjgwOCA3MzQuODhjLTExLjIgMC0yNC4wMzItMTEuMTA0LTM0LjQzMi0yOS42OTZMMTM3LjE4NCA5NS40NTZjLTEwLjY1Ni0xOS4xMzYtMTMuMTUyLTM2LjMyLTYuNzg0LTQ3LjE2OCA2LjM2OC0xMC44MTYgMjIuNTkyLTE3LjAyNCA0NC40OC0xNy4wMjRsNjc0LjI0IDBjMjEuOTIgMCAzOC4xMTIgNi4xNzYgNDQuNDggMTcuMDI0IDYuMzM2IDEwLjgxNiAzLjg3MiAyOC02LjgxNiA0Ny4xMzZMNTQ2LjI0IDcwNS4xODRDNTM1Ljg3MiA3MjMuNzc2IDUyMi45NzYgNzM0Ljg4IDUxMS44MDggNzM0Ljg4ek01MTIgMjU2Yy0xNy42NjQgMC0zMiAxNC4zMDQtMzIgMzJsMCAyODhjMCAxNy42NjQgMTQuMzM2IDMyIDMyIDMyczMyLTE0LjMzNiAzMi0zMmwwLTI4OEM1NDQgMjcwLjMwNCA1MjkuNjY0IDI1NiA1MTIgMjU2ek01MTIgMTQzLjg3Mm0tNDggMGExLjUgMS41IDAgMSAwIDk2IDAgMS41IDEuNSAwIDEgMC05NiAwWiIgIGhvcml6LWFkdi14PSIxMDI0IiAvPgoKICAgIAogICAgPGdseXBoIGdseXBoLW5hbWU9ImZhbmd4aW5neHVhbnpob25nIiB1bmljb2RlPSImIzU5MTcwOyIgZD0iTTcyNi45NzY2OTcgNTAyLjgxNTg1OGMtMTIuNTQzNjkgMTIuNDQ3MzU5LTMyLjgzMTcxNiAxMi4zMjAwNjUtNDUuMjQ4MTEyLTAuMjU2MzFMNDQ4LjQ0NzI1MiAyNjYuNzUxMjQzbC0xMDMuMjYzNTQgMTA2LjExMjE4OWMtMTIuMzUyNzQ4IDEyLjcwMzY2OS0zMi42MDgwOSAxMi45MjcyOTUtNDUuMjQ4MTEyIDAuNjM5OTE0LTEyLjY3MjcwNS0xMi4zMjAwNjUtMTIuOTU5OTc4LTMyLjYwODA5LTAuNjM5OTE0LTQ1LjI0ODExMmwxMjYuMDE2NjExLTEyOS41MDM0NTRjMC4wNjM2NDctMC4wOTYzMzEgMC4xOTI2NjItMC4wOTYzMzEgMC4yNTYzMS0wLjE5MjY2MiAwLjA2MzY0Ny0wLjA2MzY0NyAwLjA5NjMzMS0wLjE5MjY2MiAwLjE1OTk3OC0wLjI1NjMxIDIuMDE2MDczLTEuOTgzMzg5IDQuNTEyMDgyLTMuMTk5NTcgNi44ODA3OTYtNC41NDQ3NjUgMS4yNDcxNDQtMC42NzI1OTggMi4yMzk2OTktMS43OTI0NDcgMy41MTk1MjctMi4zMDMzNDYgMy44NzIxNjgtMS41OTk3ODUgOC4wMDA2NDUtMi4zOTk2NzcgMTIuMDk2NDM5LTIuMzk5Njc3IDQuMDY0ODMgMCA4LjEyNzk0IDAuNzk5ODkyIDExLjk2NzQyNCAyLjMzNjAzIDEuMjQ3MTQ0IDAuNTEyNjE5IDIuMjA4NzM1IDEuNTM2MTM4IDMuMzkyMjMyIDIuMTc2MDUyIDIuMzk5Njc3IDEuMzQzNDc1IDQuODk1Njg2IDIuNTI4NjkyIDYuOTQ0NDQzIDQuNTQ0NzY1IDAuMDYzNjQ3IDAuMDYzNjQ3IDAuMDk2MzMxIDAuMTkyNjYyIDAuMTkyNjYyIDAuMjU2MzEgMC4wNjM2NDcgMC4wOTYzMzEgMC4xNTk5NzggMC4xMjcyOTUgMC4yNTYzMSAwLjE5MjY2MmwyNTYuMjIzNjI2IDI1OS4wMDg2MjhDNzM5LjY0NzY4MiA0NzAuMTExNDM3IDczOS41MjAzODcgNDkwLjM2ODQ5OSA3MjYuOTc2Njk3IDUwMi44MTU4NTh6TTgzMi0zMi4wMDA4NmwtNjQwIDBjLTUyLjkyODggMC05Ni4wMDA4NiA0My4wNzIwNi05Ni4wMDA4NiA5NS45OTkxNGwwIDY0MGMwIDUyLjkyODggNDMuMDcyMDYgOTYuMDAwODYgOTYuMDAwODYgOTYuMDAwODZsNjQwIDBjNTIuOTI3MDggMCA5NS45OTkxNC00My4wNzIwNiA5NS45OTkxNC05Ni4wMDA4NmwwLTY0MEM5MjguMDAwODYgMTEuMDcxMiA4ODQuOTI4OC0zMi4wMDA4NiA4MzItMzIuMDAwODZ6TTE5MiA3MzUuOTk5MTRjLTE3LjYzMjAzOSAwLTMyLjAwMDg2LTE0LjM2ODgyMS0zMi4wMDA4Ni0zMi4wMDA4NmwwLTY0MGMwLTE3LjY2NDcyMiAxNC4zNjg4MjEtMzEuOTk5MTQgMzIuMDAwODYtMzEuOTk5MTRsNjQwIDBjMTcuNjY0NzIyIDAgMzEuOTk5MTQgMTQuMzM2MTM4IDMxLjk5OTE0IDMxLjk5OTE0bDAgNjQwYzAgMTcuNjMyMDM5LTE0LjMzNjEzOCAzMi4wMDA4Ni0zMS45OTkxNCAzMi4wMDA4NkwxOTIgNzM1Ljk5OTE0eiIgIGhvcml6LWFkdi14PSIxMDI0IiAvPgoKICAgIAogICAgPGdseXBoIGdseXBoLW5hbWU9Inh1YW56ZSIgdW5pY29kZT0iJiM1OTE4MjsiIGQ9Ik04ODcuOTA0NzQ0IDU5Ny43OTE0OGMtMTIuODYzNjQ3IDEyLjA2Mzc1NS0zMy4xNTE2NzMgMTEuNDg3NDg4LTQ1LjIxNTQyOC0xLjQwODg0M0w0MTUuOTM1NDkzIDE0Mi4wMTYxODEgMTgyLjgxNTg1OCAzNzEuNzEyNjE5Yy0xMi42MDczMzggMTIuNDE2Mzk2LTMyLjg2NDQgMTIuMjg3MzgxLTQ1LjI4MDc5Ni0wLjMxOTk1Ny0xMi40MTYzOTYtMTIuNTc2Mzc0LTEyLjI1NjQxNy0zMi44NjQ0IDAuMzUyNjQxLTQ1LjI0ODExMmwyNTYuNDc5OTM1LTI1Mi42NzE0MTVjMC4wOTYzMzEtMC4wOTYzMzEgMC4yMjM2MjYtMC4xMjcyOTUgMC4zMTk5NTctMC4yMjM2MjZzMC4xMjcyOTUtMC4yMjM2MjYgMC4yMjM2MjYtMC4zMTk5NTdjMi4wMTYwNzMtMS45MTk3NDIgNC40NDg0MzQtMy4wMDg2MjggNi43ODQ0NjQtNC4yODg0NTYgMS4xNTI1MzMtMC42NzI1OTggMi4xNDMzNjgtMS42NjM0MzIgMy4zNTk1NDgtMi4xNDMzNjggMy43NzU4MzctMS40NzI0OSA3Ljc3NTI5OS0yLjIzOTY5OSAxMS43NDM3OTgtMi4yMzk2OTkgNC4xOTIxMjUgMCA4LjM4NDI0OSAwLjgzMjU3NiAxMi4yODczODEgMi40OTYwMDkgMS4zMTI1MTIgMC41NDM1ODMgMi4zMzYwMyAxLjY2MzQzMiAzLjU1MjIxMSAyLjM2ODcxNCAyLjM5OTY3NyAxLjQwODg0MyA0Ljg5NTY4NiAyLjU5MjM0IDYuOTQ0NDQzIDQuNjcyMDYgMC4wOTYzMzEgMC4wOTYzMzEgMC4xMjcyOTUgMC4yNTYzMSAwLjIyMzYyNiAwLjM1MjY0MSAwLjA2MzY0NyAwLjA5NjMzMSAwLjE5MjY2MiAwLjEyNzI5NSAwLjI4NzI3MyAwLjIyMzYyNkw4ODkuMjc3NDYzIDU1Mi41Nzk0OTJDOTAxLjQzOTI2OSA1NjUuNDA4NzM1IDkwMC43NjgzOTEgNTg1LjY2NDA3NyA4ODcuOTA0NzQ0IDU5Ny43OTE0OHoiICBob3Jpei1hZHYteD0iMTAyNCIgLz4KCiAgICAKICAgIDxnbHlwaCBnbHlwaC1uYW1lPSJzaGFuY2h1IiB1bmljb2RlPSImIzU5MjExOyIgZD0iTTYwNy44OTc4NjcgMTI3Ljk1Njk5NmMtMTcuNzE3NDUzIDAtMzEuOTk0NjI1IDE0LjI3NzE3MS0zMS45OTQ2MjUgMzEuOTk0NjI1TDU3NS45MDMyNDIgNTEyLjA2NDUwNWMwIDE3LjcxNzQ1MyAxNC4yNzcxNzEgMzEuOTk0NjI1IDMxLjk5NDYyNSAzMS45OTQ2MjVzMzEuOTk0NjI1LTE0LjI3NzE3MSAzMS45OTQ2MjUtMzEuOTk0NjI1bDAtMzUxLjk0MDg3QzYzOS44OTI0OTEgMTQyLjQwNjE4MiA2MjUuNjE1MzIgMTI3Ljk1Njk5NiA2MDcuODk3ODY3IDEyNy45NTY5OTZ6TTQxNS45MzAxMTkgMTI3Ljk1Njk5NmMtMTcuNzE3NDUzIDAtMzEuOTk0NjI1IDE0LjI3NzE3MS0zMS45OTQ2MjUgMzEuOTk0NjI1TDM4My45MzU0OTUgNTEyLjA2NDUwNWMwIDE3LjcxNzQ1MyAxNC4yNzcxNzEgMzEuOTk0NjI1IDMxLjk5NDYyNSAzMS45OTQ2MjUgMTcuNzE3NDUzIDAgMzEuOTk0NjI1LTE0LjI3NzE3MSAzMS45OTQ2MjUtMzEuOTk0NjI1bDAtMzUxLjk0MDg3QzQ0Ny45MjQ3NDQgMTQyLjQwNjE4MiA0MzMuNjQ3NTczIDEyNy45NTY5OTYgNDE1LjkzMDExOSAxMjcuOTU2OTk2ek05MjguMDE2MTI2IDY3Mi4wMzc2MjhsLTE1OS45NzMxMjMgMEw3NjguMDQzMDA0IDczNi4wMjY4NzdjMCA1Mi45ODAzNDYtNDIuNjU5NDk5IDk1Ljk4Mzg3NC05NS4yOTU4MTcgOTUuOTgzODc0TDM1MS45NDA4NyA4MzIuMDEwNzUxYy01Mi45ODAzNDYgMC05NS45ODM4NzQtNDMuMDAzNTI4LTk1Ljk4Mzg3NC05NS45ODM4NzRsMC02My45ODkyNDktMTU5Ljk3MzEyMyAwYy0xNy43MTc0NTMgMC0zMS45OTQ2MjUtMTQuMjc3MTcxLTMxLjk5NDYyNS0zMS45OTQ2MjVzMTQuMjc3MTcxLTMxLjk5NDYyNSAzMS45OTQ2MjUtMzEuOTk0NjI1bDgzMi4wMzIyNTMgMGMxNy43MTc0NTMgMCAzMS45OTQ2MjUgMTQuMjc3MTcxIDMxLjk5NDYyNSAzMS45OTQ2MjVTOTQ1LjczMzU4IDY3Mi4wMzc2MjggOTI4LjAxNjEyNiA2NzIuMDM3NjI4ek0zMTkuOTQ2MjQ2IDczNi4wMjY4NzdjMCAxNy41NDU0MzkgMTQuNDQ5MTg1IDMxLjk5NDYyNSAzMS45OTQ2MjUgMzEuOTk0NjI1bDMyMC44MDYzMTYgMGMxNy41NDU0MzkgMCAzMS4zMDY1NjgtMTQuMTA1MTU3IDMxLjMwNjU2OC0zMS45OTQ2MjVsMC02My45ODkyNDlMMzE5Ljk0NjI0NiA2NzIuMDM3NjI4IDMxOS45NDYyNDYgNzM2LjAyNjg3NyAzMTkuOTQ2MjQ2IDczNi4wMjY4Nzd6TTczNi4wNDgzNzktNjQuMDEwNzUxIDI4OC4xMjM2MzUtNjQuMDEwNzUxYy01Mi45ODAzNDYgMC05NS45ODM4NzQgNDMuMDAzNTI4LTk1Ljk4Mzg3NCA5NS45ODM4NzRMMTkyLjEzOTc2MSA1MTIuNDA4NTM0YzAgMTcuNzE3NDUzIDE0LjI3NzE3MSAzMS45OTQ2MjUgMzEuOTk0NjI1IDMxLjk5NDYyNXMzMS45OTQ2MjUtMTQuMjc3MTcxIDMxLjk5NDYyNS0zMS45OTQ2MjVsMC00ODAuNDM1NDExYzAtMTcuNzE3NDUzIDE0LjQ0OTE4NS0zMS45OTQ2MjUgMzEuOTk0NjI1LTMxLjk5NDYyNWw0NDguMDk2NzU4IDBjMTcuNzE3NDUzIDAgMzEuOTk0NjI1IDE0LjI3NzE3MSAzMS45OTQ2MjUgMzEuOTk0NjI1TDc2OC4yMTUwMTggNTExLjIwNDQzNWMwIDE3LjcxNzQ1MyAxNC4yNzcxNzEgMzEuOTk0NjI1IDMxLjk5NDYyNSAzMS45OTQ2MjVzMzEuOTk0NjI1LTE0LjI3NzE3MSAzMS45OTQ2MjUtMzEuOTk0NjI1bDAtNDc5LjIzMTMxMkM4MzIuMDMyMjUzLTIwLjgzNTIwOSA3ODkuMDI4NzI1LTY0LjAxMDc1MSA3MzYuMDQ4Mzc5LTY0LjAxMDc1MXoiICBob3Jpei1hZHYteD0iMTAyNCIgLz4KCiAgICAKICAgIDxnbHlwaCBnbHlwaC1uYW1lPSJpLWxlZnQiIHVuaWNvZGU9IiYjNTg5MTk7IiBkPSJNMzc5LjEwNCAzODYuNjU2YzQuNjQ3LTMuNDY1IDcuNzA3LTUuMjExIDEwLjEwMi03LjYxNCAxMTEuODgyLTExMS43NzcgMjIzLjY4LTIyMy42NDIgMzM1LjU4NC0zMzUuMzk1IDExLjQ5OC0xMS40ODIgMTcuNjAxLTI0LjQzMiAxNC4wNjAtNDAuODkzLTYuNTQ5LTMwLjQ0NC00Mi43MjQtNDMuMDU2LTY2LjcwMi0yMy4yMDctMi42MzggMi4xNzktNS4wMDYgNC42OTEtNy40MyA3LjExNi0xMjIuMTQ3IDEyMi4xMzEtMjQ0LjI5MSAyNDQuMjY4LTM2Ni40MzQgMzY2LjQxMS0yMi4yMTggMjIuMjE4LTIyLjIzNiA0NC45NDQtMC4wMzMgNjcuMTQzIDEyMi43NDkgMTIyLjc1NSAyNDUuNTQ4IDI0NS40NTEgMzY4LjE4NSAzNjguMzE2IDEyLjE2NiAxMi4xOTEgMjYuMDYyIDE3LjU4OSA0Mi43MzQgMTMuMzI3IDI4Ljk1Ny03LjM5NSA0MC4yNDctNDIuNTExIDIxLjQ2Mi02NS44MjctMi4zMjMtMi44ODEtNS4wNDYtNS40NTctNy42NjktOC4wODMtMTExLjIxNC0xMTEuMjI4LTIyMi40MzUtMjIyLjQ1OS0zMzMuNzA2LTMzMy42MzQtMi40MDctMi40MDQtNS40NjktNC4xNjYtMTAuMTQ4LTcuNjZ6IiAgaG9yaXotYWR2LXg9IjEwMjQiIC8+CgogICAgCgoKICA8L2ZvbnQ+CjwvZGVmcz48L3N2Zz4K') format('svg'); /* iOS 4.1- */
    }

    .rg-iconfont {
        font-family:"rg-iconfont" !important;
        font-size:14px;
        font-style:normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .icon-warn:before { content: "\e663"; }
    .icon-selectall:before { content: "\e722"; }
    .icon-selected:before { content: "\e72e"; }
    .icon-removeall:before { content: "\e74b"; }
    .icon-back:before { content: "\e627"; }
</style>