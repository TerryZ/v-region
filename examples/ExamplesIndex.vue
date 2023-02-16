<template>
  <div class="">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a
          class="navbar-brand fw-bold"
          href="#"
        >v-region examples</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div
          class="collapse navbar-collapse"
          id="navbarNav"
        >
          <ul class="navbar-nav">
            <li
              class="nav-item"
              v-for="item in modules"
              :key="item.key"
            >
              <router-link
                class="nav-link"
                aria-current="page"
                :class="isActive(item)"
                :to="item.url"
                @click="change(item)"
              >
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="p-5">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'

const modules = [
  { key: 'selects', name: 'Selects', url: '/selects' },
  { key: 'group', name: 'Group', url: '/group' },
  { key: 'columns', name: 'Columns', url: '/columns' },
  { key: 'city', name: 'City', url: '/city' },
  { key: 'text', name: 'Text', url: '/text' }
]
const active = ref('')

function isActive (item) {
  if (active.value && active.value === item.key) {
    return 'active'
  }
  return ''
}
function change (item) {
  active.value = item.key
}

onBeforeMount(() => {
  const route = useRoute()
  const module = modules.find(val => val.url === route.path)
  if (module) {
    active.value = module.key
  }
})
</script>
