<template>
  <section>
    <h3 class="">
      Group
      <small>下拉选择器模式</small>
    </h3>
    <div class="p-3 shadow-sm rounded-3 border">
      <h5>核心功能模块</h5>
      <div class="mb-3">
        <RegionGroupCore
          class="border rounded-3 shadow-sm"
          language="en"
          :city="true"
          :area="true"
          :town="true"
          v-model="model"
          @change="change"
          @complete="complete"
        />
      </div>

      <div class="bg-light p-3 mb-3 rounded-3">
        <pre
          class="m-0 mb-3"
          v-text="JSON.stringify(model, null, 2)"
        />
        <pre
          class="m-0"
          v-text="JSON.stringify(values, null, 2)"
        />
      </div>

      <h5>选择器模式</h5>
      <div class="mb-3">
        <RegionGroup
          :city="true"
          :area="true"
          :town="true"
          v-model="modelGroup"
          class="me-3"
          @change="changeGroup"
          @complete="complete"
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

      <div class="bg-light p-3 mb-3 rounded-3">
        <pre
          class="m-0 mb-3"
          v-text="JSON.stringify(modelGroup, null, 2)"
        />
        <pre
          class="m-0"
          v-text="JSON.stringify(valuesGroup, null, 2)"
        />
      </div>

      <h5 class="mt-3">
        下拉选择器模式（自定义呼出按钮）
      </h5>
      <div>
        <RegionGroup>
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

const model = ref(null)
const values = ref(null)

const modelGroup = ref(null)
const valuesGroup = ref(null)

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
</script>
