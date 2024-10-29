import request from '../request'

export default {
  /**
   * 获取可订阅自选的牛人列表
   * @param size 页码
   */
  getOptionalBigVList(): Promise<any> {
    return request('/message/from_bigv/', {
      method: 'GET'
    })
  },
  /**
   * 获取牛人自选详情
   * @param bigv_id 牛人id
   */
  getOptionalDetail(bigv_id: number): Promise<any> {
    return request('/message/portfolio/', {
      method: 'GET',
      params: {
        bigv_id
      }
    })
  }
}
