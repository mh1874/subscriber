<template>
  <view class="reminder-page">
    <view class="description"> 完成以下两个步骤，获取订阅消息推送 </view>
    <u-time-line>
      <u-time-line-item nodeTop="2">
        <template v-slot:node>
          <view class="node" style="background: #ff9900"> 1 </view>
        </template>
        <template v-slot:content>
          <view>
            <view class="title">第一步：关注公众号</view>
            <view class="desc">
              关注牛人动态，即刻获取最新消息，通过公众号实时推送。
            </view>
            <view class="action-btn">
              <u-button type="warning" size="mini" @click="toFollowAccount">
                去关注
              </u-button>
            </view>
          </view>
        </template>
      </u-time-line-item>
      <u-time-line-item nodeTop="2">
        <template v-slot:node>
          <view class="node" style="background: #ff9900"> 2 </view>
        </template>
        <template v-slot:content>
          <view>
            <view class="title">第二步：打开消息提醒</view>
            <view class="desc">
              开启消息提醒，让您随时获知关注牛人的最新动态，确保您不会错过任何重要消息。
            </view>
            <view class="action-btn">
              <u-button type="warning" size="mini" @click="toOpenRemind">
                去打开
              </u-button>
            </view>
          </view>
        </template>
      </u-time-line-item>
      <u-time-line-item nodeTop="2">
        <template v-slot:node>
          <view class="node" style="background: #59bb73">
            <u-icon name="checkmark" color="#fff" :size="24"></u-icon>
          </view>
        </template>
        <template v-slot:content>
          <view class="title">开启精彩之旅~</view>
        </template>
      </u-time-line-item>
    </u-time-line>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const followAccountUrl = 'https://mp.weixin.qq.com/s/OUR0W39-TJyOX0W45vmwmg'
const openRemindUrl = 'https://mp.weixin.qq.com/s/LD5LLSrqrGiyrMhsdkdswg'

// 关注公众号
const toFollowAccount = () => {
  uni.navigateTo({ url: `/pages/mine/detail/webView?url=${followAccountUrl}` })
}

// 打开消息提醒
const toOpenRemind = () => {
  uni.navigateTo({ url: `/pages/mine/detail/webView?url=${openRemindUrl}` })
}
</script>

<style lang="scss" scoped>
.reminder-page {
  padding: 20px;
  .description {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 500;
  }
}
.node {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #d0d0d0;
  color: #fff;
}

.title {
  color: #333333;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
}

.desc {
  color: rgb(150, 150, 150);
  font-size: 14px;
  margin-bottom: 15px;
}

.action-btn {
  margin-bottom: 20px;
}
</style>
