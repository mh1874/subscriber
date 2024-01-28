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
   * @param recharge_level 高级会员 2 超级会员 3
   * @param pay_money 支付金额
   * @param recharge_days 会员天数
   */
  payMiniProg(data: IPayment): Promise<any> {
    return request('/pay/pay_miniprog/', {
      method: 'POST',
      data
    })
  }
}
