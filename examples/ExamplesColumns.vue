<template>
  <section>
    <h3 class="">
      Column
      <small>下拉选择器多列竖排模式</small>
    </h3>
    <div class="p-3 shadow-sm rounded-3 border">
      <div class="mb-3 d-flex">
        <div class="me-3">
          <RegionDropdown>
            <RegionColumns
              language="en"
              :city="true"
              :area="true"
              :town="true"
              v-model="modelColumn"
              v-model:names="names"
              @change="cbColumn"
              @complete="columnGroupCoreDone"
            />
          </RegionDropdown>
        </div>
        <div>
          <RegionDropdown>
            <RegionFullColumns />
          </RegionDropdown>
        </div>
      </div>
      <div class="mb-3">
        <button
          type="button"
          class="btn btn-secondary"
          @click="setSelectorRegion"
        >
          Set region
        </button>
      </div>
      <div class="bg-light p-3 mb-3 rounded-3">
        <pre
          class="m-0"
          v-text="JSON.stringify(modelColumn, null, 2)"
        />
        <div class="my-3">
          {{ names }}
        </div>
        <pre
          class="m-0"
          v-text="JSON.stringify(valuesColumn, null, 2)"
        />
      </div>

      <h4>核心模块</h4>
      <div class="my-3">
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="inlineCheckboxCity"
            v-model="enabledCity"
            :true-value="true"
            :false-value="false"
          >
          <label
            class="form-check-label"
            for="inlineCheckboxCity"
          >City</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="inlineCheckboxArea"
            v-model="enabledArea"
            :true-value="true"
            :false-value="false"
          >
          <label
            class="form-check-label"
            for="inlineCheckboxArea"
          >Area</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="inlineCheckboxTown"
            v-model="enabledTown"
            :true-value="true"
            :false-value="false"
          >
          <label
            class="form-check-label"
            for="inlineCheckboxTown"
          >Town</label>
        </div>
      </div>

      <div class="d-flex mb-3">
        <RegionFullColumns
          :city="enabledCity"
          :area="enabledArea"
          :town="enabledTown"
          ref="columnCore"
          class="border rounded-3"
          language="en"
          v-model="modelCore"
          @complete="columnGroupCoreDone"
        />
      </div>

      <div>
        <button
          type="button"
          class="btn btn-secondary me-3"
          @click="setRegion"
        >
          Set full Region
        </button>
        <button
          type="button"
          class="btn btn-secondary me-3"
          @click="set3LevelRegion"
        >
          Set 3 level Region
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="reset"
        >
          Reset
        </button>
      </div>

      <h4 class="mt-3">
        下拉选择器多列竖排模式（自定义呼出按钮）
      </h4>
      <div>
        <RegionDropdown>
          <template #trigger="{ visible }">
            <button
              type="button"
              class="btn btn-primary"
            >
              data:{{ resultText(modelCustomTrigger) }},
              visible: {{ visible }}
            </button>
          </template>
          <RegionColumns @change="customTriggerChange" />
        </RegionDropdown>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import {
  RegionColumns,
  RegionFullColumns,
  RegionDropdown
} from '../src'
import { listToText, modelToValues } from '../src/core/parse'

const model = {
  province: '410000',
  city: '419001',
  area: '419001',
  town: '419001001'
}
const names = ref([])

const modelCore = ref(null)
const modelColumn = ref({
  province: '350000',
  city: '350100',
  area: '350104',
  town: '350104008'
})
const valuesColumn = ref(null)
const enabledCity = ref(true)
const enabledArea = ref(true)
const enabledTown = ref(true)
const columnCore = ref()
const modelCustomTrigger = ref()

function cbColumn (data) {
  // if (!this.valuesColumn) {
  valuesColumn.value = data
  // console.log('set data')
  // }
  // console.dir(data)
}
function columnGroupCoreDone () {
  console.log('columnGroupCoreDone')
}
function resultText (region) {
  if (!region) return '无数据'

  if (!Object.values(region).some(val => val) || !region) {
    return '无数据'
  }
  return listToText(modelToValues(region), ',')
}
function reset () {
  // columnCore.value.reset()
  modelCore.value = {
    province: undefined,
    city: undefined,
    area: undefined,
    town: undefined
  }
}
function setRegion () {
  modelCore.value = model
}
function set3LevelRegion () {
  modelCore.value = {
    province: '450000',
    city: '451200',
    area: '451228',
    town: undefined
  }
}
function setSelectorRegion () {
  modelColumn.value = model
}
function customTriggerChange (data) {
  modelCustomTrigger.value = data
}
</script>
