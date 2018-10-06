import region from './Region.vue';

const Plugin = {
    install(Vue, options = {}){
        if(Object.keys(options).length){
            if(typeof options.i18n === 'string') region.props.i18n.default = options.i18n;
            if(typeof options.blank === 'boolean') region.props.blank.default = options.blank;
            if(typeof options.town === 'boolean') region.props.town.default = options.town;
            if(typeof options.search === 'boolean') region.props.search.default = options.search;
        }

        Vue.component(region.name, region);
    }
};

export default Plugin;