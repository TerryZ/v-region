<template>
  <section>
    <h3 class="">
      Text
      <small>纯文本模式，初始化选中的项目，以纯文本的内容显示</small>
    </h3>
    <div class="p-3 shadow-sm rounded-3 border">
      <h5>默认显示文本</h5>
      <div class="mb-3 text-muted">
        <region-text v-model="selected" />
      </div>

      <h5>带分隔符</h5>
      <div class="text-muted">
        <region-text
          v-model="selected"
          separator="-"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { RegionText } from '@/'

export default {
  components: {
    RegionText
  },
  data () {
    return {
      selected: {
        province: '350000',
        city: '350100',
        area: '350103',
        town: '350103012'
      }
    }
  }
}
</script>
