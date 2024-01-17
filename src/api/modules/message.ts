import request from '../request'
import { IPager, IBigVMessage } from '../types'

export default {
  /**
   * 获取用户订阅的牛人消息列表
   * @param none
   */
  getMessageListFromUser(params: IPager): Promise<any> {
    return request('/message/from_user/', {
      method: 'GET',
      params
    })
  },
  /**
   * 获取牛人的消息列表
   * @param bigv_id 牛人id
   */
  getMessageListFromBigV(params: IBigVMessage): Promise<any> {
    return request('/message/from_bigv/', {
      method: 'GET',
      params
    })
  },
  /**
   * 获取消息详情
   * @param mes_id 消息id
   */
  getMessageDetail(mes_id: number): Promise<any> {
    return request('/message/', {
      method: 'GET',
      params: {
        mes_id
      }
    })
  }
}
