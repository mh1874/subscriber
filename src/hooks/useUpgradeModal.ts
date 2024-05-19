import { ref, unref, getCurrentInstance, onUnmounted } from 'vue'
import { mineApi } from '@/api'
import { useUserStore } from '@/store'
import vipIcon from '@/static/member/vip.png'
import svipIcon from '@/static/member/svip.png'

export function useUpgradeModal(): any {
  const currentInstance = getCurrentInstance()
  const userStore = useUserStore()
  const uidRef = ref<number>(0)
  const modalInstanceRef = ref<any>(null)
  const modalOptions = ref({
    title: '温馨提示',
    content: '今日推送次数已用完，分享、观看广告 限时送会员！'
  })
  const userLevelEnum: any = {
    2: vipIcon,
    3: svipIcon
  }
  const hasShown = ref<boolean>(false) // 是否已显示过弹窗

  const getInstance = () => {
    const instance = unref(modalInstanceRef)
    if (!instance) {
      console.error('useCountModal instance is undefined!')
      return
    }
    return instance
  }
  const register = (modalInstance: any, uuid: number) => {
    onUnmounted(() => {
      modalInstanceRef.value = null
    })
    uidRef.value = uuid
    modalInstanceRef.value = modalInstance
    currentInstance?.emit('register', modalInstance, uuid)
  }
  const getUserInfo = () => {
    mineApi.getUserInfo().then(({ status, data: userData }) => {
      if (status !== 1) return
      const userInfo = {
        avatar: 'https://www.lovecf.cn/app/logo.png',
        userName: '秒速球',
        userId: userData.user_id,
        freeNoticeNum: userData.notice_num_free,
        rewardNoticeNum: userData.notice_num_reward,
        userLevel: userData.user_level,
        memberIcon: userLevelEnum[userData.user_level],
        expireDate: userData.user_level_expire_date
      }
      userStore.setUserInfo(userInfo)
      const storedFlag = uni.getStorageSync('UPGRADE_SHOWN')
      hasShown.value = typeof storedFlag === 'boolean' ? storedFlag : false
      // 判断推送次数是否已用完
      if (
        !hasShown.value &&
        userInfo.freeNoticeNum + userInfo.rewardNoticeNum === 0
      ) {
        setTimeout(() => {
          getInstance()?.openModal()
        }, 300)
      }
    })
  }
  // 分享增加会员天数
  const addMemberDays = (shareId: number | string) => {
    if (shareId) {
      mineApi.addNoticeNum({ source_user_id: Number(shareId) })
    }
  }
  return [
    register,
    {
      getInstance,
      modalOptions,
      getUserInfo,
      addMemberDays
    }
  ]
}
