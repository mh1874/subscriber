<template>
  <view class="big-v-item">
    <view class="user-info" @click="toBigVDetail">
      <image class="avatar" :src="props.item.avatar" mode="aspectFill"></image>
      <view class="info-text">
        <view class="font-bold text-sm mb-1">{{ props.item.nick }}</view>
        <view class="fans">
          <text class="mr-5 text-xs"> 粉丝：{{ props.item.fans_num }} </text>
          <text class="text-xs">订阅：{{ props.item.subscript_num }}</text>
        </view>
        <view class="intro text-xs">{{ props.item.intro }}</view>
      </view>
    </view>
    <u-button
      shape="circle"
      type="success"
      plain
      size="mini"
      :disabled="props.item.is_follow"
    >
      订阅
    </u-button>
  </view>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const pageList = getCurrentPages()
const currentPage = pageList[pageList.length - 1]?.route
const bigVWhiteList = ['pages/search/index']

// 跳转消息详情
const toBigVDetail = () => {
  // 大V列表可以跳转消息详情
  if (!bigVWhiteList.includes(currentPage)) return
  uni.navigateTo({
    url: `/pages/bigVDetail/index?id=${props.item.bigv_id}`
  })
}
</script>

<style lang="scss" scoped>
.big-v-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  padding-right: 20px;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.info-text {
  font-size: 14px;
}

.fans {
  color: #888;
  margin-bottom: 5px;
}

.intro {
  color: #666;
  margin-bottom: 5px;
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.time {
  color: #888;
  font-size: 12px;
}
</style>
