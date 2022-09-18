import { createApp } from 'vue'
import { router } from './router'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'

// import Page from '@'

// const app = createApp(App)

// app.use(Page, {
//   align: 'left',
//   language: 'en'
// })

// app.mount('#app')
const app = createApp(App)
app.use(router)
app.mount('#app')
