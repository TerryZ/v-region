import language from '../language';
import {srcProvince, srcCity, srcArea} from "../region.js";
import {PROVINCE_LEVEL, CITY_LEVEL, AREA_LEVEL, TOWN_LEVEL} from '../constants';

export default {
    props:{
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
            //levels list data
            listProvince: [],
            listCity: [],
            listArea: [],
            listTown: [],

            lang: {},
            init: this.selected,
            haveTown: true,

            //return data
            dProvince: null,
            dCity: null,
            dArea: null,
            dTown: null
        };
    },
    watch:{
        dProvince: {
            handler: 'provinceChange',
            deep: true
        },
        dCity: {
            handler: 'cityChange',
            deep: true
        },
        dArea: {
            handler: 'areaChange',
            deep: true
        },
        dTown: {
            handler: 'townChange',
            deep: true
        },
        /**
         * initialize region selected
         */
        selected: {
            handler(val){
                if(val && Object.keys(val).length){
                    this.init = val;
                    this.initSelected(PROVINCE_LEVEL);
                }
            },
            deep: true
        }
    },
    computed: {
        selectedText(){
            let arr = [];
            if(this.dProvince) arr.push(this.dProvince.value);
            if(this.dCity) arr.push(this.dCity.value);
            if(this.dArea) arr.push(this.dArea.value);
            if(this.dTown) arr.push(this.dTown.value);
            return arr.join('');
        }
    },
    methods:{
        changeValues(){
            this.$nextTick(()=>{
                this.$emit('values', {
                    province: this.dProvince,
                    city: this.dCity,
                    area: this.dArea,
                    town: this.dTown
                });
            });
        },
        initSelected(level){
            let ini = this.init, count = 0, init = !!this.init;
            if(ini && Object.keys(ini).length){
                switch(level){
                    case PROVINCE_LEVEL://province
                        if(ini.province)
                            this.dProvince = this.listProvince.find(val=>val.key === ini.province);
                        break;
                    case CITY_LEVEL://city
                        if(this.city && ini.city && this.listCity.length)
                            this.dCity = this.listCity.find(val=>val.key === ini.city);
                        break;
                    case AREA_LEVEL://area
                        if(this.area && ini.area && this.listArea.length)
                            this.dArea = this.listArea.find(val=>val.key === ini.area);
                        break;
                    case TOWN_LEVEL://town
                        if(this.town && ini.town && this.listTown.length)
                            this.dTown = this.listTown.find(val=>val.key === ini.town);
                        break;
                }
                if(ini.province) count++;
                if(this.city && ini.city) count++;
                if(this.area && ini.area) count++;
                if(this.town && ini.town) count++;
                //level number start with 0
                if((level + 1) === count) this.init = null;
            }
            return init;
        },
        /**
         * load city list by province data
         * @param province
         * @returns {Array}
         */
        loadCity(province){
            let list = null;
            if(province && Object.keys(province).length) {
                list = srcCity.filter(val=>{
                    let num = Number.parseInt(province.key);
                    return (val.key - num) < 1e4 && (val.key%num) < 1e4;
                });
                //Municipalities directly under the central government
                if(!list.length) list.push(province);
            }else list = [];
            return list;
        },
        /**
         * load area list by city data
         * @param city
         * @returns {Array}
         */
        loadArea(city){
            let list = null;
            if(city && Object.keys(city).length){
                let cityKey = Number.parseInt(city.key), isNotProvince = cityKey%1e4, calcNum = isNotProvince?100:1e4;
                list = srcArea.filter(val=>(val.key - cityKey) < calcNum && val.key%cityKey < calcNum);
                //Prefecture-level city
                if(!list.length) list.push(city);
            }else list = [];
            return list;
        },
        /**
         * load town list by area data
         * @param area
         * @returns {Array}
         */
        loadTown(area){
            let list = null;
            if(area && Object.keys(area).length){
                let towns = null;
                try{ towns = require(`../town/${area.key}.json`); } catch (e) {}
                list = towns && Object.keys(towns).length ?
                    Object.entries(towns).map(val=>({ key: val[0], value: val[1] })) : [];
            }else list = [];
            this.haveTown = !!!(this.dProvince && this.dCity && area && !list.length);
            return list;
        },
        baseProvinceChange(newVal, oldVal){
            if(this.city){
                this.listCity = this.loadCity(newVal);
                //clear city selected result
                if(!this.initSelected(CITY_LEVEL)){
                    if(!this.dCity) this.cityChange(null);
                    else this.dCity = null;
                }
            }else this.changeValues();
        },
        baseCityChange(newVal, oldVal){
            if(this.area){
                this.listArea = this.loadArea(newVal);
                //clear city selected result
                if(!this.initSelected(AREA_LEVEL)){
                    if(!this.dArea) this.areaChange(null);
                    else this.dArea = null;
                }
            }else this.changeValues();
        },
        baseAreaChange(newVal, oldVal){
            if(this.town){
                this.listTown = this.loadTown(newVal);
                //clear city selected result
                if(!this.initSelected(TOWN_LEVEL)){
                    if(!this.dTown) this.townChange(null);
                    else this.dTown = null;
                }
            }else this.changeValues();
        },
        baseTownChange(newVal, oldVal){
            this.changeValues();
        }
    },
    created(){
        this.lang = language[this.i18n];
    },
    beforeMount(){
        //sort by length and code
        this.listProvince = this.ui ? srcProvince.concat().sort((a,b)=>{
            let gap = a.value.length - b.value.length;
            return gap === 0?Number(a.key)-Number(b.key):gap;
        }) : srcProvince.concat();
    },
    mounted(){
        //console.log(this)
        if(this.selected && Object.keys(this.selected).length) this.initSelected(PROVINCE_LEVEL);
    }
};