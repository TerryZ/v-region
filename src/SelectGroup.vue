<template>
    <div>
        <v-select-el :blank-text="lang.pleaseSelect" :list="listProvince" v-model="dProvince"></v-select-el>
        <v-select-el :blank-text="lang.pleaseSelect"
                     v-if="city" :list="listCity" v-model="dCity"></v-select-el>
        <v-select-el :blank-text="lang.pleaseSelect"
                     v-if="area && city" :list="listArea" v-model="dArea"></v-select-el>
        <v-select-el v-if="town && area && city && haveTown"
                     :blank-text="lang.pleaseSelect" :list="listTown" v-model="dTown"></v-select-el>
    </div>
</template>

<script>
    import mixins from './mixins';
    import selectElement from './SelectElement';
    import {PROVINCE_LEVEL, CITY_LEVEL, AREA_LEVEL, TOWN_LEVEL} from './constants';
    export default {
        name: "SelectGroup",
        mixins: [mixins],
        components: {
            'v-select-el': selectElement
        },
        props:{
            blank: {
                type: Boolean,
                default: true
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        inheritAttrs: false,
        provide(){
            return {
                disabled: this.disabled,
                blank: this.blank
            };
        },
        methods: {
            provinceChange(newVal, oldVal){
                this.baseProvinceChange(newVal, oldVal);
            },
            cityChange(newVal, oldVal){
                this.baseCityChange(newVal, oldVal);
            },
            areaChange(newVal, oldVal){
                this.baseAreaChange(newVal, oldVal);
            },
            townChange(newVal, oldVal){
                this.baseTownChange(newVal, oldVal);
            }
        }
    }
</script>