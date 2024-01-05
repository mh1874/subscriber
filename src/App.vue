<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useAuthStore } from '@/store'

const authStore = useAuthStore()

onLaunch(() => {
  const token = authStore.getToken()
  if (!token) {
    authStore.loginByWechat()
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
