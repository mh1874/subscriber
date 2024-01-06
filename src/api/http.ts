import axios from 'axios'
import { getFullURL } from '@/utils/http'
import { useAuthStore } from '@/store'

// 是否正在重新登陆刷新的标记
let loginRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = [] as any

const instance = axios.create({
  // Web 侧可以通过 vite.config.js 中的 proxy 配置，指定代理
  // 小程序APP里需写完整路径，如 https://service-rbji0bev-1256505457.cd.apigw.tencentcs.com/release
  // 可使用条件编译,详见 https://uniapp.dcloud.io/tutorial/platform.html#preprocessor
  // #ifdef H5
  baseURL: import.meta.env.VITE_APP_AXIOS_BASE_URL,
  // #endif
  // #ifndef H5
  // @ts-ignore
  baseURL: 'https://www.lovecf.cn/api',
  // baseURL: 'http://192.168.3.6:8877/api',
  // #endif
  adapter(config) {
    const { url, method, data, params, headers, baseURL, paramsSerializer } =
      config
    return new Promise((resolve, reject) => {
      uni.request({
        method: method!.toUpperCase() as any,
        url: getFullURL(baseURL || '', url!, params, paramsSerializer),
        header: headers,
        data,
        dataType: 'json',
        responseType: config.responseType,
        success: (res: any) => {
          resolve(res)
        },
        fail: (err: any) => {
          reject(err)
        }
      })
    })
  }
})

/**
 * 请求拦截
 */
instance.interceptors.request.use(async (config) => {
  const { method, params } = config
  const authStore = useAuthStore()
  // 附带鉴权的token
  const headers: any = {
    Authorization: authStore.getToken()
  }
  // 不缓存get请求
  if (method === 'get') {
    headers['Cache-Control'] = 'no-cache'
  }
  // delete请求参数放入body中
  if (method === 'delete') {
    headers['Content-type'] = 'application/json;'
    Object.assign(config, {
      data: params,
      params: {}
    })
  }

  return {
    ...config,
    headers
  }
})

/**
 * 响应拦截
 */
instance.interceptors.response.use(async (v) => {
  if (v.data?.code === 401) {
    if (!loginRefreshing) {
      // 防止重复登陆
      loginRefreshing = true
      const authStore = useAuthStore()
      authStore.removeToken()
      authStore
        .loginByWechat()
        .then(() => {
          // 所有存储到对列组中的请求重新执行。
          requests.forEach((callback: (arg0: string) => void) => {
            callback(authStore.getToken() || '')
          })
          // 重试队列清空
          requests = []
        })
        .catch(() => {
          uni.showToast({
            title: '账户异常请重启程序',
            duration: 2000,
            icon: 'none'
          })
        })
        .finally(() => {
          // 销毁 是否正在重新登陆刷新的标记
          loginRefreshing = false
        })
    }
    return v.data
  }
  // 业务错误
  if (v.data && v.data.status !== 1) {
    uni.showToast({
      title: v.data.msg,
      icon: 'none'
    })
  }
  // @ts-ignore
  if ((v.status || v.statusCode) === 200) {
    return v.data
  }
  // alert(v.statusText, '网络错误')
  return Promise.reject(v)
})

export default instance
