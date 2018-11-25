<template>
    <div class="rg-select">
        <div :class="['rg-select__el', {'rg-select__el--active': show, 'rg-select_el--disabled': disabled}]"
             @click="open" ref="caller">
            <div class="rg-select__content" v-text="content"></div>
            <span class="rg-select__caret"></span>
        </div>
        <v-drop-down ref="drop" @show-change="showChange">
            <ul class="rg-select__list">
                <li v-if="blank" v-text="blankText" @click="pick(null)"></li>
                <li v-for="item in list"
                    :class="{selected:selected && selected.key === item.key}"
                    v-text="item.value"
                    @click="pick(item)"></li>
            </ul>
        </v-drop-down>
    </div>
</template>

<script>
    import dropDown from 'v-dropdown';
    export default {
        name: "SelectElement",
        components:{
            'v-drop-down': dropDown
        },
        props: {
            list: {
                type: Array,
                required: true
            },
            blankText: String,
            value: Object
        },
        data(){
            return {
                selected: this.value,
                show: false
            };
        },
        inject: ['disabled', 'blank'],
        watch: {
            value: {
                handler(val){
                    this.selected = val;
                },
                deep: true
            }
        },
        computed:{
            content(){
                return (this.selected && this.selected.value)?
                    this.selected.value:
                    this.blank?this.blankText:'&nbsp;';
            }
        },
        methods: {
            pick(val){
                this.selected = val;
                this.$emit('input', val);
                this.close();
            },
            open(){
                if(!this.disabled) this.$refs.drop.$emit('show', this.$refs.caller);
            },
            close(){
                this.$nextTick(()=>{
                    this.$refs.drop.$emit('show');
                });
            },
            showChange(val){
                this.show = val;
            }
        }
    }
</script>

<style lang="scss">
div.rg-select{
    display: inline-block;
    position: relative;
    div.rg-select__el{
        border: 1px solid #ddd;
        border-radius: 3px;
        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        cursor: pointer;
        color: #666;
        div.rg-select__content{
            padding: 6px 30px 6px 15px;
            font-size: 14px;
            display: inline-block;
            min-width: 80px;
        }
        &:hover{ border: 1px solid #bbb; }
        &.rg-select__el--active{
            outline: 0;
            box-shadow: 0 0 0 3px rgba(180,180,180,.25);
            border: 1px solid #888;
            span.rg-select__caret{ transform: rotate(180deg); }
        }
        &.rg-select_el--disabled {
            border: 1px solid #eee;
            background-color: #f5f5f5;
            color: #aaa;
        }
    }
    span.rg-select__caret{
        position: absolute;
        top: 50%;
        right: 12px;
        margin-top: -1px;
        vertical-align: middle;
        display: inline-block;
        width: 0;
        height: 0;
        margin-left: 2px;
        border-top: 4px dashed;
        /*border-top: 4px solid\9;*/
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
        transition:transform .2s ease;
    }
}
ul.rg-select__list{
    list-style: none;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 300px;
    margin: 0;
    padding: 3px 0;
    li {
        padding: 3px 10px;
        cursor: pointer;
        min-width: 80px;
        color: #888;
        font-size: 13px;
        &:hover{ background-color: #F5F7FA; }
        &.selected{
            background-color: #57A0E2;
            color: white;
        }
    }
}
</style>