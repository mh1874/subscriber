import http from '../http'

interface IBigV {
  platform?: string
  user_id: number
}

/**
 * 获取大V列表
 * @param user_id 用户id
 * @param params 分页信息
 */
function getBigVList(user_id: number, params: IBigV): Promise<{ res: any }> {
  return http.get(`/bigv/${user_id}`, {
    params: {
      ...params
    }
  })
}

export default {
  getBigVList
}
