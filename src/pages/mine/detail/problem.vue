<template>
  <view class="problem-page">
    <view class="text-base font-medium mb-3">常见问题</view>
    <u-collapse>
      <u-collapse-item
        :title="item.q"
        v-for="(item, index) in faqData.list"
        :key="index"
        :open="item.open"
        :disabled="item.disabled"
      >
        <view class="collapse-item">{{ item.a }}</view>
      </u-collapse-item>
    </u-collapse>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { reactive } from 'vue'
import { mineApi } from '@/api'

const faqData = reactive({ list: {} })

const queryFaqData = () => {
  mineApi
    .getFaqData()
    .then((res) => {
      if (res.status !== 1) return
      faqData.list = res.data.map((it) => {
        return { ...it, open: false }
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

onLoad(() => {
  queryFaqData()
})

onShow(() => {
  uni.$u.mpShare.path = ''
  uni.$u.mpShare.imageUrl = ''
})
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
