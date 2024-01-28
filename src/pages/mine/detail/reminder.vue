<template>
  <view class="p-4">
    <view class="text-base font-medium mb-3">操作步骤</view>
    <u-cell-group :border="false">
      <u-cell-item
        v-for="it in itemList"
        :key="it.key"
        :title="it.title"
        @click="toDetail(it.key)"
      ></u-cell-item>
    </u-cell-group>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'

const itemList = [
  {
    key: 'subscribe',
    title: '第一步：关注公众号（必须）',
    value: '去关注'
  },
  {
    key: 'open',
    title: '第二步：开启消息提醒（必须）'
  }
]

onLoad(() => {})
</script>

<style lang="scss" scoped></style>
