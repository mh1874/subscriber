<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  uni.login({
    provider: 'weixin',
    success(loginRes) {
      console.log(loginRes)
    }
  })
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
