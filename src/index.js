import region from './Region.vue';

const Plugin = {
    install(Vue){
        Vue.component(region.name, region);
    }
};

export default Plugin;