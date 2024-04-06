<template>
  <view class="upgrade-page">
    <view class="title">获取更多推送次数 ~</view>
    <view class="content">
      <view class="item">
        <view class="sub-title">
          邀请新用户限时送会员
          <u-button type="warning" size="mini" open-type="share">
            去邀请
          </u-button>
        </view>
        <view class="desc">
          在活动期间，邀请新用户注册并使用秒速球，即可获得1~5天超级会员体验。
        </view>
      </view>
      <view class="item">
        <view class="sub-title">
          直接升级
          <u-button type="warning" size="mini" @click="toUpgrade">
            去升级
          </u-button>
        </view>
        <view class="desc"> 直接升级，立享超级会员体验。 </view>
      </view>
      <view class="item">
        <view class="sub-title">
          看视频广告
          <u-button type="warning" size="mini" @click="toWatchAds">
            去观看
          </u-button>
        </view>
        <view class="desc"> 观看视频广告，即可获得1~3天超级会员体验。 </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getUserId } from '@/api/token'

const videoAd = ref<any>(null)

const toUpgrade = () => {
  uni.navigateTo({ url: '/pages/mine/detail/member' })
}

const toWatchAds = () => {
  // 用户触发广告后，显示激励视频广告
  if (videoAd.value) {
    videoAd.value.show().catch(() => {
      // 失败重试
      videoAd.value
        .load()
        .then(() => videoAd.value.show())
        .catch((err) => {
          uni.showToast({
            title: '激励视频广告显示失败，请重试',
            icon: 'none'
          })
        })
    })
  }
}

onLoad(() => {
  // 在页面onLoad回调事件中创建激励视频广告实例
  if (wx.createRewardedVideoAd) {
    videoAd.value = wx.createRewardedVideoAd({
      adUnitId: 'adunit-bc949e900035fa83'
    })
    videoAd.value.onLoad(() => {})
    videoAd.value.onError(() => {
      uni.showToast({
        title: '激励视频光告加载失败，请重试',
        icon: 'none'
      })
    })
    videoAd.value.onClose((res) => {
      if (res.isEnded) {
        // 正常播放结束，可以下发奖励
      } else {
        // 播放中途退出
        uni.showToast({
          title: '未播放完成，请重试',
          icon: 'none'
        })
      }
    })
  }
})

onShow(() => {
  const userId = getUserId()
  uni.$u.mpShare.path = `/pages/message/index?shareId=${userId}`
  uni.$u.mpShare.imageUrl = 'https://www.lovecf.cn/app/share.png'
})
</script>

<style lang="scss" scoped>
.upgrade-page {
  padding: 15px;
  padding-bottom: 100px;
  background-color: #f0fdfa;

  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
    color: $warning-color;
  }
  .content {
    padding-left: 15px;
    .item {
      margin-bottom: 20px;
    }
    .sub-title {
      font-weight: bold;
      position: relative;
    }
    .sub-title::before {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      left: -12px;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      background-color: #000;
      border-radius: 50%;
    }
    .desc {
      font-size: 13px;
      color: #333;
      margin-top: 5px;
      line-height: 24px;
    }
  }
}
</style>
