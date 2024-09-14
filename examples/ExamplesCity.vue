<template>
  <section>
    <h3 class="">
      City
      <small>城市选择器</small>
    </h3>
    <h5>核心模块</h5>
    <div class="mb-3 bg-light rounded-3 p-3 d-flex">
      <CityPicker
        class="border rounded-3 bg-white shadow overflow-hidden"
        :selected="selected"
        @select="select"
      />
    </div>
    <div class="p-3 shadow-sm rounded-3 border">
      <div class="bg-light p-3 rounded-3 mb-3">
        <pre
          class="m-0 mb-3"
          v-text="modelCity"
        />
        <pre
          class="m-0"
          v-text="JSON.stringify(valuesCity, null, 2)"
        />
      </div>
      <div class="d-flex align-items-center">
        <div class="me-3">
          <region-city-picker
            language="EN"
            v-model="modelCity"
            custom-trigger-class="border border-secondary-subtle border-4 rounded-3"
            custom-container-class="border-0"
            @change="cbCity"
          />
        </div>

        <div>
          <button
            type="button"
            class="btn btn-dark"
            @click="reset"
          >
            reset to empty
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { RegionCityPicker } from '@/'
import CityPicker from '@/modules/city/CityPicker'

const selected = ref([])
const modelCity = ref(['110000', '350100'])
const valuesCity = ref(null)

function cbCity (data) {
  valuesCity.value = data
}
function select (data) {
  console.log(data)
  if (selected.value.some(val => val.key === data.key)) {
    selected.value = selected.value.filter(val => val.key !== data.key)
  } else {
    selected.value.push(data)
  }
}
function reset () {
  modelCity.value = []
}
</script>
