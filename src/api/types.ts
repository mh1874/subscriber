export interface IWxInfo {
  code: string
}
export interface IPager {
  count: number
  offset: number
}

export interface IBigVMessage extends IPager {
  bigv_id: number
}

export interface IBigV extends IPager {
  source_platform?: string
}

export interface IBigVFollow {
  bigv_id: number
  type: number
}

export interface IBigVSearch {
  nick: string
  count?: number
}

export interface IPayment {
  pay_calss: number
}

export interface INoticeNum {
  source_user_id: number
}

export interface IFeedBack {
  content: string
}
