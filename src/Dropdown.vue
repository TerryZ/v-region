<template>
    <div class="v-dropdown-container" :style="[styleSheet]" v-show="show">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "v-dropdown",
        props:{
            position: {
                type: String,
                default: 'left'
            }
        },
        data(){
            return {
                show: false,
                styleSheet: {
                    top: '',
                    left: ''
                }
            };
        },
        watch:{
        },
        methods: {
            visible(state, caller){
                if(typeof(state) === 'boolean'){
                    this.show = state;
                    let that = this;
                    this.$nextTick(()=>{
                        if(that.show) that.adjust(caller);
                    });
                }
            },
            adjust(caller){
                let pos = caller.getBoundingClientRect(), gap = 5, t = 0, l = 0;
                let menuPos = this.$el.getBoundingClientRect();
                let screenScrollTop = window.scrollY, viewHeight = document.body.clientHeight;
                //console.log(this.caller);
                //console.log(pos);
                //console.log(screenScrollTop)
                if(this.rightClick){
                    var top = this.y;
                    if((this.y + menuPos.height) > (screenScrollTop + viewHeight))
                        top = this.y - menuPos.height;
                    l = this.x;
                    t = top;
                }else{
                    t = pos.top + pos.height + gap + screenScrollTop;
                    switch (this.position){
                        case 'left':
                            l = pos.left;
                            break;
                        case 'center':
                            l = (pos.left + (pos.width / 2)) - (menuPos.width / 2);
                            break;
                        case 'right':
                            l = (pos.left + pos.width) - menuPos.width;
                            break;
                    }
                }

                /*
                if(!this.regular) {
                    let height = this.$refs.list.querySelector('li:first-child').getBoundingClientRect().height;
                    this.listStyle['max-height'] = (height * this.listSize) + 'px';
                }
                */

                this.styleSheet.top = t + 'px';
                this.styleSheet.left = l + 'px';
            },
            whole(e){
                let that = this;
                if(this.show){
                    let idx = e.path.findIndex(val=>val.className && val.className.includes('v-dropdown-container'));
                    if(idx === -1) this.show = false;
                }
            }
        },
        mounted(){
            //console.log(this.$el.style.display)
            //console.log(this.caller)
            this.$on('show', this.visible);
            document.addEventListener('mousedown', this.whole);
        },
        destroyed(){
            this.$off('show', this.visible);
            document.removeEventListener('mousedown', this.whole);
        }
    }
</script>

<style lang="scss" scoped>
    div.v-dropdown-container{
        border: 1px solid #D6D7D7;
        margin: 0;
        padding: 0;
        display: inline-block;
        position: absolute;
        top:0;
        left:0;
        vertical-align: middle;
        min-width: 300px;
        box-sizing: border-box;

        background-color: #F5F5F5;
        border-radius: 2px;
        box-shadow: 0 3px 12px rgba(0,0,0,0.2);
        -moz-box-shadow: 0 3px 12px rgba(0,0,0,0.2);
        -webkit-box-shadow: 0 3px 12px rgba(0,0,0,0.2);
        z-index: 100;
        &.sm_regular { width: auto;min-width: 150px; }
        &.sm_embed { position: relative; }
        /* Select only */
        & > .sm_select_ng { background: #fcc; }
        /*输入框设置了input-block-level样式时的特殊情况修复*/
        input.sm_input.input-block-level{
            box-sizing:border-box;
            height: 30px;
            line-height: 30px;
            min-height: 30px;
            width: 100%;
        }
    }
</style>