<template>
  <section>
    <h3 class="mt-5">
      City
      <small>城市选择器</small>
    </h3>
    <div class="p-3 shadow-sm rounded-3 border">
      <div class="bg-light p-3 mb-3">
        <pre
          class="m-0 mb-3"
          v-text="modelCity"
        />
        <pre
          class="m-0"
          v-text="JSON.stringify(valuesCity, null, 2)"
        />
      </div>
      <div>
        <region-city-picker
          language="EN"
          v-model="modelCity"
          @change="cbCity"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { RegionCityPicker } from '@/components/v-region'

export default {
  components: {
    RegionCityPicker
  },
  data () {
    return {
      modelCity: ['110000', '350100'],
      valuesCity: null
    }
  },
  methods: {
    cbCity (data) {
      this.valuesCity = data
    }
  }
}
</script>
