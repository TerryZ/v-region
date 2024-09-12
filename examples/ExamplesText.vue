<template>
  <section>
    <h3 class="">
      Text
      <small>纯文本模式，初始化选中的项目，以纯文本的内容显示</small>
    </h3>
    <div class="p-3 shadow-sm rounded-3 border mb-3">
      <h5>默认显示文本</h5>
      <div class="mb-3 text-muted rounded-3 bg-light p-3">
        <RegionText v-model="region" />
      </div>

      <h5>带分隔符</h5>
      <div class="text-muted rounded-3 bg-light p-3">
        <RegionText
          v-model="region"
          separator="-"
        />
      </div>
    </div>
    <h4>四级行政区划</h4>
    <div class="p-3 shadow-sm rounded-3 border mb-3">
      <h5>默认显示文本</h5>
      <div class="mb-3 text-muted rounded-3 bg-light p-3">
        <RegionFullText v-model="region" />
      </div>

      <h5>带分隔符</h5>
      <div class="text-muted rounded-3 bg-light p-3">
        <RegionFullText
          v-model="region"
          separator="-"
        />
      </div>
    </div>
    <div>
      <button
        type="button"
        class="btn btn-dark"
        @click="change"
      >
        change
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { RegionText, RegionFullText } from '@/'

const region = ref({
  province: '350000',
  city: '350100',
  area: '350104',
  town: '350104008'
})
// const invalidRegion = ref({
//   province: '350000',
//   city: '350100',
//   area: '350103',
//   town: '350103012'
// })
function change () {
  region.value = {
    province: '350000',
    city: '350500',
    area: '350582',
    town: '350582105'
  }
}
</script>
