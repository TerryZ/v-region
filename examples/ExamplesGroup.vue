<template>
  <section>
    <h3 class="mt-3">
      Group
      <small>下拉选择器模式</small>
    </h3>
    <div class="p-3 shadow-sm rounded-3 border">
      <h5>核心功能模块</h5>
      <div class="mb-3">
        <region-group-core
          class="border rounded-3 shadow-sm"
          :town="true"
          @complete="complete"
        />
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

      <div>
        <region-group
          :city="true"
          :area="true"
          :town="true"
          v-model="modelGroup"
          class="me-3"
          @complete="complete"
          @change="cbGroup"
          @input="input"
        />
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          @click="resetGroup"
        >
          reset region
        </button>
      </div>

      <h5 class="mt-3">
        下拉选择器模式（自定义呼出按钮）
      </h5>
      <div>
        <region-group>
          <template #default="{ region, show }">
            <button
              type="button"
              class="btn btn-primary"
            >
              region:{{ resultText(region) }},
              show: {{ show }}
            </button>
          </template>
        </region-group>
      </div>
    </div>
  </section>
</template>

<script>
import { RegionGroupCore, RegionGroup } from '@/components/v-region'

export default {
  components: {
    RegionGroupCore,
    RegionGroup
  },
  data () {
    return {
      modelGroup: null,
      valuesGroup: null
    }
  },
  methods: {
    complete () {
      console.log('complete')
    },
    input (data) {
      console.log(data)
    },
    cbGroup (data) {
      // console.log(data)
      this.valuesGroup = data
    },
    resetGroup () {
      this.modelGroup = {
        province: '350000',
        city: '350100',
        area: '350104',
        town: '350104008'
      }
    },
    resultText (region) {
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
  }
}
</script>
