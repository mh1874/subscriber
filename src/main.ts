import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
// @ts-ignore
import uView from 'vk-uview-ui'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import mpShare from '@/mixins/share'

import App from './App.vue'

// unocss
import 'uno.css'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export function createApp() {
  const app = createSSRApp(App)
  app.mixin(mpShare)
  app.use(Pinia.createPinia())
  app.use(uView)
  app.config.globalProperties.$dayjs = dayjs
  // app.config.globalProperties.$onLaunched = new Promise((resolve) => {
  //   app.config.globalProperties.$isResolve = resolve
  // })
  return {
    app,
    // uni-app 官方文档示例 https://zh.uniapp.dcloud.io/tutorial/vue3-pinia.html#%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86-pinia
    Pinia // 此处必须将 Pinia 返回
  }
}
