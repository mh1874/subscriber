import request from '../request'
import { IBigV, IPager, IBigVSearch, IBigVFollow } from '../types'

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
  bigvFollow(data: IBigVFollow): Promise<any> {
    return request('/user/follow/', {
      method: 'POST',
      data
    })
  },
  /**
   * 牛人取消关注
   * @param bigv_id 牛人id
   * @param params 分页信息
   */
  bigvUnFollow(data: IBigVFollow): Promise<any> {
    return request('/user/unfollow/', {
      method: 'POST',
      data
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
  },
  /**
   * 判断是否关注公众号: status=0表示未关注，status=1表示已关注
   * @param none
   */
  isFollowGZH(): Promise<any> {
    return request('/user/is_follow_gzh/', {
      method: 'GET'
    })
  }
}
