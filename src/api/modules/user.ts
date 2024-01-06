import http from '../http'

/**
 * 微信登录
 * @param code 登录凭证
 */
function loginByWechat(code: string): Promise<any> {
  return http.post('/user/code', {
    code
  })
}

export default {
  loginByWechat
}
