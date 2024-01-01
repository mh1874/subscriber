import http from '../http'

interface IPager {
  count: number
  offset: number
}

interface IUserMessage extends IPager {
  user_id: number
}

interface IBigVMessage extends IPager {
  bigv_id: number
}

/**
 * 获取用户订阅的大V消息列表
 * @param user_id 用户id
 */
function getMessageListFromUser(params: IUserMessage): Promise<{ res: any }> {
  return http.get('/message/from_user', {
    params: {
      ...params
    }
  })
}

/**
 * 获取大V的消息列表
 * @param bigv_id 大Vid
 */
function getMessageListFromBigV(params: IBigVMessage): Promise<{ res: any }> {
  return http.get('/message/from_bigv', {
    params: {
      ...params
    }
  })
}

export default {
  getMessageListFromUser,
  getMessageListFromBigV
}
