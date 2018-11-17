<template>
    <!-- plain text only -->
    <span v-text="selectedText"></span>
</template>

<script>
    import mixins from './mixins';
    export default {
        name: "TextRegion",
        mixins: [mixins],
        inheritAttrs: false,
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