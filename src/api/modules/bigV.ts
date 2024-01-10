import request from '../request'
import { IBigV, IPager, IBigVSearch } from '../types'

// /**
//  * 获取大V列表
//  * @param user_id 用户id
//  * @param params 分页信息
//  */
// function getBigVList(params: IBigV): Promise<{ res: any }> {
//   return http.get('/bigv/', {
//     params: {
//       ...params
//     }
//   })
// }

// /**
//  * 获取大V列表-我的关注
//  * @param user_id 用户id
//  * @param params 分页信息
//  */
// function getFollowedBigVList(params: IBigV): Promise<{ res: any }> {
//   return http.get('/bigv/follow/', {
//     params: {
//       ...params
//     }
//   })
// }

// /**
//  * 大V关注
//  * @param bigv_id 大Vid
//  */
// function bigvFollow(bigv_id: number): Promise<{ res: any }> {
//   return http.post('/user/follow/', {
//     bigv_id
//   })
// }

// /**
//  * 大V取消关注
//  * @param bigv_id 大Vid
//  * @param params 分页信息
//  */
// function bigvUnFollow(bigv_id: number): Promise<{ res: any }> {
//   return http.post('/user/unfollow/', {
//     bigv_id
//   })
// }

export default {
  /**
   * 获取大V列表
   * @param user_id 用户id
   * @param params 分页信息
   */
  getBigVList(params: IBigV): Promise<any> {
    return request('/bigv/', {
      method: 'GET',
      params
    })
  },
  /**
   * 获取大V列表-我的关注
   * @param user_id 用户id
   * @param params 分页信息
   */
  getFollowedBigVList(params: IPager): Promise<any> {
    return request('/bigv/follow/', {
      method: 'GET',
      params
    })
  },
  /**
   * 大V关注
   * @param bigv_id 大Vid
   */
  bigvFollow(bigv_id: number): Promise<any> {
    return request('/user/follow/', {
      method: 'POST',
      data: {
        bigv_id
      }
    })
  },
  /**
   * 大V取消关注
   * @param bigv_id 大Vid
   * @param params 分页信息
   */
  bigvUnFollow(bigv_id: number): Promise<any> {
    return request('/user/unfollow/', {
      method: 'POST',
      data: {
        bigv_id
      }
    })
  },
  /**
   * 模糊搜索大v: 按照nick模糊搜索，按照粉丝数降序排列， 取前count个
   * @param nick 昵称
   * @param count 数量
   */
  searchBigVList(params: IBigVSearch): Promise<any> {
    return request('/bigv/search/', {
      method: 'GET',
      params
    })
  }
}
