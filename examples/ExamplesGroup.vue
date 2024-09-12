<template>
  <section>
    <h3 class="">
      Group
      <small>下拉选择器模式</small>
    </h3>
    <div class="p-3 shadow-sm rounded-3 border">
      <h5>核心功能模块</h5>
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
        <button
          type="button"
          class="btn btn-dark me-3"
          @click="reset"
        >
          Reset
        </button>
        <button
          type="button"
          class="btn btn-dark me-3"
          @click="reset1"
        >
          Reset 3 level
        </button>
      </div>
      <div class="mb-3">
        <RegionGroupCore
          class="border rounded-3 shadow-sm"
          language="en"
          :city="enabledCity"
          :area="enabledArea"
          :town="enabledTown"
          v-model="model"
          @change="change"
          @complete="complete"
        />
      </div>

      <div class=" mb-3 row">
        <div class="col-md-6">
          <h4>values</h4>
          <pre
            class="m-0 bg-light p-3 rounded-3"
            v-text="JSON.stringify(model, null, 2)"
          />
        </div>

        <div class="col-md-6">
          <h4>model</h4>
          <pre
            class="m-0 bg-light p-3 rounded-3"
            v-text="JSON.stringify(values, null, 2)"
          />
        </div>
      </div>

      <h5>选择器模式</h5>
      <div class="mb-3">
        <RegionGroup
          :city="true"
          :area="true"
          :town="true"
          v-model="modelGroup"
          @change="changeGroup"
          @complete="complete"
          @visible-change="visibleChange"
        />
      </div>
      <div class="mb-3">
        <button
          type="button"
          class="btn btn-secondary"
          @click="resetGroup"
        >
          reset region
        </button>
      </div>

      <div class="bg-light p-3 mb-3 rounded-3 row">
        <div class="col-md-6">
          <pre
            class="m-0 mb-3"
            v-text="JSON.stringify(modelGroup, null, 2)"
          />
        </div>
        <div class="col-md-6">
          <pre
            class="m-0"
            v-text="JSON.stringify(valuesGroup, null, 2)"
          />
        </div>
      </div>

      <h5 class="mt-3">
        下拉选择器模式（自定义呼出按钮）
      </h5>
      <div>
        <RegionGroup
          custom-trigger-class="border border-secondary-subtle border-4"
          custom-container-class="border-0"
        >
          <template #default="{ region, visible }">
            <button
              type="button"
              class="btn btn-primary"
            >
              region:{{ resultText(region) }},
              visible: {{ visible }}
            </button>
          </template>
        </RegionGroup>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { RegionGroupCore, RegionGroup } from '@/'

const model = ref(undefined)
const values = ref(undefined)

const enabledCity = ref(true)
const enabledArea = ref(true)
const enabledTown = ref(true)

const modelGroup = ref(undefined)
const valuesGroup = ref(undefined)

function change (data) {
  values.value = data
}
function complete () {
  console.log('complete')
}
function changeGroup (data) {
  // console.log(data)
  valuesGroup.value = data
}
function resetGroup () {
  modelGroup.value = {
    province: '350000',
    city: '350100',
    area: '350104',
    town: '350104008'
  }
}
function visibleChange (val) {
  console.log('dropdown visible: ', val)
}
function resultText (region) {
  if (!region) return '无数据'

  if (!Object.values(region).some(val => val) || !region) {
    return '无数据'
  }
  return Object
    .values(region)
    .filter(val => val)
    .map(val => val.value)
    .join(',')
}
function reset () {
  // regionSelected.value.reset()
  model.value = {
    province: '350000',
    city: '350100',
    area: '350103',
    town: '350103012'
  }
}
function reset1 () {
  // regionSelected.value.reset()
  model.value = {
    province: '130000',
    city: '130300',
    area: '130304',
    town: undefined
  }
}
</script>
