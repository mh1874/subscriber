<template>
  <view class="message-item">
    <view class="user-info">
      <!-- 添加消息来源平台的图标 -->
      <image
        class="platform-icon"
        :src="getLogo(props.item.source_platform)"
      ></image>
      <image class="avatar" :src="props.item.avatar" mode="aspectFill"></image>
      <view class="info-text">
        <view class="nick">{{ props.item.nick }}</view>
        <view class="time">{{ formatTime(props.item.modified_time) }}</view>
      </view>
    </view>
    <view class="message-content">
      <text class="message-text">{{ props.item.message }}</text>
      <view
        v-if="props.item.needExpand"
        class="expand-button"
        @click="toMessageDetail"
      >
        全文
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, getCurrentInstance } from 'vue'
import xueqiuLogo from '@/static/platform/xueqiu.png'
import weiboLogo from '@/static/platform/weibo.png'
import dongcaiLogo from '@/static/platform/dongcai.png'

const { proxy } = getCurrentInstance()

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// 计算属性，根据 source_platform 返回对应的 logo
const getLogo = (platform) => {
  switch (platform) {
    case 'xq':
      return xueqiuLogo
    case 'wb':
      return weiboLogo
    case 'dc':
      return dongcaiLogo
    default:
      return null // 如果没有匹配到，可以返回默认的 logo 或 null
  }
}
// 格式化时间的函数
const formatTime = (time: string) => {
  return proxy.$dayjs(time).fromNow()
}
const toMessageDetail = () => {
  // 跳转消息详情页
}
</script>

<style lang="scss" scoped>
.message-item {
  background-color: #fff; /* 卡片背景色 */
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.user-info {
  display: flex;
  align-items: center;
}

.platform-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
}

.info-text {
  margin-left: 10px;
  font-size: 14px;
}

.nick {
  font-weight: bold;
}

.time {
  color: #888;
}

.message-content {
  margin-top: 10px;
  .message-text {
    overflow: hidden;
    word-break: break-all;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 7;
    text-overflow: ellipsis;
  }
}

.expand-button {
  color: #3498db;
  cursor: pointer;
  text-align: right;
}
</style>
