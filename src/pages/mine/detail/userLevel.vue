<template>
  <view class="share-page">
    <view class="mb-10 leading-10">
      <view class="text-xl font-semibold mb-5">增加推送次数</view>
      <view class="font-medium">
        <text class="font-medium mr-3">· 点击分享人数：</text>
        <text>{{ data.item.share_num }} 人；</text>
      </view>
      <view class="font-medium">
        <text class="font-medium mr-3">· 有效分享人数：</text>
        <text>{{ data.item.effective_share_num }} 人；</text>
      </view>
    </view>
    <view class="mb-50 leading-10">
      <view class="text-xl font-semibold mb-5">规则</view>
      <view class="font-medium">
        <text class="font-medium mr-3">· 每1个有效分享可获得5次推送次数</text>
      </view>
    </view>
    <u-button type="success" plain open-type="share"> 分享给好友 </u-button>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'

const data = reactive({ item: {} })
const userStore = useUserStore()

// 取需要的 state
const { userInfo } = storeToRefs(userStore)

const queryShareData = () => {
  mineApi
    .getShareData(userInfo.userId)
    .then((v) => {
      // 处理返回数据
      data.item = {
        ...v.data
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

onShow(() => {
  uni.$u.mpShare.path = '/pages/message/index'
  uni.$u.mpShare.imageUrl =
    'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni@2x.png'
})
</script>

<style scoped>
.share-page {
  padding: 20px;
}
</style>
