import { createApp } from 'vue'
import Buntpapier from 'buntpapier'
import router from './router.js'
import { RouterView } from 'vue-router'
import 'roboto-fontface'
import '@mdi/font/css/materialdesignicons.css'
import '~/styles/global.styl'

const app = createApp(RouterView)
app.use(router)
app.use(Buntpapier)
app.mount('#app')
