import request from '../request'

export default {
  /**
   * 获取用户信息
   * @param none
   */
  getUserInfo(): Promise<any> {
    return request('/user/', {
      method: 'GET'
    })
  }
}
