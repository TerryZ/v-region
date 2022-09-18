import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('./ExamplesIndex.vue'),
    children: [
      { path: '/selects', component: () => import('./ExamplesSelects.vue') },
      { path: '/group', component: () => import('./ExamplesGroup.vue') },
      { path: '/columns', component: () => import('./ExamplesColumns.vue') },
      { path: '/city', component: () => import('./ExamplesCity.vue') },
      { path: '/text', component: () => import('./ExamplesText.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export { router }
