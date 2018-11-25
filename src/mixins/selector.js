import {AREA_LEVEL, CITY_LEVEL, PROVINCE_LEVEL, TOWN_LEVEL} from "../constants";

export default {
    data(){
        return {
            show: false
        };
    },
    methods: {
        close(){
            this.$nextTick(()=>{
                this.$refs.drop.$emit('show');
            });
        },
        showChange(val){
            this.show = val;
        },
        isChrome(){
            return navigator.vendor !== undefined && navigator.vendor.indexOf("Google") !== -1;
        },
        isEdge(){
            return navigator.userAgent.indexOf("Edge") >= 0;
        }
    }
};