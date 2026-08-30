<template>
  <RegionDropdown>
    <RegionCityPicker v-bind="$attrs" />
  </RegionDropdown>
</template>

<script setup lang="ts">
import RegionDropdown from '../../components/RegionDropdown'
import RegionCityPicker from '../../modules/city/RegionCityPicker'

defineOptions({
  inheritAttrs: false
})
</script>
