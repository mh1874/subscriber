import request from '../request'
import { IPager } from '../types'

export default {
  /**
   * 获取可订阅自选的牛人列表
   * @param size 页码
   */
  getOptionalBigVList(params: IPager): Promise<any> {
    return request('/bigv/portfolio/', {
      method: 'GET',
      params
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
