<template>
  <view class="upgrade-page">
    <view class="title">获取更多推送次数 ~</view>
    <view class="content">
      <view class="item">
        <view class="sub-title">
          <text class="mr-3">邀请新用户</text>
          <u-button type="warning" size="mini" open-type="share">
            去邀请
          </u-button>
        </view>
        <view class="desc"> 邀请新用户，即可获得 1 ~ 5 天超级会员体验。 </view>
      </view>
      <view class="item">
        <view class="sub-title">
          <text class="mr-3">观看视频广告</text>
          <u-button type="warning" size="mini" @click="toWatchAds">
            去观看
          </u-button>
        </view>
        <view class="desc">
          观看视频广告，即可获得 1 ~ 3 天超级会员体验。
        </view>
      </view>
      <view class="item" v-if="paySwitch">
        <view class="sub-title">
          <text class="mr-3">直接升级</text>
          <u-button type="warning" size="mini" @click="toUpgrade">
            去升级
          </u-button>
        </view>
        <view class="desc"> 直接升级，立享超级会员体验。 </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import { mineApi } from '@/api'
import { getUserId } from '@/api/token'

const videoAd = ref<any>(null)
const paySwitch = ref<boolean>(false)

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
        .catch(() => {
          uni.showToast({
            title: '视频广告显示失败，请重试',
            icon: 'none'
          })
        })
    })
  }
}

// 获取是否显示支付开关
const getPaySwitch = () => {
  mineApi
    .getPaySwitch()
    .then(({ status, data }) => {
      if (status !== 1) return
      paySwitch.value = data.pay_switch
    })
    .catch((err) => {
      console.log(err)
    })
}

onLoad(() => {
  getPaySwitch()
  // 在页面onLoad回调事件中创建激励视频广告实例
  if (wx.createRewardedVideoAd) {
    videoAd.value = wx.createRewardedVideoAd({
      adUnitId: 'adunit-bc949e900035fa83'
    })
    videoAd.value.onLoad(() => {})
    videoAd.value.onError(() => {
      uni.showToast({
        title: '视频广告加载失败，请重试',
        icon: 'none'
      })
    })
    videoAd.value.onClose(async (res) => {
      if (res.isEnded) {
        // 正常播放结束，可以下发奖励
        const { status, msg } = await mineApi.addNoticeNum({
          source_user_id: 888888
        })
        if (status === 1) {
          uni.showToast({
            title: msg,
            icon: 'none'
          })
        }
      } else {
        // 播放中途退出
        uni.showToast({
          title: '视频未播放完成，请重试',
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
      position: relative;
      display: flex;
      align-items: center;
      font-weight: bold;
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
  .post-script {
    font-weight: bold;
    color: $warning-color;
  }
}
</style>
