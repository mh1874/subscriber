import { defineStore } from 'pinia'
import { userApi } from '@/api'

interface IWxInfo {
  code: string
}

const useAuthStore = defineStore('auth', {
  state: () => ({
    token: ''
  }),
  getters: {
    token: (state) => state.token
  },
  actions: {
    async loginByWechat() {
      try {
        const wxInfo = await this.getWxCode() // 调用获取微信 code 的函数
        const res = await userApi.loginByWechat(wxInfo.code)
        this.setToken(res.token)
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
