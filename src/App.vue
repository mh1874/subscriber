<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useAuthStore } from '@/store'

const { proxy } = getCurrentInstance()

const authStore = useAuthStore()

onLaunch(async () => {
  const isLogin = await authStore.isLogin()
  const token = authStore.getToken()
  if (!isLogin || !token) {
    await authStore.loginByWechat()
    proxy.$isResolve()
  }
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style lang="scss">
@import 'vk-uview-ui/index.scss';
</style>
