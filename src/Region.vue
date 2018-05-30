<template>
    <div>
        <select :class="className" v-model="nowProvince" v-if="province">
            <option value="" selected v-if="blank">{{lang.pleaseSelect}}</option>
            <option :value="p.key" v-for="p in listProvince">{{p.value}}</option>
        </select>
        <select :class="className" v-model="nowCity" v-if="city && haveCity">
            <option value="" selected v-if="blank">{{lang.pleaseSelect}}</option>
            <option :value="c.key" v-for="c in listCity">{{c.value}}</option>
        </select>
        <select :class="className" v-model="nowArea" v-if="(area && city) || !haveCity">
            <option value="" selected v-if="blank">{{lang.pleaseSelect}}</option>
            <option :value="a.key" v-for="a in listArea">{{a.value}}</option>
        </select>
        <select :class="className" v-model="nowTown" v-if="town && area && city">
            <option value="" selected v-if="blank">{{lang.pleaseSelect}}</option>
            <option :value="key" v-for="value,key in listTown">{{value}}</option>
        </select>
    </div>
</template>

<script>
    import {srcProvince, srcCity, srcArea} from "./region.js";
    import language from './language';

    export default {
        name: "v-region",
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
            selected: Object
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
                init: true
            };
        },
        watch:{
            nowProvince(val){
                if(this.city){
                    this.nowCity = '';
                    if(this.area) this.nowArea = '';
                    if(this.town) this.nowTown = '';
                    if(this.listArea.length) this.listArea.splice(0, this.listArea.length);
                    this.listCity = srcCity.filter(val=>{
                        //console.log(val.key + '%' + Number.parseInt(this.nowProvince) + '=' + val.key%Number.parseInt(this.nowProvince));
                        let num = Number.parseInt(this.nowProvince);
                        return (val.key - num) < 1e4 && (val.key%num) < 1e4;
                    });

                    this.haveCity = this.listCity.length ? true : false;

                    this.$nextTick(()=>{
                        if(!this.haveCity && this.area) this.changeCity();
                        else{
                            if(this.selected && this.selected.city) this.nowCity = this.selected.city;
                        }
                    });
                }

                this.changeValues();
                this.$nextTick(()=>{
                    if(this.init && !this.city && !this.area) this.init = false;
                });
            },
            nowCity(val){
                this.changeCity();
                this.changeValues();
                this.$nextTick(()=>{
                    if(this.init && !this.area) this.init = false;
                });
            },
            nowArea(val){
                let that = this;
                if(val && this.town){
                    if(this.town) this.nowTown = '';
                    let towns = require(`./town/${val}.json`);
                    this.listTown = towns;
                }
                if(this.selected && this.selected.town) this.nowTown = this.selected.town;
                this.changeValues();
                this.$nextTick(()=>{
                    if(that.init && !that.town) that.init = false;
                });
            },
            nowTown(val){
                this.changeValues();
                this.$nextTick(()=>{
                    if(this.init) this.init = false;
                });
            },
            selected: {
                handler(val){
                    if(val && Object.keys(val).length){
                        if(val.province) this.nowProvince = val.province;
                    }
                },
                deep: true
            }
        },
        methods:{
            changeCity(){
                if((this.area && this.nowCity) || (!this.haveCity && this.province)){
                    this.nowArea = '';
                    if(this.town) this.nowTown = '';
                    let thisCity = Number.parseInt(this.haveCity?this.nowCity:this.nowProvince);
                    let range = this.haveCity ? 100 : 1000;
                    this.listArea = srcArea.filter(val=>{
                        return (val.key - thisCity) < range && val.key%thisCity < range;
                    });
                }
                if(this.selected && this.selected.area) this.nowArea = this.selected.area;
            },
            changeValues(){
                if(!this.init){
                    this.$emit('values', {
                        province: this.nowProvince,
                        city: this.nowCity,
                        area: this.nowArea,
                        town: this.nowTown
                    });
                }
            }
        },
        beforeMount(){
            this.lang = language[this.i18n];
        },
        mounted(){
            this.listProvince = srcProvince;
            this.className = this.$el.className;
            this.$el.className = 'v-region';

            if(this.selected && this.selected.province) this.nowProvince = this.selected.province;
            if(!this.selected || (
                Object.keys(this.selected).length &&
                !this.selected.province &&
                    !this.selected.city &&
                    !this.selected.area &&
                    !this.selected.town
            )) this.init = false;
        }
    }
</script>

<style lang="scss">
    div.v-region {
        select {
            width: auto;
            display: inline-block;
            overflow: hidden;
            box-sizing: content-box;
            padding: 0 12px;
            margin-right: 5px;
        }
    }
    .region-province, .region-city, .region-area, .region-town {
        select {
            width: auto;
            display: inline-block;
            overflow: hidden;
            box-sizing: content-box;
            padding: 0 12px;
            margin-right: 5px;
        }
    }
</style>