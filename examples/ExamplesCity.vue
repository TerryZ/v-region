<template>
  <section>
    <h3 class="">
      City
      <small>城市选择器</small>
    </h3>
    <h5>核心模块</h5>
    <div class="mb-3 bg-light rounded-3 p-3 d-flex gap-3">
      <div class="d-flex flex-column gap-3">
        <CityPicker
          class="border rounded-3 bg-white shadow overflow-hidden"
          style="height: fit-content;"
          v-model="coreKeys"
          v-model:selected-names="coreNames"
          @change="coreChange"
        />
        <button
          class="btn btn-dark"
          @click="setSelectedCities"
        >
          set selected cities
        </button>
      </div>

      <div class="d-flex flex-column gap-3">
        <pre
          class="m-0"
          v-text="coreKeys.join(',')"
        />
        <pre
          class="m-0"
          v-text="coreNames.join(',')"
        />
        <pre
          class="m-0"
          v-text="JSON.stringify(coreModels, null, 2)"
        />
      </div>
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

const coreKeys = ref(['110000', '350100'])
const coreNames = ref([])
const coreModels = ref([])

function coreChange (data) {
  coreModels.value = data
}
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
function setSelectedCities () {
  coreKeys.value = ['130300', '130500', '500000', '310000']
}
</script>
