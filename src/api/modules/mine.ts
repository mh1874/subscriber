import request from '../request'
import { IPayment } from '../types'

export default {
  /**
   * 获取用户信息
   * @param none
   */
  getUserInfo(): Promise<any> {
    return request('/user/', {
      method: 'GET'
    })
  },
  /**
   * 增加用户奖励通知次数
   * @param none
   */
  addNoticeNum(): Promise<any> {
    return request('/user/add_notice_num_reward/', {
      method: 'POST'
    })
  },
  /**
   * 下单接口
   * @param pay_calss 支付类型
   */
  payMiniProg(data: IPayment): Promise<any> {
    return request('/pay/pay_miniprog/', {
      method: 'POST',
      data
    })
  }
}
