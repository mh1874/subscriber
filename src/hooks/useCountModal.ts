import { ref, unref, getCurrentInstance, onUnmounted } from 'vue'
import { mineApi } from '@/api'
import { useUserStore } from '@/store'
import vipIcon from '@/static/member/vip.png'
import svipIcon from '@/static/member/svip.png'

export function useCountModal() {
  const currentInstance = getCurrentInstance()
  const uidRef = ref<number>(0)
  const modalInstanceRef = ref<any>(null)
  const userStore = useUserStore()
  const modalOptions = ref({
    title: '温馨提示',
    content: '今日推送次数已用完，分享、观看广告、升级 限时送会员！'
  })
  const userLevelEnum = {
    2: vipIcon,
    3: svipIcon
  }
  const getInstance = () => {
    const instance = unref(modalInstanceRef)
    if (!instance) {
      console.error('useDrawerInner instance is undefined!')
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
      if (userInfo.freeNoticeNum + userInfo.rewardNoticeNum) {
        if (getInstance()?.openModal) {
          getInstance()?.openModal()
        }
      }
    })
  }
  const addNoticeNum = (shareId: number) => {
    if (shareId) {
      mineApi.addNoticeNum({ source_user_id: shareId })
    }
  }
  return [
    register,
    {
      getInstance,
      modalOptions,
      getUserInfo,
      addNoticeNum
    }
  ]
}
