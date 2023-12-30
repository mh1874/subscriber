<template>
  <view class="big-v-item">
    <view class="user-info">
      <image class="avatar" :src="props.item.avatar" mode="aspectFill"></image>
      <view class="info-text">
        <view class="font-bold">{{ props.item.nick }}</view>
        <view class="fans">
          <text class="mr-5">
            粉丝：{{ formatFansNum(props.item.fans_num) }}
          </text>
          <text>订阅：{{ props.item.subscript_num }}</text>
        </view>
        <view class="intro">{{ props.item.intro }}</view>
      </view>
    </view>
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

// 格式化粉丝数的函数
const formatFansNum = (fansNum: number) => {
  return fansNum > 10000
    ? `${Math.floor(fansNum / 10000)}万粉丝`
    : `${fansNum}粉丝`
}
</script>

<style lang="scss" scoped>
.big-v-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar {
  width: 50px;
  height: 50px;
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
}

.time {
  color: #888;
  font-size: 12px;
}
</style>
