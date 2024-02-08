import { defineStore } from 'pinia'

interface IUserInfo {
  avatar: any
  userName: string
  userId: number
  freeNoticeNum: number
  rewardNoticeNum: number
  userLevel: number
  memberIcon: any
  expireDate: string
}

const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {}
  }),
  actions: {
    setUserInfo(userInfo: IUserInfo): void {
      this.userInfo = { ...this.userInfo, ...userInfo }
    }
  }
})

export default useUserStore
