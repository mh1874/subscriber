import request from '../request'
import { IBigV, IPager, IBigVSearch } from '../types'

export default {
  /**
   * 获取牛人列表
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
   * 获取牛人列表-我的关注
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
   * 牛人关注
   * @param bigv_id 牛人id
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
   * 牛人取消关注
   * @param bigv_id 牛人id
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
   * 模糊搜索牛人: 按照nick模糊搜索，按照粉丝数降序排列， 取前count个
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
