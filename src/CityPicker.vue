<template>
    <div>
        <div class="rg-caller-container" @click.stop.prevent="open" ref="caller">
            <slot>
                <!-- default region selector caller button -->
                <button type="button" :class="['rg-default-btn', {'rg-opened': show}]">
                    {{selectedText?selectedText:lang.pleaseSelect}}
                    <span class="rg-iconfont icon-clear rg-clear-btn" :title="lang.clear" v-if="selectedText" @click.stop.prevent="clear"></span>
                    <span class="rg-caret-down" v-else></span>
                </button>
            </slot>
        </div>
        <v-drop-down ref="drop" @show-change="showChange">
            <!-- search bar -->
            <div class="rg-search-bar" >
                <input type="text" autocomplete="off" ref="input" v-model.trim="query" class="rg-input" placeholder="">
            </div>
            <div class="rg-picker">
                <div class="rg-picker__row" v-for="item in list">
                    <dl>
                        <dt v-text="item.province.value"></dt>
                        <dd>
                            <ul>
                                <li v-for="city in item.citys"
                                    @click="pick(city)"
                                    :class="{selected: picked.includes(city)}"
                                    v-text="city.value"></li>
                            </ul>
                        </dd>
                    </dl>
                </div>
            </div>
        </v-drop-down>
    </div>
</template>

<script>
    import {srcProvince, srcCity} from "./region.js";
    import selector from './mixins/selector';
    import language from './language';
    import dropDown from 'v-dropdown';
    export default {
        name: "CityPicker",
        mixins: [selector],
        inheritAttrs: false,
        components: {
            'v-drop-down': dropDown
        },
        props: {
            selected: Array
        },
        data(){
            return {
                /**
                 * [{
                 *     province: { key: '', value: ''},
                 *     citys: [
                 *          {key: '', value: ''},
                 *          {key: '', value: ''},
                 *          ...
                 *     ]
                 * }]
                 */
                list: [],
                listBuild: [],

                query: '',
                picked: [],
                lang: {}
            };
        },
        beforeMount(){
            this.lang = language['cn'];
            this.prepared();
            this.list = this.listBuild.concat();
        },
        computed: {
            selectedText(){
                return this.picked.map(val=>val.value).join(',');
            }
        },
        watch: {
            /**
             * region search
             * search region description first, if no result, then search region key
             * @param value
             */
            query(value){
                if(!value) this.list = this.listBuild.concat();
                else{
                    let list = [];
                    this.list = this.listBuild.filter(val=>{
                        let citys = val.citys.filter(city=> city.value.includes(value));
                        if(citys.length) list.push({ province: val.province,citys: citys });
                    });
                    this.list = list;
                }
            },
            /**
             * initialize region selected
             */
            selected: {
                handler(value){
                    if(value && Array.isArray(value) && value.length) {
                        let tmp = srcProvince.filter(val=> value.includes(val.key));
                        this.picked = [...tmp, ...srcCity.filter(val => value.includes(val.key))];
                    }
                },
                immediate: true
            }
        },
        methods: {
            prepared(){
                //beijing, tianjin, shanghai, chongqing
                const municipalitys = ['110000', '120000', '310000', '500000'], municipality = '000000',
                    //hongkong, macao
                    specials = ['810000', '820000'], special = '000010';
                let listTmp = [],
                    municipalityObj = {
                        province: { key: municipality, value: '直辖市' },
                        citys: []
                    },
                    specialObj = {
                        province: { key: special, value: '特别行政区' },
                        citys: []
                    };
                //set provinces
                srcProvince.forEach(val=>{
                    if(municipalitys.includes(val.key)) municipalityObj.citys.push(val);
                    else if(specials.includes(val.key)) specialObj.citys.push(val);
                    else listTmp.push({ province: val,citys: [] });
                });
                listTmp.forEach(val=>{
                    val.citys = srcCity.filter(value=>{
                        let num = Number.parseInt(val.province.key);
                        return (value.key - num) < 1e4 && (value.key%num) < 1e4;
                    });
                });
                this.listBuild = [...[municipalityObj], ...listTmp, ...[specialObj]];
            },
            open(){
                this.$refs.drop.$emit('show', this.$refs.caller);
                this.inputFocus();
            },
            inputFocus(){
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
            clear(){
                this.picked.splice(0, this.picked.length);
                this.close();
            },
            pick(item){
                if(!this.picked.includes(item)) this.picked.push(item);
                else this.picked.splice(this.picked.findIndex(val=>val.key === item.key), 1);
                this.$emit('values', this.picked);
            }
        }
    }
</script>

<style lang="scss">
    div.rg-search-bar{
        padding: 10px;
        input.rg-input {
            background-color: #fafafa;
            &:focus{ background-color: white; }
        }
    }
    div.rg-picker{
        width: 400px;max-height: 340px;overflow-y: auto;padding: 0 0 0 10px;
        div.rg-picker__row{
            margin-bottom: 15px;clear: both;
            dl{
                margin: 0;padding: 0;overflow: hidden;
                dt {
                    float: left;width: 60px;clear: left;text-align: right;
                    font-weight: bold;font-size: 14px;color: #888;
                }
                dd {
                    margin-left: 75px;font-size: 13px;color: #666;
                    ul {
                        margin: 0;padding: 0;list-style: none;
                        li {
                            margin-right: 10px;display: inline-block;cursor: pointer;
                            &.selected { color: #2A94EE;font-weight: bold; }
                        }
                    }
                }
            }
        }
    }
</style>