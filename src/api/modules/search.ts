import http from '../http'

interface IBigV {
  platform?: string
}

/**
 * 获取大V列表
 * @param user_id 用户id
 * @param params 分页信息
 */
function getBigVList(params: IBigV): Promise<{ res: any }> {
  return http.get('/bigv/', {
    params: {
      ...params
    }
  })
}

/**
 * 获取大V列表-我的关注
 * @param user_id 用户id
 * @param params 分页信息
 */
function getFollowedBigVList(params: IBigV): Promise<{ res: any }> {
  return http.get('/bigv/follow/', {
    params: {
      ...params
    }
  })
}

/**
 * 大V关注
 * @param bigv_id 大Vid
 */
function bigvFollow(bigv_id: number): Promise<{ res: any }> {
  return http.post('/user/follow/', {
    bigv_id
  })
}

/**
 * 大V取消关注
 * @param bigv_id 大Vid
 * @param params 分页信息
 */
function bigvUnFollow(bigv_id: number): Promise<{ res: any }> {
  return http.post('/user/unfollow/', {
    bigv_id
  })
}

export default {
  getBigVList,
  getFollowedBigVList,
  bigvFollow,
  bigvUnFollow
}
