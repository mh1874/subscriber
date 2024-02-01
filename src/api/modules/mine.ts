import request from '../request'
import { IPayment, INoticeNum, IFeedBack } from '../types'

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
  addNoticeNum(data: INoticeNum): Promise<any> {
    return request('/user/add_notice_num_reward/', {
      method: 'POST',
      data
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
  },
  /**
   * 接收用户意见与反馈
   * @param content 反馈内容
   */
  submitFeedback(data: IFeedBack): Promise<any> {
    return request('/user/feedback/', {
      method: 'POST',
      data
    })
  },
  /**
   * 获取常见问题
   * @param content 反馈内容
   */
  getFaqData(): Promise<any> {
    return request('/user/faq/', {
      method: 'GET'
    })
  }
}
