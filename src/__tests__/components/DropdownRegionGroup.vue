<template>
  <RegionDropdown>
    <RegionGroup v-bind="$attrs" />
  </RegionDropdown>
</template>

<script setup lang="ts">
import RegionDropdown from '../../components/RegionDropdown'
import RegionGroup from '../../modules/group/RegionGroup'

defineOptions({
  inheritAttrs: false
})
</script>
