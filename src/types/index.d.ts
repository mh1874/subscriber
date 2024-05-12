export type Nullable<T> = T | null

export interface IUserInfo {
  avatar: any
  userName: string
  userId: number
  freeNoticeNum: number
  rewardNoticeNum?: number
  userLevel: number
  memberIcon: any
  expireDate: string
}
