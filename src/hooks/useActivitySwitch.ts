import { ref } from 'vue'
import { mineApi } from '@/api'

export function useActivitySwitch(): any {
  const paySwitch = ref<boolean>(false)
  const videoSwitch = ref<boolean>(false)
  // 获取是否显示支付开关
  const getActivitySwitch = () => {
    mineApi
      .getActivitySwitch()
      .then(({ status, data }) => {
        if (status !== 1) return
        paySwitch.value = data.pay_switch
        videoSwitch.value = data.video_switch
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return {
    videoSwitch,
    paySwitch,
    getActivitySwitch
  }
}
