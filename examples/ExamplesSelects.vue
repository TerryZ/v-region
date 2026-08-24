<template>
  <section>
    <h3 class="">
      Select
      <small>下拉列表模式</small>
    </h3>
    <hr />
    <div class="">
      <h5>省</h5>
      <div>
        <region-selects :city="false" :area="false" />
      </div>

      <h5 class="mt-3">省、市</h5>
      <div class="bg-light p-3 mb-3 rounded-3">
        <pre class="m-0" v-text="JSON.stringify(value1, null, 2)" />
      </div>
      <region-selects :area="false" v-model="value1" />

      <h5 class="mt-3">省、市、区/县</h5>
      <region-selects
        custom-trigger-class="bg-secondary-subtle"
        custom-container-class="border-0 bg-success-subtle"
      />

      <h5 class="mt-3">省、市、区/县、乡/镇/街道</h5>
      <div class="my-3">
        <div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="checkbox"
              id="inlineCheckboxCity"
              v-model="autoSelectFirst"
              :true-value="true"
              :false-value="false"
            />
            <label class="form-check-label" for="inlineCheckboxCity">自动选择第一项</label>
          </div>
        </div>
        <div class="d-flex gap-3 align-items-center">
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="checkbox"
              id="inlineCheckboxCity"
              v-model="enabledCity"
              :true-value="true"
              :false-value="false"
            />
            <label class="form-check-label" for="inlineCheckboxCity">City</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="checkbox"
              id="inlineCheckboxArea"
              v-model="enabledArea"
              :true-value="true"
              :false-value="false"
            />
            <label class="form-check-label" for="inlineCheckboxArea">Area</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="checkbox"
              id="inlineCheckboxTown"
              v-model="enabledTown"
              :true-value="true"
              :false-value="false"
            />
            <label class="form-check-label" for="inlineCheckboxTown">Town</label>
          </div>
          <button type="button" class="btn btn-dark" @click="reset">Reset</button>
          <button type="button" class="btn btn-dark" @click="reset1">Reset 3 level</button>
          <button type="button" class="btn btn-dark" @click="setToSpecial1">
            Special 1(Only Province)
          </button>
          <button type="button" class="btn btn-dark" @click="setToSpecial2">
            Special 2(Only Province and City)
          </button>
          <button type="button" class="btn btn-dark" @click="clear">Clear</button>
          <button type="button" class="btn btn-light" @click="toggleDisabled">Disabled</button>
        </div>
      </div>

      <div class="my-3 d-flex align-items-center">
        <region-full-selects
          ref="regionSelected"
          language="en"
          :disabled="disabled"
          :city="enabledCity"
          :area="enabledArea"
          :town="enabledTown"
          :auto-select-first="autoSelectFirst"
          v-model="modelSelect"
          v-model:names="names"
          @change="change"
        />
      </div>
      <div class="row">
        <div class="col-md-6">
          <h6>model</h6>
          <div class="bg-light p-3 mb-3 rounded-3">
            <pre class="m-0" v-text="JSON.stringify(modelSelect, null, 2)" />
          </div>
          <h6>names</h6>
          <div>{{ names }}</div>
        </div>
        <div class="col-md-6">
          <h6>内部完整数据</h6>
          <div class="bg-light p-3 mb-3 rounded-3">
            <pre class="m-0" v-text="JSON.stringify(valuesSelect, null, 2)" />
          </div>
        </div>
      </div>

      <h5 class="mt-3">初始化值</h5>
      <region-selects
        :city="true"
        :area="true"
        :town="true"
        v-model="selected"
        @change="changeSelected"
      />
      <div class="mt-3">
        <button type="button" class="btn btn-light" @click="setSelected">Change region</button>
      </div>

      <h5 class="mt-3">初始化值并禁用</h5>

      <region-full-selects
        :town="true"
        :disabled="true"
        v-model="fullSelected"
        @change="fullChangeSelected"
      />

      <div class="mt-3">
        <button type="button" class="btn btn-light" @click="setFullSelected">
          Change full region
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RegionSelects, RegionFullSelects } from '@/'
import { specialRegion1, specialRegion2 } from '../src/__tests__/data'

const value1 = ref({})
const names = ref([])
const autoSelectFirst = ref(false)
const selected = ref({
  province: '350000',
  city: '350100',
  area: '350103',
  town: '350103012'
})
const fullSelected = ref({
  province: '350000',
  city: '350100',
  area: '350103',
  town: '350103012'
})
const modelSelect = ref()
const valuesSelect = ref()
const disabled = ref(false)
const regionSelected = ref()
const enabledCity = ref(true)
const enabledArea = ref(true)
const enabledTown = ref(true)

function changeSelected(data) {
  console.log(selected.value)
  console.log(data)
}
function fullChangeSelected(data) {
  console.log(fullSelected.value)
  console.log(data)
}
function setSelected() {
  selected.value = {
    province: '350000',
    city: '350500',
    area: '350582',
    town: undefined
  }
}
function setFullSelected() {
  fullSelected.value = {
    province: '350000',
    city: '350500',
    area: '350582',
    town: '350582105'
  }
}
function toggleDisabled() {
  disabled.value = !disabled.value
}
function change(data) {
  valuesSelect.value = data

  console.log(modelSelect.value)
  console.log(data)
}
function reset() {
  // regionSelected.value.reset()
  modelSelect.value = {
    province: '350000',
    city: '350100',
    area: '350103',
    town: '350103012'
  }
}
function reset1() {
  // regionSelected.value.reset()
  modelSelect.value = {
    province: '130000',
    city: '130300',
    area: '130304',
    town: undefined
  }
}
function clear() {
  modelSelect.value = {
    province: undefined,
    city: undefined,
    area: undefined,
    town: undefined
  }
}
function setToSpecial1() {
  modelSelect.value = specialRegion1()
}
function setToSpecial2() {
  modelSelect.value = specialRegion2()
}
</script>
