export interface IPager {
  count: number
  offset: number
}

export interface IBigVMessage extends IPager {
  bigv_id: number
}

export interface IBigV extends IPager {
  platform?: string
}

export interface IWxInfo {
  code: string
}
