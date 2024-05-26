<template>
  <view class="upgrade-page">
    <view class="title">获取更多推送次数 ~</view>
    <view class="content">
      <view class="item invite">
        <text class="sub-title">分享到群聊</text>
        <text class="desc">
          每邀请一个新用户，即可获得 1 ~ 5 天超级会员。
        </text>
        <u-button
          type="primary"
          size="mini"
          plain
          shape="circle"
          open-type="share"
        >
          <view class="flex items-center">
            <text>去邀请</text>
            <u-icon name="arrow-rightward" class="ml-1" size="24"></u-icon>
          </view>
        </u-button>
      </view>
      <view class="item watch-ads" v-if="videoSwitch">
        <text class="sub-title">观看视频广告</text>
        <text class="desc"> 观看视频广告，即可获得 3 ~ 5 次推送次数。 </text>
        <u-button
          type="warning"
          size="mini"
          plain
          shape="circle"
          @click="toWatchAds"
        >
          <view class="flex items-center">
            <text>去观看</text>
            <u-icon name="arrow-rightward" class="ml-1" size="24"></u-icon>
          </view>
        </u-button>
      </view>
      <view class="item upgrade" v-if="paySwitch">
        <text class="sub-title">直接升级</text>
        <text class="desc"> 直接升级，立享超级会员体验。 </text>
        <u-button
          type="success"
          size="mini"
          plain
          shape="circle"
          @click="toUpgrade"
        >
          <view class="flex items-center">
            <text>去升级</text>
            <u-icon name="arrow-rightward" class="ml-1" size="24"></u-icon>
          </view>
        </u-button>
      </view>
    </view>
    <view class="post-script">PS：邀请新用户、观看视频广告 奖励可以叠加</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import { mineApi } from '@/api'
import { getUserId } from '@/api/token'
import { useActivitySwitch } from '@/hooks/useActivitySwitch'

const videoAd = ref<any>(null)

// 获取是否显示广告、支付开关
const { videoSwitch, paySwitch, getActivitySwitch } = useActivitySwitch()

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

onLoad(() => {
  getActivitySwitch()
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
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
    color: $warning-color;
  }
  .content {
    .item {
      margin-bottom: 30px;
      height: 130px;
      padding: 15px;
      display: flex;
      flex-direction: column;
      background-position: center center;
      background-size: cover;
      border-radius: 5px;
      .sub-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .desc {
        font-size: 14px;
        margin-bottom: 20px;
      }
    }
    .invite {
      background-image: url('~@/static/invite.jpg');
      .sub-title {
        color: #355993;
      }
      .desc {
        color: #0369a1;
      }
    }
    .watch-ads {
      background-image: url('~@/static/watch-ads.jpg');
      .sub-title {
        color: #bf772a;
      }
      .desc {
        color: $warning-color;
      }
    }
    .upgrade {
      background-image: url('~@/static/upgrade.jpg');
      .sub-title {
        color: #5e9a5f;
      }
      .desc {
        color: #16a34a;
      }
    }
  }
  .post-script {
    font-weight: bold;
    color: $warning-color;
  }
}
</style>
