<template>
    <ul v-if="list.length" class="rg-column">
        <li v-for="col in list"
            :class="{ selected: picked && col.key === picked.key }"
            @click="click(col)">
            <span v-text="col.value"></span>
            <span class="rg-iconfont icon-right rg-caret-right" v-if="haveChild"></span>
            <!--<span class="rg-caret-right" v-if="haveChild"></span>-->
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            list:{
                type: Array,
                required: true
            },
            haveChild:{
                type: Boolean,
                default: true
            },
            value: Object
        },
        data(){
            return {
                picked: this.value
            };
        },
        watch:{
            value(val){
                this.picked = val;
            }
        },
        methods: {
            click(col){
                //console.dir(col)
                this.picked = col;
                this.$emit('input', col);
            }
        }
    }
</script>

<style lang="scss">
.rg-column{
    padding: 5px 0;
    margin: 0;
    list-style:none;

    height: 300px;
    display: inline-block;
    vertical-align: top;
    overflow-y: auto;
    box-sizing: border-box;
    min-width: 160px;
    font-size: 0;
    float: left;

    li{
        /*list-style: none;*/
        /*list-style-type: none;*/
        font-size: 14px;
        padding: 5px 30px 5px 10px;
        color: #777;
        position: relative;
        box-sizing: border-box;
        outline: none;
        list-style:none;
        overflow: hidden;

        &:hover{
            background-color: #F5F5F5;
            color: black;
            cursor: pointer;
        }
        &.selected{
            background-color: #55A2E6;
            color: white;
        }
    }
}
.rg-caret-right {
    position: absolute;
    top: 6px;
    right: 5px;
    font-size: 12px;
}
/*.rg-caret-right {*/
    /*display: inline-block;*/
    /*width: 0;*/
    /*height: 0;*/
    /*margin-left: 5px;*/
    /*border-top: 4px solid transparent;*/
    /*border-left: 4px solid;*/
    /*border-bottom: 4px solid transparent;*/
    /*!*float: right;*!*/
    /*!*margin-top: 3px;*!*/
    /*vertical-align: middle;*/
    /*content: "";*/

    /*position: absolute;*/
    /*top: 11px;*/
    /*right: 7px;*/
/*}*/
</style>