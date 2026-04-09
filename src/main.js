import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Vant from 'vant'
import 'vant/lib/index.css';
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 创建pinia实例并添加持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 使用已配置的pinia实例
app.use(pinia)  // 修改这行，使用已配置的pinia实例，而不是新建一个
app.use(router)
app.use(Vant)


app.mount('#app')
