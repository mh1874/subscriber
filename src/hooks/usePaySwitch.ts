import { ref } from 'vue'
import { mineApi } from '@/api'

export function usePaySwitch(): any {
  const paySwitch = ref<boolean>(false)
  // 获取是否显示支付开关
  const getPaySwitch = () => {
    mineApi
      .getPaySwitch()
      .then(({ status, data }) => {
        if (status !== 1) return
        paySwitch.value = data.pay_switch
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return {
    paySwitch,
    getPaySwitch
  }
}
