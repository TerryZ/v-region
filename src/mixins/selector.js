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
                this.$refs.drop.$emit('show', false);
            });
        },
        showChange(val){
            this.show = val;
        }
    }
};