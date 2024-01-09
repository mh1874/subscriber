import { defineStore } from 'pinia'

const useUserStore = defineStore('user', {
  state: () => ({
    userId: ''
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
    setUserId(user_id: any): void {
      console.log('user_id ==>', user_id)
      this.userId = user_id
    }
  }
})

export default useUserStore
