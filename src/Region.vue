<template>
    <div>
        <!-- plain text only -->
        <v-text-region v-if="text && !ui" v-bind="$attrs" ></v-text-region>
        <!-- select elements mode -->
        <v-select-group v-if="!text && !ui" v-bind="$attrs" v-on="$listeners"></v-select-group>
        <!-- selector mode -->
        <v-tab-selector v-if="ui && !column && !cityPicker" v-bind="$attrs" v-on="$listeners">
            <slot></slot>
        </v-tab-selector>
        <!-- column group mode -->
        <v-column-group v-if="ui && column && !cityPicker" v-bind="$attrs" v-on="$listeners">
            <slot></slot>
        </v-column-group>
        <!-- city picker -->
        <v-city-picker v-if="ui && !column && cityPicker" v-bind="$attrs" v-on="$listeners">
            <slot></slot>
        </v-city-picker>
    </div>
</template>

<script>
    import selectGroup from './SelectGroup';
    import tabSelector from './TabSelector';
    import columnGroup from './ColumnGroup';
    import textRegion from './TextRegion';
    import cityPicker from './CityPicker';
    export default {
        name: "v-region",
        components: {
            'v-select-group': selectGroup,
            'v-text-region': textRegion,
            'v-tab-selector': tabSelector,
            'v-column-group': columnGroup,
            'v-city-picker': cityPicker
        },
        props:{
            ui: {
                type: Boolean,
                default: false
            },
            column: {
                type: Boolean,
                default: false
            },
            text: {
                type: Boolean,
                default: false
            },
            cityPicker: {
                type: Boolean,
                default: false
            }
        },
        mounted(){
            this.className = this.$el.className;
            this.$el.className = 'v-region';
        }
    }
</script>

<style lang="scss">
    $darkBg: #F5F5F5;
    div.v-region {
        display: inline-block;
        select {
            width: auto;
            display: inline-block;
            overflow: hidden;
            box-sizing: content-box;
            padding: 0 12px;
            margin-right: 5px;
        }
    }
    div.rg-caller-container{ display: inline-block; }

    .rg-default-btn {
        display: inline-block;
        position: relative;
        padding: 6px 12px;
        background-color: white;
        border: 1px solid #cccccc;
        border-radius: 4px;
        font-size: 14px;
        line-height: 1.42857143;
        outline: 0 !important;
        color: #666666;
        transition: color .15s ease-in-out,
        background-color .15s ease-in-out,
        border-color .15s ease-in-out,
        box-shadow .15s ease-in-out;
        span.rg-caret-down { transition:transform .2s ease; }
        span.rg-clear-btn {
            margin-left: 5px;
            &:hover { font-weight: bold; }
        }
        &.rg-opened {
            box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
            border: 1px solid #aaa;
            color: black;
            background-color: #e0e0e0;
            span.rg-caret-down { transform: rotate(180deg); }
            &:hover { background-color: #e0e0e0;border: 1px solid #aaa; }
        }
        &:hover{
            border: 1px solid #aaaaaa;
            background-color: #e0e0e0;
            color: black;
        }
    }

    .rg-caret-down {
        display: inline-block;
        width: 0;
        height: 0;
        margin-left: 5px;
        border-top: 4px solid;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        /*float: right;*/
        /*margin-top: 3px;*/
        vertical-align: middle;
        content: "";
        /*        position: absolute;
                top: 7px;
                right: 10px;*/
    }

    div.rg-header {
        min-width: 400px;
        background-color: $darkBg;
        & > h3 {
            padding: 6px 80px 10px 10px;
            margin: 0;
            text-align: left;
            color: #24292e;
            font-size: 16px;
            white-space: nowrap;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            .rg-header-selected{
                white-space: nowrap;
                text-overflow: ellipsis;
                -o-text-overflow: ellipsis;
                overflow: hidden;
                font-size: 14px;
                max-width: 310px;
                display: inline-block;
            }
        }
        button{
            position: absolute;
            -webkit-appearance: none;
            padding: 0;
            cursor: pointer;
            background: 0 0;
            border: 0;
            outline: none;
            line-height: 100%;
            color: #999999;
            top: 3px;
            font-size: 20px;
            &.rg-close-button { right: 10px;font-size: 26px;top:0;font-weight: 300; }
            &.rg-removeall-button { right: 32px; }
            &.rg-done-button { /*right: 54px;*/right: 8px;top: 4px;i{font-size: 18px;} }
            &:hover { color: black; }
        }
    }
    div.rg-search {
        padding: 2px 10px 10px;
        background-color: $darkBg;
    }

    .rg-input {
        display: block;
        background-color: white;
        margin: 0 !important;
        width: 100%;

        font-size: 14px;
        line-height: 20px;
        min-height: 20px;
        padding: 4px 6px;
        vertical-align: middle;
        box-sizing: border-box;

        outline: none !important;
        height: 30px;

        border-radius: 2px;
        border: 1px solid #dddddd;
        -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        -moz-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        box-shadow: inset 0 1px 1px rgba(0,0,0,.075);

        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        &:focus { border: 1px solid #bbbbbb;box-shadow: 0 0 0 3px rgba(150,150,150, 0.2); }
    }

    /* group type */
    div.rg-level-tabs {
        padding: 0 10px;border-bottom: 1px solid #E6E7E7;
        background-color: $darkBg;
        ul {
            position: relative;
            bottom: -1px;
            padding: 0;
            margin: 0;
            text-align: left;
            li {
                display: inline-block;
                a {
                    display: inline-block;
                    padding: 7px 10px 3px;
                    font-size: 14px;
                    color: #6a737d;
                    text-decoration: none;
                    cursor: pointer;
                    line-height: 100%;
                    background: transparent;
                    border: 1px solid transparent;
                    border-radius: 3px 3px 0 0;
                    font-family: "Helvetica Neue Light", "HelveticaNeue-Light", "Helvetica Neue", Calibri, Helvetica, Arial;
                    &.active {
                        color: #24292e;
                        background-color: #fff;
                        border-color: #dfe2e5;
                        border-bottom-color: #fff;
                        /*font-weight: bold;*/
                    }
                }
            }
        }
    }

    div.rg-results-container{
        background-color: white;
        list-style: none;
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        clear: both;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
        ul.rg-results {
            background-color: white;
            list-style: none;
            margin: 0;
            padding: 5px;
            /*height: 300px;*/
            width: 400px;
            li.rg-item {
                display: inline-block;
                /*border: 1px solid white;*/
                border-radius: 2px;
                margin-right: 5px;
                color: #777;
                &:hover{
                    /*border: 1px solid #DDDDDD;*/
                    /*box-shadow: 0 1px 8px rgba(0,0,0,0.2);*/
                    /*-moz-box-shadow: 0 1px 8px rgba(0,0,0,0.2);*/
                    /*-webkit-box-shadow: 0 1px 8px rgba(0,0,0,0.2);*/
                    color: black;
                    background-color: #F5F5F5;
                }
                &.active {
                    /*border: 1px solid #666666;background-color: #DDDDDD;*/
                    background-color: #55A2E6;color: white;
                }
            }
            & > li {
                /*height: auto;
                line-height: 1;*/
                margin: 0;
                overflow: hidden;
                padding: 3px 10px;
                position: relative;
                text-align: left;
                white-space: nowrap;
                font-size: 14px;
                color: black;
                cursor : pointer;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                &.rg-message-box {
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    box-sizing: content-box;
                    font-size: 14px;
                    cursor: default;
                    i { font-size: 18px; }
                }
            }
        }
    }
    div.rg-selected-container {
        /*padding: 5px 16px 7px;*/
        border-top: 1px solid #E6E7E7;
        background-color: white;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
        display: inline-block;
        width: 400px;
        position: relative;
        div.rg-selected-content{
            /*margin-right: 30px;*/
            display: inline-block;
            width: 350px;
        }
        div.rg-done {
            height: 100%;
            width: 50px;
            display: inline-block;
            text-align: center;
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            i{
                line-height: 1;
                font-size: 20px;
                top: 50%;
                position: absolute;
                margin-top: -10px;
            }
        }
    }
    div.rg-column-container{
        clear: both;
        ul{
            border-right: 1px solid #DDDDDD;
            &:last-child { border-right: 0; }
        }
    }


    /* icons */
    @font-face {font-family: "rg-iconfont";
        src: url('data:image/eot;base64,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'); /* IE9*/
        src: url('data:image/eot;base64,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') format('embedded-opentype'), /* IE6-IE8 */
        url('data:application/x-font-woff;charset=utf-8;base64,d09GRgABAAAAAAXYAAsAAAAACMgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADMAAABCsP6z7U9TLzIAAAE8AAAARAAAAFY8dkk9Y21hcAAAAYAAAABxAAAByIIAhoJnbHlmAAAB9AAAAcUAAAJA3vCOfmhlYWQAAAO8AAAALwAAADYTSzUfaGhlYQAAA+wAAAAeAAAAJAfeA4hobXR4AAAEDAAAABEAAAAYGAEAAGxvY2EAAAQgAAAADgAAAA4CIgGqbWF4cAAABDAAAAAfAAAAIAEVAGJuYW1lAAAEUAAAAUUAAAJtPlT+fXBvc3QAAAWYAAAAQAAAAFFqHZuQeJxjYGRgYOBikGPQYWB0cfMJYeBgYGGAAJAMY05meiJQDMoDyrGAaQ4gZoOIAgCKIwNPAHicY2BkYWCcwMDKwMHUyXSGgYGhH0IzvmYwYuRgYGBiYGVmwAoC0lxTGByeMTz3Zm7438AQw9zA0AAUZgTJAQDiygwveJztkcsJgDAQRN+aKCIexDrEQtR6PFlvUobuZlWwBye8kBnygQxQA0GZlAhyIJh2TaXkga7kkUV9T0tFTKQhjXnO63nC170S3f0MeynoHaKnkYZffZm329X2i05ZD451k0bH+smzY93k1aG6AO4QG3YAAAB4nFVRTW/TQBDdt5Pasok3zsZ1iBPUOG4cItEgTLIVqIVUICFuuYQjcGvPlfiQuBRxQvTED0A5I/EbQtSe+QvlhMQJCXHNhrUjBOxhdt68N0+zswzMHHrDn7A6Y0gtG720YwX1jXALYXYXahdqSC/dyNHT725UcwEqkVW2SlTCwuGPHLj69jcnaLhLAnHinHDhNnLbDcZWc1rQASuzBrvObrEpY91OOqoOVRZuVgMr+RcgGQ3QiwXszcSMEN6MMzVMu0NlkvAKYsSG/qMu2FH1DnIkwJ8KKVtSfllf+DmDuqrnfYWZqQgam7h8LwUOPKlPMNNjQ9Wasubhs5CQTQl1YujcRuii52/O27kaqj/OvVsyNxPjZdtU8LUQtYuGiyKP+8q8fb3XOX/NpAFmrbaV9jCAyuqOCSHN4evnJK9V9KsK2js+HuPI39niDy/7+gVVUcFbfxD7+gMOK3Hht1rwH3SPBWaxYZZ/Sw9pR6COMLBhBeiIbYHjKNLvRNKEwNTz9CfvhufhuPWghWde1PX0R5EIU91m6xlXv+iUyuyS+RfbQc/BrmMM6XSiz/X5BPv6bII97E302f3/EPaNwlj8BidSao4AAAB4nGNgZGBgAGLmCwHv4/ltvjJwszCAwA3RHxMQ9P/9LAzMzkAuBwMTSBQANXsKvwB4nGNgZGBgbvjfwBDDAmQxMLAwMIBpJMAGAEclAnAAAHicY2FgYGBBx4wMDAABawAaAAAAAAAAAAAuAKwA1AD+ASAAAHicY2BkYGBgYwhjYGUAASYg5gJCBob/YD4DABHFAXgAeJxlj01OwzAQhV/6B6QSqqhgh+QFYgEo/RGrblhUavdddN+mTpsqiSPHrdQDcB6OwAk4AtyAO/BIJ5s2lsffvHljTwDc4Acejt8t95E9XDI7cg0XuBeuU38QbpBfhJto41W4Rf1N2MczpsJtdGF5g9e4YvaEd2EPHXwI13CNT+E69S/hBvlbuIk7/Aq30PHqwj7mXle4jUcv9sdWL5xeqeVBxaHJIpM5v4KZXu+Sha3S6pxrW8QmU4OgX0lTnWlb3VPs10PnIhVZk6oJqzpJjMqt2erQBRvn8lGvF4kehCblWGP+tsYCjnEFhSUOjDFCGGSIyujoO1Vm9K+xQ8Jee1Y9zed0WxTU/3OFAQL0z1xTurLSeTpPgT1fG1J1dCtuy56UNJFezUkSskJe1rZUQuoBNmVXjhF6XNGJPyhnSP8ACVpuyAAAAHicY2BigAAuBuyAjZGJkZmRhZGVkY2RnYGtojQxryqVvTgjMS85o5QlJb88jzUoMz2jhLUkMze1mIEBANuHC6w=') format('woff'),
        url('data:image/ttf;base64,AAEAAAALAIAAAwAwR1NVQrD+s+0AAAE4AAAAQk9TLzI8dkk9AAABfAAAAFZjbWFwggCGggAAAewAAAHIZ2x5Zt7wjn4AAAPEAAACQGhlYWQTSzUfAAAA4AAAADZoaGVhB94DiAAAALwAAAAkaG10eBgBAAAAAAHUAAAAGGxvY2ECIgGqAAADtAAAAA5tYXhwARUAYgAAARgAAAAgbmFtZT5U/n0AAAYEAAACbXBvc3RqHZuQAAAIdAAAAFEAAQAAA4D/gABcBAEAAAAABAAAAQAAAAAAAAAAAAAAAAAAAAYAAQAAAAEAAAPQUO9fDzz1AAsEAAAAAADYFfiQAAAAANgV+JAAAP+/BAADQwAAAAgAAgAAAAAAAAABAAAABgBWAAUAAAAAAAIAAAAKAAoAAAD/AAAAAAAAAAEAAAAKAB4ALAABREZMVAAIAAQAAAAAAAAAAQAAAAFsaWdhAAgAAAABAAAAAQAEAAQAAAABAAgAAQAGAAAAAQAAAAAAAQQAAZAABQAIAokCzAAAAI8CiQLMAAAB6wAyAQgAAAIABQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUGZFZABA5gDnSwOA/4AAXAOAAIAAAAABAAAAAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAQAAAAAABQAAAAMAAAAsAAAABAAAAXwAAQAAAAAAdgADAAEAAAAsAAMACgAAAXwABABKAAAADAAIAAIABOYA5hDmEucu50v//wAA5gDmEOYS5y7nS///AAAAAAAAAAAAAAABAAwADAAMAAwADAAAAAUAAwAEAAEAAgAAAQYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAATAAAAAAAAAAFAADmAAAA5gAAAAAFAADmEAAA5hAAAAADAADmEgAA5hIAAAAEAADnLgAA5y4AAAABAADnSwAA50sAAAACAAAAAAAuAKwA1AD+ASAAAAABAAAAAAODAl8AFwAAASYGBwEnJiIGFBcFFh8BFjI/ATY3ATY0A3gKGgn+VekKGhMKAQEDBAMGDAYEAwQBwQkCVgkBCv465gkUGQr9AwEDAgMCAgMB3woZAAAAAAUAAP+/A8EDQQAMABkALwA5AFUAACUiJjURNDYyFhURFAYjIiY1ETQ2MhYVERQGASM1LgEnIQ4BBxUjIgYUFjMhMjY0JiU0NjMhMhYdASEBIS4BJxE0NjIWFREUFjMhMjY1ET4BMhYVEQ4BAmAOEhIcEhLODhISHBISAfKgATYo/r8pNgGgDhISDgNADhIS/ZISDgFBDRL+gAGg/kApNgETGxITDQHADhIBEhsSATaAEg4BYA4SEg7+oA4SEg4BYA4SEg7+oA4SAiBAKTYBATYpQBIcEhIcEkAOEhIOQP0gATYpAeAOEhIO/iAOEhIOAd8OEhIO/iEpNgAAAAEAAAAAA78CgQASAAABBgcBBwYmJwEuATYyFwkBNjIWA78BEP52AxIsD/57DwEgLRABXgFoEC0fAkkYEP53AxEBDwGJEC4hEP6eAWcPIQAAAQAA/8EC7wNDABQAAAUWMjcBNjQnASYiDgEXARYUBwEGFAEiDiQOAXIaGv6LDiMbAQ4BVQ0N/q0NMQ0NAXIcRxwBdQ0aJQ3+qg4jDv6tDSQAAAAAAQAA//QDjAMMAAsAACUHCQEnCQE3CQEXAQOMUP7E/sRQAT3+w1ABPAE8UP7DRFABPf7DUAE8ATxQ/sMBPVD+xAAAAAAAABIA3gABAAAAAAAAABUAAAABAAAAAAABAAgAFQABAAAAAAACAAcAHQABAAAAAAADAAgAJAABAAAAAAAEAAgALAABAAAAAAAFAAsANAABAAAAAAAGAAgAPwABAAAAAAAKACsARwABAAAAAAALABMAcgADAAEECQAAACoAhQADAAEECQABABAArwADAAEECQACAA4AvwADAAEECQADABAAzQADAAEECQAEABAA3QADAAEECQAFABYA7QADAAEECQAGABABAwADAAEECQAKAFYBEwADAAEECQALACYBaQpDcmVhdGVkIGJ5IGljb25mb250Cmljb25mb250UmVndWxhcmljb25mb250aWNvbmZvbnRWZXJzaW9uIDEuMGljb25mb250R2VuZXJhdGVkIGJ5IHN2ZzJ0dGYgZnJvbSBGb250ZWxsbyBwcm9qZWN0Lmh0dHA6Ly9mb250ZWxsby5jb20ACgBDAHIAZQBhAHQAZQBkACAAYgB5ACAAaQBjAG8AbgBmAG8AbgB0AAoAaQBjAG8AbgBmAG8AbgB0AFIAZQBnAHUAbABhAHIAaQBjAG8AbgBmAG8AbgB0AGkAYwBvAG4AZgBvAG4AdABWAGUAcgBzAGkAbwBuACAAMQAuADAAaQBjAG8AbgBmAG8AbgB0AEcAZQBuAGUAcgBhAHQAZQBkACAAYgB5ACAAcwB2AGcAMgB0AHQAZgAgAGYAcgBvAG0AIABGAG8AbgB0AGUAbABsAG8AIABwAHIAbwBqAGUAYwB0AC4AaAB0AHQAcAA6AC8ALwBmAG8AbgB0AGUAbABsAG8ALgBjAG8AbQAAAAACAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYBAgEDAQQBBQEGAQcABnh1YW56ZQdzaGFuY2h1BGRvd24FUmlnaHQFdGltZXMAAAAAAA==') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
        url('data:image/svg;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiID4KPCEtLQoyMDEzLTktMzA6IENyZWF0ZWQuCi0tPgo8c3ZnPgo8bWV0YWRhdGE+CkNyZWF0ZWQgYnkgaWNvbmZvbnQKPC9tZXRhZGF0YT4KPGRlZnM+Cgo8Zm9udCBpZD0iaWNvbmZvbnQiIGhvcml6LWFkdi14PSIxMDI0IiA+CiAgPGZvbnQtZmFjZQogICAgZm9udC1mYW1pbHk9Imljb25mb250IgogICAgZm9udC13ZWlnaHQ9IjUwMCIKICAgIGZvbnQtc3RyZXRjaD0ibm9ybWFsIgogICAgdW5pdHMtcGVyLWVtPSIxMDI0IgogICAgYXNjZW50PSI4OTYiCiAgICBkZXNjZW50PSItMTI4IgogIC8+CiAgICA8bWlzc2luZy1nbHlwaCAvPgogICAgCiAgICA8Z2x5cGggZ2x5cGgtbmFtZT0ieHVhbnplIiB1bmljb2RlPSImIzU5MTgyOyIgZD0iTTg4Ny45MDQ3NDQgNTk3Ljc5MTQ4Yy0xMi44NjM2NDcgMTIuMDYzNzU1LTMzLjE1MTY3MyAxMS40ODc0ODgtNDUuMjE1NDI4LTEuNDA4ODQzTDQxNS45MzU0OTMgMTQyLjAxNjE4MSAxODIuODE1ODU4IDM3MS43MTI2MTljLTEyLjYwNzMzOCAxMi40MTYzOTYtMzIuODY0NCAxMi4yODczODEtNDUuMjgwNzk2LTAuMzE5OTU3LTEyLjQxNjM5Ni0xMi41NzYzNzQtMTIuMjU2NDE3LTMyLjg2NDQgMC4zNTI2NDEtNDUuMjQ4MTEybDI1Ni40Nzk5MzUtMjUyLjY3MTQxNWMwLjA5NjMzMS0wLjA5NjMzMSAwLjIyMzYyNi0wLjEyNzI5NSAwLjMxOTk1Ny0wLjIyMzYyNnMwLjEyNzI5NS0wLjIyMzYyNiAwLjIyMzYyNi0wLjMxOTk1N2MyLjAxNjA3My0xLjkxOTc0MiA0LjQ0ODQzNC0zLjAwODYyOCA2Ljc4NDQ2NC00LjI4ODQ1NiAxLjE1MjUzMy0wLjY3MjU5OCAyLjE0MzM2OC0xLjY2MzQzMiAzLjM1OTU0OC0yLjE0MzM2OCAzLjc3NTgzNy0xLjQ3MjQ5IDcuNzc1Mjk5LTIuMjM5Njk5IDExLjc0Mzc5OC0yLjIzOTY5OSA0LjE5MjEyNSAwIDguMzg0MjQ5IDAuODMyNTc2IDEyLjI4NzM4MSAyLjQ5NjAwOSAxLjMxMjUxMiAwLjU0MzU4MyAyLjMzNjAzIDEuNjYzNDMyIDMuNTUyMjExIDIuMzY4NzE0IDIuMzk5Njc3IDEuNDA4ODQzIDQuODk1Njg2IDIuNTkyMzQgNi45NDQ0NDMgNC42NzIwNiAwLjA5NjMzMSAwLjA5NjMzMSAwLjEyNzI5NSAwLjI1NjMxIDAuMjIzNjI2IDAuMzUyNjQxIDAuMDYzNjQ3IDAuMDk2MzMxIDAuMTkyNjYyIDAuMTI3Mjk1IDAuMjg3MjczIDAuMjIzNjI2TDg4OS4yNzc0NjMgNTUyLjU3OTQ5MkM5MDEuNDM5MjY5IDU2NS40MDg3MzUgOTAwLjc2ODM5MSA1ODUuNjY0MDc3IDg4Ny45MDQ3NDQgNTk3Ljc5MTQ4eiIgIGhvcml6LWFkdi14PSIxMDI0IiAvPgoKICAgIAogICAgPGdseXBoIGdseXBoLW5hbWU9InNoYW5jaHUiIHVuaWNvZGU9IiYjNTkyMTE7IiBkPSJNNjA3Ljg5Nzg2NyAxMjcuOTU2OTk2Yy0xNy43MTc0NTMgMC0zMS45OTQ2MjUgMTQuMjc3MTcxLTMxLjk5NDYyNSAzMS45OTQ2MjVMNTc1LjkwMzI0MiA1MTIuMDY0NTA1YzAgMTcuNzE3NDUzIDE0LjI3NzE3MSAzMS45OTQ2MjUgMzEuOTk0NjI1IDMxLjk5NDYyNXMzMS45OTQ2MjUtMTQuMjc3MTcxIDMxLjk5NDYyNS0zMS45OTQ2MjVsMC0zNTEuOTQwODdDNjM5Ljg5MjQ5MSAxNDIuNDA2MTgyIDYyNS42MTUzMiAxMjcuOTU2OTk2IDYwNy44OTc4NjcgMTI3Ljk1Njk5NnpNNDE1LjkzMDExOSAxMjcuOTU2OTk2Yy0xNy43MTc0NTMgMC0zMS45OTQ2MjUgMTQuMjc3MTcxLTMxLjk5NDYyNSAzMS45OTQ2MjVMMzgzLjkzNTQ5NSA1MTIuMDY0NTA1YzAgMTcuNzE3NDUzIDE0LjI3NzE3MSAzMS45OTQ2MjUgMzEuOTk0NjI1IDMxLjk5NDYyNSAxNy43MTc0NTMgMCAzMS45OTQ2MjUtMTQuMjc3MTcxIDMxLjk5NDYyNS0zMS45OTQ2MjVsMC0zNTEuOTQwODdDNDQ3LjkyNDc0NCAxNDIuNDA2MTgyIDQzMy42NDc1NzMgMTI3Ljk1Njk5NiA0MTUuOTMwMTE5IDEyNy45NTY5OTZ6TTkyOC4wMTYxMjYgNjcyLjAzNzYyOGwtMTU5Ljk3MzEyMyAwTDc2OC4wNDMwMDQgNzM2LjAyNjg3N2MwIDUyLjk4MDM0Ni00Mi42NTk0OTkgOTUuOTgzODc0LTk1LjI5NTgxNyA5NS45ODM4NzRMMzUxLjk0MDg3IDgzMi4wMTA3NTFjLTUyLjk4MDM0NiAwLTk1Ljk4Mzg3NC00My4wMDM1MjgtOTUuOTgzODc0LTk1Ljk4Mzg3NGwwLTYzLjk4OTI0OS0xNTkuOTczMTIzIDBjLTE3LjcxNzQ1MyAwLTMxLjk5NDYyNS0xNC4yNzcxNzEtMzEuOTk0NjI1LTMxLjk5NDYyNXMxNC4yNzcxNzEtMzEuOTk0NjI1IDMxLjk5NDYyNS0zMS45OTQ2MjVsODMyLjAzMjI1MyAwYzE3LjcxNzQ1MyAwIDMxLjk5NDYyNSAxNC4yNzcxNzEgMzEuOTk0NjI1IDMxLjk5NDYyNVM5NDUuNzMzNTggNjcyLjAzNzYyOCA5MjguMDE2MTI2IDY3Mi4wMzc2Mjh6TTMxOS45NDYyNDYgNzM2LjAyNjg3N2MwIDE3LjU0NTQzOSAxNC40NDkxODUgMzEuOTk0NjI1IDMxLjk5NDYyNSAzMS45OTQ2MjVsMzIwLjgwNjMxNiAwYzE3LjU0NTQzOSAwIDMxLjMwNjU2OC0xNC4xMDUxNTcgMzEuMzA2NTY4LTMxLjk5NDYyNWwwLTYzLjk4OTI0OUwzMTkuOTQ2MjQ2IDY3Mi4wMzc2MjggMzE5Ljk0NjI0NiA3MzYuMDI2ODc3IDMxOS45NDYyNDYgNzM2LjAyNjg3N3pNNzM2LjA0ODM3OS02NC4wMTA3NTEgMjg4LjEyMzYzNS02NC4wMTA3NTFjLTUyLjk4MDM0NiAwLTk1Ljk4Mzg3NCA0My4wMDM1MjgtOTUuOTgzODc0IDk1Ljk4Mzg3NEwxOTIuMTM5NzYxIDUxMi40MDg1MzRjMCAxNy43MTc0NTMgMTQuMjc3MTcxIDMxLjk5NDYyNSAzMS45OTQ2MjUgMzEuOTk0NjI1czMxLjk5NDYyNS0xNC4yNzcxNzEgMzEuOTk0NjI1LTMxLjk5NDYyNWwwLTQ4MC40MzU0MTFjMC0xNy43MTc0NTMgMTQuNDQ5MTg1LTMxLjk5NDYyNSAzMS45OTQ2MjUtMzEuOTk0NjI1bDQ0OC4wOTY3NTggMGMxNy43MTc0NTMgMCAzMS45OTQ2MjUgMTQuMjc3MTcxIDMxLjk5NDYyNSAzMS45OTQ2MjVMNzY4LjIxNTAxOCA1MTEuMjA0NDM1YzAgMTcuNzE3NDUzIDE0LjI3NzE3MSAzMS45OTQ2MjUgMzEuOTk0NjI1IDMxLjk5NDYyNXMzMS45OTQ2MjUtMTQuMjc3MTcxIDMxLjk5NDYyNS0zMS45OTQ2MjVsMC00NzkuMjMxMzEyQzgzMi4wMzIyNTMtMjAuODM1MjA5IDc4OS4wMjg3MjUtNjQuMDEwNzUxIDczNi4wNDgzNzktNjQuMDEwNzUxeiIgIGhvcml6LWFkdi14PSIxMDI0IiAvPgoKICAgIAogICAgPGdseXBoIGdseXBoLW5hbWU9ImRvd24iIHVuaWNvZGU9IiYjNTg4OTY7IiBkPSJNOTU4LjU3NzQ3NiA1ODQuODE5NzQ4YzAtMTUuMjg2MTQ4LTUuODc4ODk0LTI5LjUyMjM4NC0xNi41NjQyNTctNDAuMTY2ODE1TDU1MS42MjM5NTEgMTU0Ljk1NjQ0NGMtMS4zOTI3Mi0xLjQyNTQ2Ni0yLjU3NzcwOC0yLjUzNzc5OS0zLjg0NjYwOC0zLjQ0OTU2NWwtMi45MDUxNjYtMi4zMDQ0ODZjLTExLjQxNjAwNC0xMS4zNjI3OTItMjQuODQ4OTQ0LTE2Ljk0NTk1MS0zOS4wNjg4MDctMTYuOTQ1OTUxLTE0LjQ3NTY4OSAwLTI4LjAxMDk2MSA1LjcwODAwMi0zOC4xMTA5OTMgMTYuMDU2Njk4TDc5LjQ3NTU4OCA1NDAuNjg5NjY4Yy0xMC40NjczOTkgMTAuNjEzNzMyLTE2LjIzNjc5OSAyNC43ODY1MjMtMTYuMjM2Nzk5IDM5Ljg5MzU5MiAwIDE0Ljc3MjQ0OCA1LjU5OTUzMiAyOC43MjYyNTIgMTUuNzUzNzk5IDM5LjI4Njc3MiAxMC4xODU5OSAxMC40OTcwNzUgMjQuMzkwNTAzIDE2LjUzOTY5OCAzOC45NTIxNSAxNi41Mzk2OTggMTQuMzgyNTY5IDAgMjguMDA5OTM3LTUuNzIzMzUyIDM4LjM2NjgxOS0xNi4xNDI2NTVsMzUwLjE2OTI0MS0zNTMuOTY4Nzc3IDM1OS40MjgxMTYgMzU4LjQ4NTY1MWMxMC4zMDk4MSAxMC4yNDg0MTIgMjMuNzgxNjM2IDE1LjkwOTM0MSAzNy45OTQzMzYgMTUuOTA5MzQxIDE0Ljg4OTEwNSAwIDI4Ljg1OTI4MS02LjA1MDgxIDM5LjMzMzg0NC0xNi45OTkxNjNDOTUzLjEyNjMyNCA2MTMuMjc0ODI0IDk1OC41Nzc0NzYgNTk5LjQ0MzgxNyA5NTguNTc3NDc2IDU4NC44MTk3NDh6IiAgaG9yaXotYWR2LXg9IjEwMjQiIC8+CgogICAgCiAgICA8Z2x5cGggZ2x5cGgtbmFtZT0iUmlnaHQiIHVuaWNvZGU9IiYjNTg4OTg7IiBkPSJNMjkwLjMtNDljMTcuNS0xNy41IDQ1LjgtMTcuNSA2My4zIDBsMzcwLjIgMzcwLjJjMzUgMzUgMzUgOTEuNyAwIDEyNi42bC0zNzIuOSAzNzNjLTE3LjMgMTcuMy00NS4zIDE3LjUtNjIuOCAwLjUtMTcuOS0xNy40LTE4LjEtNDYuMS0wLjUtNjMuOGwzNDEuMy0zNDEuM2MxNy41LTE3LjUgMTcuNS00NS44IDAtNjMuM0wyOTAuMyAxNC4zYy0xNy41LTE3LjUtMTcuNS00NS44IDAtNjMuM3oiICBob3Jpei1hZHYteD0iMTAyNCIgLz4KCiAgICAKICAgIDxnbHlwaCBnbHlwaC1uYW1lPSJ0aW1lcyIgdW5pY29kZT0iJiM1ODg4MDsiIGQ9Ik05MDcuNTEgNjcuNTk1MDAwMDAwMDAwMDNsLTc5LjEwMS03OS4xMDItMzE2LjQwNiAzMTYuNDA1LTMxNi40MDUtMzE2LjQwNS03OS4xMDQgNzkuMTAyTDQzMi44OTkgMzg0IDExNi40OTQgNzAwLjQwNWw3OS4xMDQgNzkuMDk5IDMxNi40MDUtMzE2LjQwNUw4MjguNDEgNzc5LjUwNGw3OS4wOTgtNzkuMDk5TDU5MS4xMDIgMzg0bDMxNi40MDUtMzE2LjQwNXoiICBob3Jpei1hZHYteD0iMTAyNSIgLz4KCiAgICAKCgogIDwvZm9udD4KPC9kZWZzPjwvc3ZnPgo=') format('svg'); /* iOS 4.1- */
    }

    .rg-iconfont {
        font-family:"rg-iconfont" !important;
        font-size:14px;
        font-style:normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-done:before { content: "\e72e"; }
    .icon-remove:before { content: "\e74b"; }
    .icon-down:before { content: "\e610"; }
    .icon-right:before { content: "\e612"; }
    .icon-clear:before { content: "\e600"; }
</style>