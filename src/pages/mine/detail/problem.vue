<template>
  <view class="problem-page">
    <view class="text-base font-medium mb-3">常见问题</view>
    <u-collapse>
      <u-collapse-item
        :title="item.head"
        v-for="(item, index) in itemList"
        :key="index"
        :open="item.open"
        :disabled="item.disabled"
      >
        <view class="collapse-item">{{ item.body }}</view>
      </u-collapse-item>
    </u-collapse>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'

// TODO: deadline 20240123 常见问题数据改为接口获取
const itemList = [
  {
    head: '为什么收不到某个牛人的消息？',
    body: '1.请查看当日推送次数是否已用完。（如推送次数不够用可以进行推荐新用户、分享、升级会员等方式增加推送次数）\n 2.请查看订阅的牛人列表，是否被取消收录。（平台会定期根据牛人的订阅量对收录列表进行更新，订阅量低的牛人可能会被取消收录。如有需要，可通过反馈入口向作者提出重新收录） ',
    open: false
  },
  {
    head: '为什么会收到重复推送的消息',
    body: '重复推送一般是作者发布消息后又对消息内容有所更改，更改后重新发布。',
    open: false
  }
]

onLoad(() => {})
</script>

<style lang="scss" scoped>
.problem-page {
  padding: 15px;
  .collapse-item {
    padding: 10px;
    line-height: 24px;
    background-color: #f1f1f1;
    color: #333;
    white-space: pre-wrap;
  }
}
</style>
