import { defineStore } from 'pinia'
import { IUserInfo } from '@/types'

const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      avatar: 'https://www.lovecf.cn/app/logo.png',
      userName: '秒速球',
      userId: 0,
      freeNoticeNum: 0,
      userLevel: 0,
      memberIcon: null,
      expireDate: ''
    } as IUserInfo
  }),
  actions: {
    setUserInfo(userInfo: IUserInfo): void {
      this.userInfo = { ...this.userInfo, ...userInfo }
    }
  }
})

export default useUserStore
