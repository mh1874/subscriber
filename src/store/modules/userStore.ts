import { defineStore } from 'pinia'

interface IUserInfo {
  avatar: any
  userId: number
  noticeNum: number
  userLevel: number
}

const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {}
  }),
  actions: {
    isLogin() {
      return new Promise((resolve) =>
        uni.checkSession({
          success: () => {
            resolve(true)
          },
          fail: () => {
            resolve(false)
          }
        })
      )
    },
    setUserInfo(userInfo: IUserInfo): void {
      this.userInfo = userInfo
    }
  }
})

export default useUserStore
