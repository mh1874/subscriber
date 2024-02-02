<template>
  <view class="about-page">
    <view class="mb-10">
      <view class="leading-6 mb-3">
        秒速球，聚焦优质财经达人。通过【牛人列表】订阅感兴趣的财经牛人，获取实时消息
      </view>
      <view class="content leading-6 mb-5">
        <view>
          1.
          <text class="keyword">速度快</text>
          秒级响应，极速推送，快人一步！
        </view>
        <view>
          2.
          <text class="keyword">信息全</text>
          ，所有消息（含秒删帖，修改贴），秒速球都可捕获并推送，祝您运筹帷幄!
        </view>
        <view>
          3.
          <text class="keyword">成本低</text>，普通用户每日可享受
          <text color-orange>5</text> 次推送次数，
          <u-button type="warning" size="mini" open-type="share">
            分享小程序
          </u-button>
          邀请新用户可获取额外奖励次数(每日不清零，长期有效)，还可通过
          <u-button type="warning" size="mini" @click="toDetail('member')">
            升级会员
          </u-button>
          ，获取优先推送以及更多推送次数!
        </view>
      </view>
      <view class="leading-6 mb-5">
        欢迎使用并推荐秒速球，任何问题都可通过
        <u-button type="warning" size="mini" @click="toDetail('feedback')">
          反馈和意见
        </u-button>
        告知我们
      </view>
      <view class="font-semibold mb-5">
        长按下方二维码，打开名片，加我为好友吧 ~
      </view>
      <view class="qrcode">
        <image
          class=""
          :src="qrcodeImg"
          show-menu-by-longpress
          mode="aspectFill"
        ></image>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { getUserId } from '@/api/token'
import qrcodeImg from '@/static/qrcode.png'
import defaultAvatar from '@/static/logo.png'
import shareImg from '@/static/share.png'

// 跳转详情
const toDetail = (key: string) => {
  const url = `/pages/mine/detail/${key}`
  uni.navigateTo({ url })
}

onShow(() => {
  const userId = getUserId()
  uni.$u.mpShare.path = `/pages/message/index?shareId=${userId}`
  uni.$u.mpShare.imageUrl = shareImg
})
</script>

<style lang="scss" scoped>
.about-page {
  padding: 20px;
  .content {
    padding: 15px 10px;
    background-color: #f7f7f7;
    .keyword {
      color: #22c55e;
      font-weight: bold;
    }
  }
  .share-btn {
    display: inline;
    padding: 0;
    border: none;
    line-height: 27px;
    font-size: 13px;
    color: orange;
    text-decoration: underline;
  }
  .link {
    color: orange;
    text-decoration: underline;
  }
  .qrcode {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    image {
      width: 150px;
      height: 150px;
      object-fit: contain;
    }
  }
}
</style>
