// 业务码与提示类型对应枚举
export const request_enum = {
  0: 'error'
}
// 是否登录过期
export const isLoginOverdue = (error: any) => {
  return [400, 401].includes(error?.response?.status)
}

// 不需要验证token的接口
export const withOutTokenApi = [
  '/user/code' // 登录
]

/**
 * 判断当前api是否需要token
 */
export function isNeedTokenApi(url: string) {
  return withOutTokenApi.every((it) => !url.includes(it))
}

// 接口默认超时时间
export const defaultTimeout = 10000
// 用于上传、下载等数据量较大的接口的超时时间
export const longTimeout = 60000
