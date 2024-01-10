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

export interface IBigVSearch {
  nick: string
  count?: number
}
