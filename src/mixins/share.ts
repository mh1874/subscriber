export default {
  onLoad() {
    // 设置默认的转发参数
    // @ts-ignore
    uni.$u.mpShare = {
      type: '2',
      mpId: 'wxad8965a1951dd4ae',
      title: '来订阅你喜欢的牛人吧~', // 默认为小程序名称
      path: '', // 默认为当前页面路径
      imageUrl: '' // 默认为当前页面的截图
    }
  },
  onShareAppMessage(): any {
    // @ts-ignore
    return uni.$u.mpShare
  },
  // #ifdef MP-WEIXIN
  onShareTimeline(): any {
    // @ts-ignore
    return uni.$u.mpShare
  }
  // #endif
}
