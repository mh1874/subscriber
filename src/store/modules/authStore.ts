import { defineStore } from 'pinia'
import { userApi } from '@/api'

interface IWxInfo {
  code: string
}

const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    userId: ''
  }),
  getters: {
    tokenVal: (state) => state.token,
    userIdVal: (state) => state.userId
  },
  actions: {
    isLogin() {
      return new Promise((resolve, reject) => {
        uni.checkSession({
          success: () => {
            resolve(true)
          },
          fail: () => {
            reject(false)
          }
        })
      })
    },
    async loginByWechat() {
      try {
        const wxInfo = await this.getWxCode() // 调用获取微信 code 的函数
        const { status, data } = await userApi.loginByWechat(wxInfo.code)
        if (status === 1) {
          this.setToken(data.token)
          this.setUserId(data.user_id)
        }
      } catch (error) {
        console.error('Login failed', error)
      }
    },
    getWxCode(): Promise<IWxInfo> {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: 'weixin',
          success: (wxInfo) => {
            resolve(wxInfo)
          },
          fail: (error) => {
            reject(error)
          }
        })
      })
    },
    setUserId(user_id: any): void {
      this.userId = user_id
    },
    getToken(): string {
      return this.token || uni.getStorageSync('token') || ''
    },
    setToken(token: string): void {
      this.token = token
      uni.setStorage({
        key: 'token',
        data: token
      })
    },
    removeToken(): void {
      this.token = ''
      uni.removeStorage({
        key: 'token'
      })
    }
  }
})

export default useAuthStore
