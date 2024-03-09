<template>
  <view class="about-page">
    <view class="title">限时邀请新用户，送会员啦 🎉 🎉 🎉 </view>
    <view class="content">
      <view class="description">
        <image
          class="logo"
          src="https://www.lovecf.cn/app/logo.png"
          mode="aspectFill"
        ></image>
        <text class="keyword ml-8">秒速球</text>
        <text> 上线一个月啦，为了感谢大家的支持，我们特别推出</text>
        <text class="keyword">“邀请好友，共享会员”</text>
        <text>活动，活动详情如下：</text>
      </view>
      <view class="section">
        <text class="sub-title">1. 邀请奖励</text>
        ：在活动期间，每邀请一位新用户注册并使用秒速球，将有机会获得
        <text class="keyword">1 ~ 5 天</text>
        的超级会员体验（最多可累计至
        <text class="keyword">30 天</text>
        ）。超级会员享有无限消息推送的特权！
      </view>
      <view class="section">
        <text class="sub-title">2. 分享方式</text>
        ：您可以通过下方图片中的多种渠道分享小程序，特别是那些人数众多的股票交流群，让更多朋友加入
        <text class="keyword">秒速球</text>
        的大家庭。
      </view>
      <view class="section">
        <text class="sub-title">3. 已有会员</text>
        ：对于已经加入
        <text class="keyword">秒速球</text>
        的高级会员，我们将直接为您升级至超级会员，已经是超级会员的用户将额外获得一个月的会员期限（自动生效）。
      </view>
      <view class="section">
        PS：活动将持续
        <text class="keyword">1 ~ 2 周</text>
        ，欢迎大家踊跃参与！
      </view>
      <view class="ending">
        感谢大家对
        <text class="keyword">秒速球</text>
        的支持与推荐，我们期待与您一起在股市中共创辉煌！立即行动，
        <u-button type="warning" size="mini" open-type="share">
          邀请好友
        </u-button>
        享更多会员福利吧！
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { getUserId } from '@/api/token'

onShow(() => {
  const userId = getUserId()
  uni.$u.mpShare.path = `/pages/message/index?shareId=${userId}`
  uni.$u.mpShare.imageUrl = 'https://www.lovecf.cn/app/share.png'
})
</script>

<style lang="scss" scoped>
.about-page {
  padding: 15px;
  padding-bottom: 100px;
  background-color: #f0fdfa;

  .title {
    font-size: 16px;
    font-weight: bold;
    color: $title-color;
    margin-bottom: 20px;
  }

  .sub-title {
    font-weight: bold;
    color: $title-color;
  }

  .keyword {
    font-weight: bold;
    color: $main-color;
  }

  .content {
    line-height: 24px;
    .description {
      font-size: 14px;
      margin-bottom: 10px;
      position: relative;
      .logo {
        position: absolute;
        width: 30px;
        height: 25px;
        border-radius: 50%;
        margin-right: 20px;
      }
    }
    .section {
      margin-bottom: 10px;
    }
    .ending {
      margin-top: 20px;
    }
  }
}
</style>
