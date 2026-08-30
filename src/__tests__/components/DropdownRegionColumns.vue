<template>
  <RegionDropdown>
    <RegionColumns v-bind="$attrs" />
  </RegionDropdown>
</template>

<script setup lang="ts">
import RegionDropdown from '../../components/RegionDropdown'
import RegionColumns from '../../modules/column/RegionColumns'

defineOptions({
  inheritAttrs: false
})
</script>
