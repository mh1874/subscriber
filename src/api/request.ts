import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'
import { getToken, removeToken } from './token'
import {
  request_enum,
  isLoginOverdue,
  isNeedTokenApi,
  defaultTimeout
} from './enums'

// @ts-ignore
axios.defaults.adapter = mpAdapter

// create an axios instance
const service = axios.create({
  baseURL: 'https://www.lovecf.cn/test-api',
  withCredentials: true, // send cookies when cross-domain requests
  timeout: defaultTimeout, // request timeout
  headers: {
    'content-type': 'application/json'
  }
})

// request拦截器
service.interceptors.request.use(
  async (config: any) => {
    // 通过code获取token 接口不需携带token
    if (isNeedTokenApi(config.url)) {
      const token = await getToken()
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    // Do something with request error
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 处理 status非200的业务码错误 （鉴权失效的400、401不提示，需静默刷新token）
    if (!isLoginOverdue(error)) {
      uni.showToast({
        title: error.message,
        icon: 'none'
      })
    }
    return Promise.reject(error)
  }
)

const request = (url: string, options: any) => {
  const {
    headers,
    responseType,
    method,
    data,
    params,
    withoutTips, // 是否需要拦截错误提示
    timeout // 接口自定义超时时间
  } = options
  return new Promise((resolve, reject) => {
    const requestParams = {
      method,
      headers,
      responseType,
      timeout: timeout || defaultTimeout
    } as any
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      requestParams.data = data
    } else if (method === 'GET' || method === 'DELETE') {
      requestParams.params = params
    }
    service(url, requestParams)
      .then((res: any) => {
        if ((request_enum as any)[res.status] && !withoutTips) {
          uni.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
        resolve(res)
      })
      .catch((error) => {
        if (isLoginOverdue(error)) {
          removeToken()
          resolve(request(url, options))
        } else {
          reject(error)
        }
      })
  })
}

export default request
