export interface IMessage {
  nick: string
  avatar: string
  bigv_id: number
  modified_time: string
  message: string
  source_platform: string
  mes_id: number
  source_id: string
  created_time: string
}

export interface IBigv {
  nick: string
  modified_time: string
  source_platform: string
  fans_num: number
  avatar: string
  intro: string
  bigv_id: number
  source_id: string
  created_time: string
}
