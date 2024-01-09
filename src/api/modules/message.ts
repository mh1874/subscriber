import request from '../request'
import { IPager, IBigVMessage } from '../types'

// /**
//  * 获取用户订阅的大V消息列表
//  * @param none
//  */
// function getMessageListFromUser(params: IPager): Promise<{ res: any }> {
//   return http.get('/message/from_user/', {
//     params: {
//       ...params
//     }
//   })
// }

// /**
//  * 获取大V的消息列表
//  * @param bigv_id 大Vid
//  */
// function getMessageListFromBigV(params: IBigVMessage): Promise<{ res: any }> {
//   return http.get('/message/from_bigv/', {
//     params: {
//       ...params
//     }
//   })
// }

// /**
//  * 获取消息详情
//  * @param mes_id 消息id
//  */
// function getMessageDetail(mes_id: number): Promise<{ res: any }> {
//   return http.get('/message/', {
//     params: {
//       mes_id
//     }
//   })
// }

export default {
  /**
   * 获取用户订阅的大V消息列表
   * @param none
   */
  getMessageListFromUser(params: IPager): Promise<any> {
    return request('/message/from_user/', {
      method: 'GET',
      params
    })
  },
  /**
   * 获取大V的消息列表
   * @param bigv_id 大Vid
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
