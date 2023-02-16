<template>
  <section>
    <h3 class="">
      Select
      <small>下拉列表模式</small>
    </h3>
    <div class="p-3 shadow-sm rounded-3 border">
      <h5>
        省
      </h5>
      <div>
        <region-selects
          :city="false"
          :area="false"
          :disabled="disabled"
        />

        <button
          type="button"
          class="btn btn-light mt-3"
          @click="toggleDisabled"
        >
          Disabled
        </button>
      </div>

      <h5 class="mt-3">
        省、市
      </h5>
      <div class="bg-light p-3 mb-3 rounded-3">
        <pre
          class="m-0"
          v-text="JSON.stringify(value1, null, 2)"
        />
      </div>
      <region-selects
        :area="false"
        v-model="value1"
      />

      <h5 class="mt-3">
        省、市、区/县
      </h5>
      <region-selects />

      <h5 class="mt-3">
        省、市、区/县、乡/镇/街道
      </h5>
      <div class="bg-light p-3 mb-3 rounded-3">
        <pre
          class="m-0"
          v-text="JSON.stringify(modelSelect, null, 2)"
        />
      </div>
      <div class="bg-light p-3 mb-3 rounded-3">
        <pre
          class="m-0"
          v-text="JSON.stringify(valuesSelect, null, 2)"
        />
      </div>
      <region-selects
        ref="regionSelected"
        language="en"
        :town="true"
        v-model="modelSelect"
        @change="change"
      />
      <div>
        <button
          type="button"
          class="btn btn-light mt-3"
          @click="reset"
        >
          Reset
        </button>
      </div>

      <h5 class="mt-3">
        初始化值
      </h5>
      <region-selects
        :city="true"
        :area="true"
        :town="true"
        v-model="selected"
      />

      <h5 class="mt-3">
        初始化值并禁用
      </h5>
      <!-- <region-selects
        :town="true"
        :disabled="true"
        v-model="selected"
      /> -->
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { RegionSelects } from '@/'

const value1 = ref({})
const selected = ref({
  province: '350000',
  city: '350100',
  area: '350103',
  town: '350103012'
})
const modelSelect = ref(undefined)
const valuesSelect = ref(undefined)
const disabled = ref(false)
const regionSelected = ref(null)

function change (data) {
  valuesSelect.value = data

  console.log(modelSelect.value)
  console.log(data)
}
function toggleDisabled () {
  disabled.value = !disabled.value
}
function reset () {
  regionSelected.value.reset()
}
</script>
