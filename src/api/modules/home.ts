import http from '../http'

/**
 * 获取订阅大V消息列表
 * @param status 状态
 */
function getSubscribedList(status: number): Promise<{ res: any }> {
  return http.get('random/code', {
    params: {
      status
    }
  })
}

export default {
  getSubscribedList
}
