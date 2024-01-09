import axios from 'axios'
import { defaultTimeout } from './enums'
import { IWxInfo } from './types'
import { useUserStore } from '@/store'

export const ACCESS_TOKEN_KEY = 'token'

export function setToken(token: string) {
  uni.setStorage({
    key: ACCESS_TOKEN_KEY,
    data: token
  })
}

export function removeToken() {
  uni.removeStorage({
    key: ACCESS_TOKEN_KEY
  })
}

// create an axios instance
const service = axios.create({
  baseURL: 'https://www.lovecf.cn/api',
  withCredentials: true, // send cookies when cross-domain requests
  timeout: defaultTimeout, // request timeout
  headers: {
    'content-type': 'application/json'
  }
})

// response 拦截器
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

function getWxCode(): Promise<IWxInfo> {
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
}

async function getTokenByRefresh(code: string): Promise<any> {
  return new Promise((resolve, reject) => {
    service('/user/code', {
      method: 'POST',
      data: {
        code
      }
    })
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let isGettingToken = false

export async function getToken() {
  let token = uni.getStorageSync(ACCESS_TOKEN_KEY)
  if (token) {
    // 如果有token直接返回
    return token
  }
  // 如果同时有别的接口正在刷新token，这里做等待，等待token获取成功继续请求接口
  if (isGettingToken) {
    const sleeping = () => {
      return new Promise<void>((resolve) => {
        const timer = setInterval(() => {
          if (isGettingToken === false) {
            clearInterval(timer)
            resolve()
          }
        }, 50)
      })
    }
    await sleeping()
    return uni.getStorageSync(ACCESS_TOKEN_KEY)
  }
  // 如果没有token，尝试使用code重新获取token
  const wxInfo = await getWxCode() // 调用获取微信 code 的函数
  if (wxInfo) {
    isGettingToken = true
    try {
      const { data, status } = await getTokenByRefresh(wxInfo.code)
      if (status === 1) {
        const userStore = useUserStore()
        token = data.token
        setToken(token)
        console.log('userStore ==>', userStore)
        userStore.setUserId(data.user_id)
        return token
      }
      return Promise.reject()
    } catch (e) {
      return Promise.reject()
    } finally {
      isGettingToken = false
    }
  } else {
    return Promise.reject()
  }
}
